import {
  RiMicLine,
  RiMicOffLine,
  RiPhoneLine,
  RiChat3Line,
  RiClosedCaptioningLine,
} from "react-icons/ri";
import { MeetButton } from "../MeetButton";

interface InterviewControlsProps {
  micEnabled: boolean;
  captionsOn: boolean;
  chatOpen: boolean;
  elapsedSeconds: number;
  onToggleMic: () => void;
  onToggleCaptions: () => void;
  onToggleChat: () => void;
  onEndInterview: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function InterviewControls({
  micEnabled,
  captionsOn,
  chatOpen,
  elapsedSeconds,
  onToggleMic,
  onToggleCaptions,
  onToggleChat,
  onEndInterview,
}: InterviewControlsProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[rgba(10,10,26,0.85)] backdrop-blur-xl border border-[var(--color-edge)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Timer */}
        <span className="text-sm font-mono text-[var(--color-ink2)] tabular-nums min-w-[52px]">
          {formatTime(elapsedSeconds)}
        </span>

        <div className="w-px h-6 bg-[var(--color-edge)]" />

        {/* Mic */}
        <MeetButton
          icon={micEnabled ? RiMicLine : RiMicOffLine}
          toggled={!micEnabled}
          label={micEnabled ? "Mute" : "Unmute"}
          onClick={onToggleMic}
        />

        {/* Captions */}
        <MeetButton
          icon={RiClosedCaptioningLine}
          toggled={captionsOn}
          label="Captions"
          onClick={onToggleCaptions}
        />

        <div className="w-px h-6 bg-[var(--color-edge)]" />

        {/* End call */}
        <MeetButton
          icon={RiPhoneLine}
          danger
          label="End interview"
          onClick={onEndInterview}
        />

        <div className="w-px h-6 bg-[var(--color-edge)]" />

        {/* Transcript */}
        <MeetButton
          icon={RiChat3Line}
          toggled={chatOpen}
          label="Transcript"
          onClick={onToggleChat}
        />
      </div>
    </div>
  );
}
