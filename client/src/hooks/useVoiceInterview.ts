import { useState, useCallback, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  interviewPublicApi,
  type InterviewPublicData,
} from "../api/interview";
import type { TranscriptMessage } from "../types";

type ConnectionState =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

interface UseVoiceInterviewReturn {
  token: string;
  interview: InterviewPublicData | null;
  isLoading: boolean;
  connectionState: ConnectionState;
  transcript: TranscriptMessage[];
  isAiSpeaking: boolean;
  elapsedSeconds: number;
  micEnabled: boolean;
  connect: () => void;
  disconnect: () => void;
  toggleMic: () => void;
  endInterview: () => Promise<void>;
}

const OPENAI_REALTIME_URL = "https://api.openai.com/v1/realtime";

/**
 * Delay (ms) after AI finishes speaking before re-enabling the mic.
 * Prevents echo bleed from the tail end of AI audio being picked up.
 */
const MIC_UNMUTE_DELAY_MS = 300;

export function useVoiceInterview(): UseVoiceInterviewReturn {
  const { token } = useParams<{ token: string }>();
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("idle");
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [micEnabled, setMicEnabled] = useState(true);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const msgCountRef = useRef(0);
  const transcriptRef = useRef<TranscriptMessage[]>([]);
  const micIntentRef = useRef(true);
  const unmuteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Synchronous guard against double-connect (React Strict Mode) ──
  // React state updates are batched/async, so checking `connectionState`
  // in connect() doesn't prevent a second call during the same render
  // cycle. This ref is set synchronously and prevents duplicate sessions.
  const connectCalledRef = useRef(false);

  const interviewQuery = useQuery<InterviewPublicData>({
    queryKey: ["interview-public", token],
    queryFn: () => interviewPublicApi.getInterview(token!),
    enabled: !!token,
    staleTime: 60_000,
  });

  // Keep transcriptRef in sync for use in endInterview
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Elapsed timer
  useEffect(() => {
    if (connectionState === "connected") {
      timerRef.current = setInterval(
        () => setElapsedSeconds((s) => s + 1),
        1000,
      );
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [connectionState]);

  const addTranscript = useCallback(
    (speaker: "ai" | "candidate", text: string) => {
      if (!text.trim()) return;
      const msg: TranscriptMessage = {
        id: `${speaker}-${Date.now()}-${msgCountRef.current++}`,
        speaker,
        text: text.trim(),
        timestamp: new Date().toISOString(),
      };
      setTranscript((prev) => [...prev, msg]);
    },
    [],
  );

  /** Mute local mic tracks to prevent echo while AI speaks. */
  const muteLocalTracks = useCallback(() => {
    if (unmuteTimerRef.current) {
      clearTimeout(unmuteTimerRef.current);
      unmuteTimerRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
    }
  }, []);

  /** Restore mic tracks after AI finishes (with delay for echo tail). */
  const unmuteLocalTracks = useCallback(() => {
    if (unmuteTimerRef.current) {
      clearTimeout(unmuteTimerRef.current);
    }
    unmuteTimerRef.current = setTimeout(() => {
      if (micIntentRef.current && localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = true;
        });
      }
      unmuteTimerRef.current = null;
    }, MIC_UNMUTE_DELAY_MS);
  }, []);

  const handleRealtimeEvent = useCallback(
    (event: Record<string, unknown>) => {
      const type = event.type as string;

      // AI started generating a response — mute mic to prevent echo
      if (type === "response.created") {
        setIsAiSpeaking(true);
        muteLocalTracks();
      }

      // AI finished responding — unmute mic after a brief delay
      if (type === "response.done") {
        setIsAiSpeaking(false);
        unmuteLocalTracks();
      }

      // AI transcript (text of what the AI said)
      if (
        type === "response.audio_transcript.done" &&
        typeof event.transcript === "string"
      ) {
        addTranscript("ai", event.transcript as string);
      }

      // Candidate transcript (Whisper transcription of candidate audio)
      if (
        type ===
          "conversation.item.input_audio_transcription.completed" &&
        typeof event.transcript === "string"
      ) {
        addTranscript("candidate", event.transcript as string);
      }
    },
    [addTranscript, muteLocalTracks, unmuteLocalTracks],
  );

  const cleanup = useCallback(() => {
    if (unmuteTimerRef.current) {
      clearTimeout(unmuteTimerRef.current);
      unmuteTimerRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (dcRef.current) {
      dcRef.current.close();
      dcRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.srcObject = null;
      audioElRef.current.remove();
      audioElRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const connect = useCallback(async () => {
    // Synchronous ref guard — prevents React Strict Mode double-connect
    if (!token || connectCalledRef.current) return;
    connectCalledRef.current = true;
    setConnectionState("connecting");

    try {
      // 1. Get ephemeral token + session config from backend
      const session = await interviewPublicApi.getRealtimeSession(token);

      // 2. Create RTCPeerConnection
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // 3. Remote audio playback — attached to DOM for proper echo cancellation
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      audioEl.style.display = "none";
      document.body.appendChild(audioEl);
      audioElRef.current = audioEl;

      pc.ontrack = (event) => {
        audioEl.srcObject = event.streams[0];
      };

      // 4. Capture mic and add to peer connection
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      localStreamRef.current = localStream;
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });

      // 5. Data channel for events from OpenAI
      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      dc.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          handleRealtimeEvent(msg);
        } catch {
          // Non-JSON event — ignore
        }
      };

      dc.onopen = () => {
        // Configure session via data channel to ensure settings are applied
        dc.send(
          JSON.stringify({
            type: "session.update",
            session: {
              instructions: session.systemPrompt,
              input_audio_transcription: { model: "whisper-1" },
              turn_detection: {
                type: "semantic_vad",
                eagerness: "low",
                create_response: true,
                interrupt_response: true,
              },
            },
          }),
        );

        // Mute mic before AI greeting to prevent echo pickup
        muteLocalTracks();

        // Trigger AI to speak first (opening greeting)
        dc.send(JSON.stringify({ type: "response.create" }));
      };

      // 6. SDP offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // 7. Exchange SDP with OpenAI
      const sdpResponse = await fetch(
        `${OPENAI_REALTIME_URL}?model=${session.model}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.clientSecret}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp,
        },
      );

      if (!sdpResponse.ok) {
        throw new Error(
          `WebRTC SDP exchange failed: ${sdpResponse.status}`,
        );
      }

      const answerSdp = await sdpResponse.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      // 8. Monitor connection state
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          setConnectionState("connected");
        } else if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed"
        ) {
          setConnectionState("disconnected");
          cleanup();
        }
      };

      // Mark interview as started on the backend
      await interviewPublicApi.startInterview(token);
    } catch (err) {
      console.error("WebRTC connection failed:", err);
      connectCalledRef.current = false;
      setConnectionState("error");
      cleanup();
    }
  }, [token, handleRealtimeEvent, cleanup, muteLocalTracks]);

  const disconnect = useCallback(() => {
    connectCalledRef.current = false;
    setConnectionState("disconnected");
    cleanup();
  }, [cleanup]);

  const endInterview = useCallback(async () => {
    // Save transcript before disconnecting
    const currentTranscript = transcriptRef.current;
    if (token && currentTranscript.length > 0) {
      const messages = currentTranscript.map((msg, i) => ({
        speaker: msg.speaker,
        text: msg.text,
        sort_order: i,
      }));
      try {
        await interviewPublicApi.saveTranscript(token, messages);
      } catch (err) {
        console.error("Failed to save transcript:", err);
      }
    }

    disconnect();

    if (token) {
      await interviewPublicApi.completeInterview(token);
    }
  }, [disconnect, token]);

  const toggleMic = useCallback(() => {
    setMicEnabled((prev) => {
      const next = !prev;
      micIntentRef.current = next;
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = next;
        });
      }
      return next;
    });
  }, []);

  // Cleanup on unmount — ensures React Strict Mode teardown closes
  // the first connection before the remount creates a new one.
  useEffect(() => {
    return () => {
      connectCalledRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  return {
    token: token ?? "",
    interview: interviewQuery.data ?? null,
    isLoading: interviewQuery.isLoading,
    connectionState,
    transcript,
    isAiSpeaking,
    elapsedSeconds,
    micEnabled,
    connect,
    disconnect,
    toggleMic,
    endInterview,
  };
}
