import { useState, useCallback, useRef, useEffect } from "react";
import { tutoringApi } from "../api/tutoring";

type ConnectionState = "idle" | "connecting" | "connected" | "disconnected" | "error";

interface VoiceTranscriptEntry {
  id: string;
  speaker: "ai" | "user";
  text: string;
  timestamp: string;
}

interface UseVoiceTutoringReturn {
  connectionState: ConnectionState;
  transcript: VoiceTranscriptEntry[];
  isAiSpeaking: boolean;
  micEnabled: boolean;
  connect: (sessionId: string) => void;
  disconnect: () => void;
  toggleMic: () => void;
}

const OPENAI_REALTIME_URL = "https://api.openai.com/v1/realtime";
const MIC_UNMUTE_DELAY_MS = 300;

export function useVoiceTutoring(): UseVoiceTutoringReturn {
  const [connectionState, setConnectionState] = useState<ConnectionState>("idle");
  const [transcript, setTranscript] = useState<VoiceTranscriptEntry[]>([]);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const msgCountRef = useRef(0);
  const micIntentRef = useRef(true);
  const unmuteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectCalledRef = useRef(false);

  const addTranscript = useCallback((speaker: "ai" | "user", text: string) => {
    if (!text.trim()) return;
    const entry: VoiceTranscriptEntry = {
      id: `${speaker}-${Date.now()}-${msgCountRef.current++}`,
      speaker,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setTranscript((prev) => [...prev, entry]);
  }, []);

  const muteLocalTracks = useCallback(() => {
    if (unmuteTimerRef.current) {
      clearTimeout(unmuteTimerRef.current);
      unmuteTimerRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => { t.enabled = false; });
    }
  }, []);

  const unmuteLocalTracks = useCallback(() => {
    if (unmuteTimerRef.current) clearTimeout(unmuteTimerRef.current);
    unmuteTimerRef.current = setTimeout(() => {
      if (micIntentRef.current && localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((t) => { t.enabled = true; });
      }
      unmuteTimerRef.current = null;
    }, MIC_UNMUTE_DELAY_MS);
  }, []);

  const handleRealtimeEvent = useCallback(
    (event: Record<string, unknown>) => {
      const type = event.type as string;

      if (type === "response.created") {
        setIsAiSpeaking(true);
        muteLocalTracks();
      }
      if (type === "response.done") {
        setIsAiSpeaking(false);
        unmuteLocalTracks();
      }
      if (type === "response.audio_transcript.done" && typeof event.transcript === "string") {
        addTranscript("ai", event.transcript as string);
      }
      if (
        type === "conversation.item.input_audio_transcription.completed" &&
        typeof event.transcript === "string"
      ) {
        addTranscript("user", event.transcript as string);
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
    if (dcRef.current) { dcRef.current.close(); dcRef.current = null; }
    if (pcRef.current) { pcRef.current.close(); pcRef.current = null; }
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.srcObject = null;
      audioElRef.current.remove();
      audioElRef.current = null;
    }
  }, []);

  const connect = useCallback(
    async (sessionId: string) => {
      if (connectCalledRef.current) return;
      connectCalledRef.current = true;
      setConnectionState("connecting");

      try {
        const { data: session } = await tutoringApi.getRealtimeSession(sessionId);

        const pc = new RTCPeerConnection();
        pcRef.current = pc;

        const audioEl = document.createElement("audio");
        audioEl.autoplay = true;
        audioEl.style.display = "none";
        document.body.appendChild(audioEl);
        audioElRef.current = audioEl;

        pc.ontrack = (event) => { audioEl.srcObject = event.streams[0]; };

        const localStream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
        localStreamRef.current = localStream;
        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

        const dc = pc.createDataChannel("oai-events");
        dcRef.current = dc;

        dc.onmessage = (event) => {
          try {
            handleRealtimeEvent(JSON.parse(event.data));
          } catch { /* non-JSON event */ }
        };

        dc.onopen = () => {
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
          muteLocalTracks();
          dc.send(JSON.stringify({ type: "response.create" }));
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

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
          throw new Error(`WebRTC SDP exchange failed: ${sdpResponse.status}`);
        }

        const answerSdp = await sdpResponse.text();
        await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

        pc.onconnectionstatechange = () => {
          if (pc.connectionState === "connected") {
            setConnectionState("connected");
          } else if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
            setConnectionState("disconnected");
            cleanup();
          }
        };
      } catch (err) {
        console.error("Voice tutoring WebRTC failed:", err);
        connectCalledRef.current = false;
        setConnectionState("error");
        cleanup();
      }
    },
    [handleRealtimeEvent, cleanup, muteLocalTracks],
  );

  const disconnect = useCallback(() => {
    connectCalledRef.current = false;
    setConnectionState("disconnected");
    cleanup();
  }, [cleanup]);

  const toggleMic = useCallback(() => {
    setMicEnabled((prev) => {
      const next = !prev;
      micIntentRef.current = next;
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((t) => { t.enabled = next; });
      }
      return next;
    });
  }, []);

  useEffect(() => {
    return () => {
      connectCalledRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  return {
    connectionState,
    transcript,
    isAiSpeaking,
    micEnabled,
    connect,
    disconnect,
    toggleMic,
  };
}
