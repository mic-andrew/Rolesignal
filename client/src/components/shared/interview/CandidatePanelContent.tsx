import { RiMicLine, RiMicOffLine } from "react-icons/ri";

interface CandidatePanelContentProps {
  candidateName: string;
  micEnabled: boolean;
  isSpeaking: boolean;
}

function makeInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2)
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function CandidatePanelContent({
  candidateName,
  micEnabled,
  isSpeaking,
}: CandidatePanelContentProps) {
  const initials = makeInitials(candidateName);

  return (
    <>
      {/* Candidate avatar */}
      <div
        className={`rounded-full p-1 transition-shadow duration-500 ${
          isSpeaking
            ? "shadow-[0_0_0_4px_rgba(34,201,151,0.4),0_0_40px_rgba(34,201,151,0.15)]"
            : ""
        }`}
      >
        <div
          className="rounded-full flex items-center justify-center bg-[linear-gradient(145deg,#3A3A70,#252550)]"
          style={{ width: 100, height: 100 }}
        >
          <span className="text-[38px] font-bold text-[var(--color-ink)]">
            {initials}
          </span>
        </div>
      </div>

      {/* Bottom badge */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
          <div className="w-5 h-5 rounded-full bg-[var(--color-success)] flex items-center justify-center text-[9px] font-bold text-white">
            {initials[0]}
          </div>
          <span className="text-[12px] font-medium text-[var(--color-ink)]">
            {candidateName}
          </span>
          <span className="text-[11px] text-[var(--color-ink3)]">(You)</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
          {micEnabled ? (
            <RiMicLine size={14} className="text-[var(--color-success)]" />
          ) : (
            <RiMicOffLine size={14} className="text-[var(--color-danger)]" />
          )}
        </div>
      </div>
    </>
  );
}
