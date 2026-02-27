import {
  RiMicLine,
  RiMicOffLine,
  RiErrorWarningLine,
} from "react-icons/ri";

interface LobbyPreviewPanelProps {
  candidateName: string;
  micOn: boolean;
  micPermission: "granted" | "denied" | "prompt";
  onToggleMic: () => void;
}

function makeInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2)
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function AudioWaveform() {
  return (
    <div className="flex gap-[3px] items-end h-5 mt-4">
      {[0, 1, 2, 3, 4, 3, 2, 1, 0].map((_v, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-brand animate-waveform min-h-[3px]"
          style={{
            animationDuration: `${0.4 + i * 0.05}s`,
            animationDelay: `${i * 50}ms`,
          }}
        />
      ))}
    </div>
  );
}

export function LobbyPreviewPanel({
  candidateName,
  micOn,
  micPermission,
  onToggleMic,
}: LobbyPreviewPanelProps) {
  const initials = makeInitials(candidateName);
  const micGranted = micPermission === "granted";
  const micActive = micGranted && micOn;

  return (
    <div className="relative flex flex-col items-center justify-center h-full rounded-2xl overflow-hidden bg-[#0A0A1A] border border-[var(--color-edge)]">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none animate-radial-pulse"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, rgba(124,111,255,0.10), transparent 65%)",
        }}
      />

      {/* Candidate avatar */}
      <div className="relative z-10 flex flex-col items-center">
        <div
          className={`rounded-full flex items-center justify-center bg-[linear-gradient(145deg,#7C6FFF,#5046E5)] transition-shadow duration-500 ${
            micActive
              ? "shadow-[0_0_0_4px_rgba(124,111,255,0.3),0_0_60px_rgba(124,111,255,0.15)]"
              : "shadow-[0_0_30px_rgba(124,111,255,0.2)]"
          }`}
          style={{ width: 120, height: 120 }}
        >
          <span className="text-[44px] font-bold text-white/90">
            {initials}
          </span>
        </div>

        {micActive && <AudioWaveform />}

        {!micActive && (
          <p className="text-[13px] text-[var(--color-ink3)] mt-4">
            {micGranted ? "Microphone muted" : "Camera is off"}
          </p>
        )}
      </div>

      {/* Mic denied warning */}
      {micPermission === "denied" && (
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center gap-2 p-3 rounded-xl bg-[rgba(255,90,90,0.08)] border border-[rgba(255,90,90,0.2)]">
          <RiErrorWarningLine
            size={16}
            className="text-[var(--color-danger)] shrink-0"
          />
          <span className="text-[12px] text-[var(--color-danger)]">
            Microphone access required. Please allow in browser settings.
          </span>
        </div>
      )}

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur-sm border-t border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-[13px] font-bold text-white">
            {initials[0]}
          </div>
          <span className="text-[13px] font-medium text-[var(--color-ink)]">
            {candidateName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMic}
            className={`flex items-center justify-center w-10 h-10 rounded-full border cursor-pointer transition-all ${
              micActive
                ? "bg-[var(--acg)] border-[rgba(124,111,255,0.3)]"
                : "bg-[rgba(255,90,90,0.1)] border-[rgba(255,90,90,0.2)]"
            }`}
          >
            {micActive ? (
              <RiMicLine size={18} className="text-[var(--color-brand)]" />
            ) : (
              <RiMicOffLine size={18} className="text-[var(--color-danger)]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
