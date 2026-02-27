import { RiMicLine } from "react-icons/ri";
import avatarSrc from "../../../assets/sofia-gutierrez.webp";

interface AIPanelContentProps {
  isAiSpeaking: boolean;
  isConnected: boolean;
  lastAiMessage: string;
  connectionState: string;
}

const AI_NAME = "Sophie";

function StatusBadge({
  isConnected,
  isAiSpeaking,
  connectionState,
}: {
  isConnected: boolean;
  isAiSpeaking: boolean;
  connectionState: string;
}) {
  const label =
    connectionState === "connecting"
      ? "Connecting..."
      : connectionState === "error"
        ? "Error"
        : isAiSpeaking
          ? "Speaking"
          : "Ready";

  const dotColor = isConnected
    ? "bg-[var(--color-success)]"
    : "bg-[var(--color-ink3)]";

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
      <RiMicLine size={12} className="text-[var(--color-success)]" />
      <span
        className={`w-1.5 h-1.5 rounded-full ${dotColor} ${isAiSpeaking ? "animate-pulse" : ""}`}
      />
      <span className="text-[11px] font-medium text-[var(--color-ink2)]">
        {label}
      </span>
    </div>
  );
}

export function AIPanelContent({
  isAiSpeaking,
  isConnected,
  lastAiMessage,
  connectionState,
}: AIPanelContentProps) {
  return (
    <>
      {/* Avatar area */}
      <div className="flex flex-col items-center">
        <div
          className={`rounded-full p-1 transition-shadow duration-500 ${
            isAiSpeaking
              ? "shadow-[0_0_0_4px_rgba(124,111,255,0.4),0_0_60px_rgba(124,111,255,0.2)]"
              : ""
          }`}
        >
          <img
            src={avatarSrc}
            alt={AI_NAME}
            className="w-[100px] h-[100px] rounded-full object-cover shadow-[0_0_30px_rgba(124,111,255,0.35)]"
          />
        </div>
        <span className="text-sm font-semibold text-[var(--color-brand3)] mt-3">
          {AI_NAME}
        </span>
        <span className="text-[11px] text-[var(--color-ink3)] mt-0.5">
          Your AI Interviewer
        </span>

        {/* Waveform when speaking */}
        {isAiSpeaking && (
          <div className="flex gap-[3px] items-end h-4 mt-2">
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
      </div>

      {/* Message bubble */}
      {lastAiMessage && (
        <div
          key={lastAiMessage.slice(0, 30)}
          className="animate-fade-in mx-8 mt-5 max-w-[480px]"
        >
          <div className="rounded-xl px-5 py-4 bg-[rgba(124,111,255,0.06)] border border-[rgba(124,111,255,0.12)]">
            <p className="text-[13px] text-[var(--color-ink2)] leading-relaxed text-center">
              {lastAiMessage}
            </p>
          </div>
        </div>
      )}

      {/* Bottom badges */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(124,111,255,0.12)] border border-[rgba(124,111,255,0.2)]">
          <img
            src={avatarSrc}
            alt={AI_NAME}
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="text-[11px] font-semibold text-[var(--color-brand2)]">
            {AI_NAME}
          </span>
        </div>
        <StatusBadge
          isConnected={isConnected}
          isAiSpeaking={isAiSpeaking}
          connectionState={connectionState}
        />
      </div>
    </>
  );
}
