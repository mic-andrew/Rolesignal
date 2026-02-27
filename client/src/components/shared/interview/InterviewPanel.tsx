import type { ReactNode } from "react";

interface InterviewPanelProps {
  children: ReactNode;
  variant: "ai" | "candidate";
  speaking?: boolean;
}

export function InterviewPanel({
  children,
  variant,
  speaking = false,
}: InterviewPanelProps) {
  const glowColor =
    variant === "ai"
      ? "rgba(124,111,255,0.10)"
      : "rgba(34,201,151,0.06)";

  const glowColorActive =
    variant === "ai"
      ? "rgba(124,111,255,0.18)"
      : "rgba(34,201,151,0.12)";

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center rounded-2xl overflow-hidden bg-[#0A0A1A] border border-[var(--color-edge)]">
      {/* Radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at 50% 25%, ${speaking ? glowColorActive : glowColor}, transparent 65%)`,
        }}
      />
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        {children}
      </div>
    </div>
  );
}
