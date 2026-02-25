import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiMicLine, RiMicOffLine, RiPhoneLine, RiChat3Line,
  RiCloseLine, RiClosedCaptioningLine, RiUserLine,
} from "react-icons/ri";
import { useVoiceInterview } from "../hooks/useVoiceInterview";
import { TranscriptPanel } from "../components/shared/TranscriptPanel";
import { AIAvatar } from "../components/shared/AIAvatar";
import { Avatar } from "../components/ui/Avatar";
import { MeetButton } from "../components/shared/MeetButton";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
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
  const candidateInitials = candidateName
    .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
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

  return (
    <div className="flex flex-col h-screen bg-[#202124] text-[#E8EAED]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 shrink-0 h-14">
        <div className="flex items-center gap-3">
          {LOGO}
          <span className="text-[15px] font-semibold tracking-tight">
            {orgName} Interview
          </span>
          <span className="text-xs text-[#5F6368]">|</span>
          <span className="text-[13px] font-mono text-[#9AA0A6]">
            {formatTime(elapsedSeconds)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${connectionState === "connected" ? "bg-[#22C997]" : "bg-[#9AA0A6]"}`} />
          <span className={`text-[12px] font-medium ${connectionState === "connected" ? "text-[#22C997]" : "text-[#9AA0A6]"}`}>
            {statusLabel}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-[#9AA0A6]">
          <RiUserLine size={16} />
          <span>2</span>
        </div>
      </div>

      {/* Main video area */}
      <div className="flex flex-1 overflow-hidden px-3 pb-3 gap-3">
        <div className="flex-1 flex gap-3">
          {/* Candidate tile */}
          <div className="flex-2 relative rounded-lg overflow-hidden bg-[#3C4043]">
            <div className="absolute inset-0 flex items-center justify-center">
              <Avatar initials={candidateInitials} size={120} color="#7C6FFF" />
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded bg-black/55">
              <span className="text-[13px] font-medium">{candidateName}</span>
              {!micEnabled && <RiMicOffLine size={14} className="text-[#EA4335]" />}
            </div>
            {captionsOn && lastAiMessage && (
              <div className="absolute bottom-14 left-1/2 -translate-x-1/2 max-w-[560px] w-full px-4">
                <div className="rounded-lg px-4 py-2.5 text-center bg-black/75">
                  <span className="text-sm leading-relaxed">{lastAiMessage}</span>
                </div>
              </div>
            )}
          </div>

          {/* AI interviewer tile */}
          <div className={`relative rounded-lg overflow-hidden shrink-0 flex flex-col items-center justify-center gap-2 bg-[#1A1A2E] border border-[rgba(124,111,255,0.15)] ${chatOpen ? "w-[200px]" : "w-[280px]"}`}>
            <AIAvatar size={chatOpen ? 52 : 68} speaking={isAiSpeaking} />
            <span className="text-[13px] font-semibold text-[#BEB8FF]">Aria</span>
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/55">
              <span
                className={`w-1.5 h-1.5 rounded-full ${isAiSpeaking ? "bg-[#22C997]" : "bg-[#9AA0A6]"}`}
              />
              <span className="text-[11px] font-medium">
                {isAiSpeaking ? "Speaking" : "Listening"}
              </span>
            </div>
          </div>
        </div>

        {/* Transcript panel */}
        {chatOpen && (
          <div className="w-[360px] flex flex-col shrink-0 rounded-lg overflow-hidden bg-[#2D2E30]">
            <div className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-[#3C4043]">
              <span className="text-sm font-semibold">Live Transcript</span>
              <button
                onClick={() => setChatOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-transparent border-0 transition-colors text-[#9AA0A6]"
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

      {/* Bottom control bar */}
      <div className="flex items-center justify-between px-5 shrink-0 h-20">
        <div className="flex-1" />
        <div className="flex items-center gap-2">
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
          <div className="w-px h-8 mx-1 bg-[#3C4043]" />
          <MeetButton icon={RiPhoneLine} danger label="End interview" onClick={handleEndInterview} />
        </div>
        <div className="flex-1 flex justify-end gap-2">
          <MeetButton icon={RiChat3Line} toggled={chatOpen} label="Transcript" onClick={() => setChatOpen(!chatOpen)} />
        </div>
      </div>

      <div className="text-center pb-2">
        <span className="text-[10px] font-medium text-[#5F6368]">Powered by RoleSignal</span>
      </div>
    </div>
  );
}
