import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiMicLine, RiMicOffLine, RiCameraLine, RiCameraOffLine,
  RiPhoneLine, RiArrowRightSLine, RiChat3Line, RiUserLine,
  RiCloseLine, RiClosedCaptioningLine,
} from "react-icons/ri";
import { useInterview } from "../hooks/useInterview";
import { TranscriptPanel } from "../components/shared/TranscriptPanel";
import { AIAvatar } from "../components/shared/AIAvatar";
import { Avatar } from "../components/ui/Avatar";

function MeetButton({
  icon: Icon,
  toggled = false,
  danger = false,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ size: number }>;
  toggled?: boolean;
  danger?: boolean;
  label?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="relative group flex items-center justify-center rounded-full cursor-pointer border-0 transition-colors duration-200"
      style={{
        width: danger ? 56 : 48,
        height: 48,
        borderRadius: danger ? 24 : "50%",
        background: danger
          ? "#EA4335"
          : toggled
            ? "#3C4043"
            : "rgba(255,255,255,0.08)",
        color: "#E8EAED",
      }}
    >
      <Icon size={20} />
      {label && (
        <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ color: "#9AA0A6" }}>
          {label}
        </span>
      )}
    </button>
  );
}

export default function InterviewRoom() {
  const navigate = useNavigate();
  const {
    token, interview, stages, stageIndex, currentStage, currentQuestion,
    questionIndex, stageQuestions, transcript, advanceQuestion,
  } = useInterview();

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);

  const candidateName = interview?.candidateName ?? "Candidate";
  const candidateInitials = candidateName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const orgName = interview?.orgName ?? "RoleSignal";

  const timeStr = "28:34";
  const totalQ = stages.length * 3;
  const currentQ = stageIndex * 3 + questionIndex + 1;
  const progress = (currentQ / totalQ) * 100;

  return (
    <div className="flex flex-col h-screen" style={{ background: "#202124", color: "#E8EAED" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 shrink-0" style={{ height: 56 }}>
        {/* Left: meeting info */}
        <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <defs>
              <linearGradient id="meet-lg" x1="0" y1="0" x2="32" y2="32">
                <stop stopColor="#7C6FFF" /><stop offset="1" stopColor="#5046E5" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#meet-lg)" />
            <path d="M8 16L16 8L24 16L16 24Z" fill="white" opacity="0.85" />
            <path d="M12 16L16 12L20 16L16 20Z" fill="url(#meet-lg)" />
          </svg>
          <span className="text-[15px] font-semibold tracking-tight">{orgName} Interview</span>
          <span className="text-xs" style={{ color: "#5F6368" }}>|</span>
          <span className="text-[13px] font-mono" style={{ color: "#9AA0A6" }}>{timeStr}</span>
        </div>

        {/* Center: stage progress (subtle pills) */}
        <div className="flex items-center gap-1.5">
          {stages.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div
                className="rounded-full transition-all duration-500"
                style={{
                  width: i === stageIndex ? 32 : 16,
                  height: 4,
                  background: i < stageIndex
                    ? "#7C6FFF"
                    : i === stageIndex
                      ? "#7C6FFF"
                      : "#3C4043",
                  opacity: i <= stageIndex ? 1 : 0.5,
                }}
              />
            </div>
          ))}
          <span className="text-[11px] font-medium ml-2" style={{ color: "#9AA0A6" }}>{currentStage}</span>
        </div>

        {/* Right: participants */}
        <div className="flex items-center gap-2 text-[13px]" style={{ color: "#9AA0A6" }}>
          <RiUserLine size={16} />
          <span>2</span>
        </div>
      </div>

      {/* Main video area */}
      <div className="flex flex-1 overflow-hidden px-3 pb-3 gap-3">
        {/* Video grid */}
        <div className="flex-1 flex gap-3">
          {/* Candidate tile (large) */}
          <div className="flex-2 relative rounded-lg overflow-hidden" style={{ background: "#3C4043" }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <Avatar initials={candidateInitials} size={120} color="#7C6FFF" />
            </div>

            {/* Name overlay bottom-left */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded" style={{ background: "rgba(0,0,0,0.55)" }}>
              <span className="text-[13px] font-medium">{candidateName}</span>
            </div>

            {/* Progress bar top */}
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full transition-all duration-700"
                style={{ width: `${progress}%`, background: "#7C6FFF", borderRadius: "0 2px 2px 0" }}
              />
            </div>

            {/* Stage + question badge top-left */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded"
                style={{ background: "rgba(124,111,255,0.25)", color: "#BEB8FF" }}
              >
                {currentStage}
              </span>
              <span className="text-[11px]" style={{ color: "#9AA0A6" }}>
                Q{Math.min(questionIndex + 1, stageQuestions.length)}/{stageQuestions.length}
              </span>
            </div>

            {/* Captions overlay */}
            {captionsOn && (
              <div className="absolute bottom-14 left-1/2 -translate-x-1/2 max-w-[560px] w-full px-4">
                <div className="rounded-lg px-4 py-2.5 text-center" style={{ background: "rgba(0,0,0,0.75)" }}>
                  <span className="text-sm leading-relaxed">{currentQuestion}</span>
                </div>
              </div>
            )}
          </div>

          {/* AI interviewer tile (smaller) */}
          <div
            className="relative rounded-lg overflow-hidden shrink-0 flex flex-col items-center justify-center gap-2"
            style={{
              width: chatOpen ? 200 : 280,
              background: "#1A1A2E",
              border: "1px solid rgba(124,111,255,0.15)",
            }}
          >
            <AIAvatar size={chatOpen ? 52 : 68} speaking />
            <span className="text-[13px] font-semibold" style={{ color: "#BEB8FF" }}>Aria</span>

            {/* Name + status bottom-left */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded" style={{ background: "rgba(0,0,0,0.55)" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-breathe" style={{ background: "#22C997" }} />
              <span className="text-[11px] font-medium">Speaking</span>
            </div>
          </div>
        </div>

        {/* Transcript panel (toggleable sidebar) */}
        {chatOpen && (
          <div
            className="w-[360px] flex flex-col shrink-0 rounded-lg overflow-hidden"
            style={{ background: "#2D2E30" }}
          >
            <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: "1px solid #3C4043" }}>
              <span className="text-sm font-semibold">Live Transcript</span>
              <button
                onClick={() => setChatOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-transparent border-0 transition-colors"
                style={{ color: "#9AA0A6" }}
              >
                <RiCloseLine size={18} />
              </button>
            </div>
            <TranscriptPanel messages={transcript} candidateName={candidateName.split(" ")[0]} showTyping />
          </div>
        )}
      </div>

      {/* Bottom control bar */}
      <div className="flex items-center justify-between px-5 shrink-0" style={{ height: 80 }}>
        {/* Left: question preview */}
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-[13px] truncate max-w-[320px]" style={{ color: "#9AA0A6" }}>
            {currentQuestion}
          </p>
        </div>

        {/* Center: controls */}
        <div className="flex items-center gap-2">
          <MeetButton
            icon={micOn ? RiMicLine : RiMicOffLine}
            toggled={!micOn}
            label={micOn ? "Mute" : "Unmute"}
            onClick={() => setMicOn(!micOn)}
          />
          <MeetButton
            icon={camOn ? RiCameraLine : RiCameraOffLine}
            toggled={!camOn}
            label={camOn ? "Camera off" : "Camera on"}
            onClick={() => setCamOn(!camOn)}
          />
          <MeetButton
            icon={RiClosedCaptioningLine}
            toggled={captionsOn}
            label="Captions"
            onClick={() => setCaptionsOn(!captionsOn)}
          />
          <MeetButton
            icon={RiArrowRightSLine}
            label="Next question"
            onClick={advanceQuestion}
          />

          <div className="w-px h-8 mx-1" style={{ background: "#3C4043" }} />

          <MeetButton
            icon={RiPhoneLine}
            danger
            label="End interview"
            onClick={() => navigate(`/i/${token}/complete`)}
          />
        </div>

        {/* Right: panel toggles */}
        <div className="flex-1 flex justify-end gap-2">
          <MeetButton
            icon={RiChat3Line}
            toggled={chatOpen}
            label="Transcript"
            onClick={() => setChatOpen(!chatOpen)}
          />
        </div>
      </div>

      {/* Powered by footer */}
      <div className="text-center pb-2">
        <span className="text-[10px] font-medium" style={{ color: "#5F6368" }}>
          Powered by RoleSignal
        </span>
      </div>
    </div>
  );
}
