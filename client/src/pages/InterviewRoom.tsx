import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiMicLine, RiMicOffLine, RiPhoneLine, RiChat3Line,
  RiCloseLine, RiClosedCaptioningLine, RiUserLine,
} from "react-icons/ri";
import { useVoiceInterview } from "../hooks/useVoiceInterview";
import { TranscriptPanel } from "../components/shared/TranscriptPanel";
import { MeetButton } from "../components/shared/MeetButton";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function makeInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const LOGO = (
  <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
    <defs>
      <linearGradient id="meet-lg" x1="0" y1="0" x2="32" y2="32">
        <stop stopColor="#7C6FFF" />
        <stop offset="1" stopColor="#5046E5" />
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="url(#meet-lg)" />
    <path d="M8 16L16 8L24 16L16 24Z" fill="white" opacity="0.85" />
    <path d="M12 16L16 12L20 16L16 20Z" fill="url(#meet-lg)" />
  </svg>
);

export default function InterviewRoom() {
  const navigate = useNavigate();
  const {
    token, interview, connectionState, transcript,
    isAiSpeaking, elapsedSeconds, micEnabled, connect, toggleMic, endInterview,
  } = useVoiceInterview();

  const [chatOpen, setChatOpen] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(true);

  useEffect(() => {
    if (connectionState === "idle") connect();
  }, [connectionState, connect]);

  const candidateName = interview?.candidateName ?? "Candidate";
  const candidateInitials = makeInitials(candidateName);
  const orgName = interview?.orgName ?? "RoleSignal";
  const lastAiMessage =
    [...transcript].reverse().find((m) => m.speaker === "ai")?.text ?? "";

  const handleEndInterview = async () => {
    await endInterview();
    navigate(`/i/${token}/complete`);
  };

  const statusLabel =
    connectionState === "connecting" ? "Connecting..."
    : connectionState === "connected" ? (isAiSpeaking ? "Speaking" : "Listening")
    : connectionState === "error" ? "Connection Error"
    : "Disconnected";

  const isConnected = connectionState === "connected";
  const candidateSpeaking = isConnected && !isAiSpeaking && micEnabled;

  return (
    <div className="flex flex-col h-screen bg-[#1A1A1A] text-[#E8EAED] select-none">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-5 shrink-0 h-14 bg-[#202124]">
        <div className="flex items-center gap-3">
          {LOGO}
          <span className="text-[15px] font-semibold tracking-tight">
            {orgName} <span className="text-[#9AA0A6] font-normal">Interview</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[13px] font-mono text-[#9AA0A6] tabular-nums">
            {formatTime(elapsedSeconds)}
          </span>
          <div className="w-px h-4 bg-[#3C4043]" />
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full transition-colors ${isConnected ? "bg-[#22C997]" : "bg-[#9AA0A6]"} ${isConnected && isAiSpeaking ? "animate-pulse" : ""}`}
            />
            <span className={`text-[12px] font-medium ${isConnected ? "text-[#22C997]" : "text-[#9AA0A6]"}`}>
              {statusLabel}
            </span>
          </div>
          <div className="w-px h-4 bg-[#3C4043]" />
          <div className="flex items-center gap-1.5 text-[13px] text-[#9AA0A6]">
            <RiUserLine size={14} />
            <span>2</span>
          </div>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden gap-0">
        {/* Video grid */}
        <div className="flex-1 flex gap-3 p-3">
          {/* Candidate tile (large) */}
          <div className="flex-1 relative rounded-xl overflow-hidden bg-[#2D2E30]">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Speaking ring animation */}
              <div
                className={`rounded-full p-1 transition-shadow duration-500 ${candidateSpeaking ? "shadow-[0_0_0_4px_rgba(34,201,151,0.4),0_0_40px_rgba(34,201,151,0.15)]" : ""}`}
              >
                <div
                  className="rounded-full flex items-center justify-center bg-[linear-gradient(145deg,#7C6FFF,#5046E5)]"
                  style={{ width: 120, height: 120 }}
                >
                  <span className="text-[44px] font-bold text-white/90">{candidateInitials}</span>
                </div>
              </div>
            </div>

            {/* Name badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
              <span className="text-[13px] font-medium">{candidateName}</span>
              {!micEnabled && <RiMicOffLine size={13} className="text-[#EA4335]" />}
            </div>

            {/* You badge */}
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm">
              <span className="text-[10px] font-semibold text-[#9AA0A6] uppercase tracking-wider">You</span>
            </div>

            {/* Live captions overlay */}
            {captionsOn && lastAiMessage && (
              <div className="absolute bottom-14 left-1/2 -translate-x-1/2 max-w-[600px] w-full px-4 animate-fade-in">
                <div className="rounded-lg px-5 py-3 text-center bg-black/80 backdrop-blur-sm">
                  <span className="text-sm leading-relaxed">{lastAiMessage}</span>
                </div>
              </div>
            )}
          </div>

          {/* AI interviewer tile */}
          <div
            className={`relative rounded-xl overflow-hidden shrink-0 flex flex-col items-center justify-center bg-[#1A1A2E] border transition-all duration-300 ${isAiSpeaking ? "border-brand/30" : "border-[rgba(124,111,255,0.12)]"} ${chatOpen ? "w-[200px]" : "w-[280px]"}`}
          >
            {/* Speaking glow ring */}
            <div
              className={`rounded-full p-1 transition-shadow duration-300 ${isAiSpeaking ? "shadow-[0_0_0_3px_rgba(124,111,255,0.5),0_0_50px_rgba(124,111,255,0.2)]" : ""}`}
            >
              <div
                className="rounded-full flex items-center justify-center bg-[linear-gradient(145deg,var(--color-brand),#5046E5)]"
                style={{ width: chatOpen ? 52 : 68, height: chatOpen ? 52 : 68 }}
              >
                <span style={{ fontSize: chatOpen ? 20 : 26 }} className="text-white">&#10022;</span>
              </div>
            </div>

            <span className="text-[13px] font-semibold text-[#BEB8FF] mt-2.5">Aria</span>

            {/* Waveform */}
            {isAiSpeaking && (
              <div className="flex gap-[3px] items-center h-4 mt-2">
                {[0, 1, 2, 3, 4, 3, 2].map((_v, i) => (
                  <div
                    key={i}
                    className="w-[3px] rounded-full bg-brand animate-waveform min-h-[3px]"
                    style={{
                      animationDuration: `${0.4 + i * 0.06}s`,
                      animationDelay: `${i * 60}ms`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Status badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm">
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${isAiSpeaking ? "bg-[#22C997] animate-pulse" : "bg-[#9AA0A6]"}`}
              />
              <span className="text-[11px] font-medium">
                {isAiSpeaking ? "Speaking" : "Listening"}
              </span>
            </div>
          </div>
        </div>

        {/* Transcript panel */}
        {chatOpen && (
          <div className="w-[360px] flex flex-col shrink-0 bg-[#202124] border-l border-[#3C4043]">
            <div className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-[#3C4043]">
              <span className="text-sm font-semibold">Live Transcript</span>
              <button
                onClick={() => setChatOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-transparent border-0 transition-colors text-[#9AA0A6] hover:bg-white/[0.08]"
              >
                <RiCloseLine size={18} />
              </button>
            </div>
            <TranscriptPanel
              messages={transcript}
              candidateName={candidateName.split(" ")[0]}
              showTyping={isAiSpeaking}
            />
          </div>
        )}
      </div>

      {/* ── Bottom control bar ──────────────────────────────── */}
      <div className="flex items-center justify-between px-5 shrink-0 h-20 bg-[#202124]">
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <MeetButton
            icon={micEnabled ? RiMicLine : RiMicOffLine}
            toggled={!micEnabled}
            label={micEnabled ? "Mute" : "Unmute"}
            onClick={toggleMic}
          />
          <MeetButton
            icon={RiClosedCaptioningLine}
            toggled={captionsOn}
            label="Captions"
            onClick={() => setCaptionsOn(!captionsOn)}
          />
          <div className="w-px h-8 bg-[#3C4043]" />
          <MeetButton icon={RiPhoneLine} danger label="End interview" onClick={handleEndInterview} />
        </div>
        <div className="flex-1 flex justify-end gap-2">
          <MeetButton icon={RiChat3Line} toggled={chatOpen} label="Transcript" onClick={() => setChatOpen(!chatOpen)} />
        </div>
      </div>

      <div className="text-center pb-2 bg-[#202124]">
        <span className="text-[10px] font-medium text-[#3C4043]">Powered by RoleSignal</span>
      </div>
    </div>
  );
}
