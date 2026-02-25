import { RiCheckLine } from "react-icons/ri";
import { useProcessing } from "../hooks/useProcessing";
import { ScoreRing } from "../components/ui/ScoreRing";

export default function Processing() {
  const { phase, phases, scoreProgress } = useProcessing();

  return (
    <div
      className="flex items-center justify-center relative overflow-hidden min-h-screen bg-[var(--color-canvas)]"
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(124,111,255,0.05),transparent_60%)]"
      />

      <div
        className="animate-fade-in relative z-10 w-full text-center px-4 max-w-[460px]"
      >
        {/* Animated score ring */}
        <div
          className="animate-glow flex items-center justify-center mx-auto mb-7 w-[100px] h-[100px] rounded-full"
        >
          <ScoreRing value={scoreProgress} size={88} strokeWidth={3} />
        </div>

        <h2 className="text-[22px] font-extrabold tracking-tight mb-1.5 text-[var(--color-ink)]">
          Processing Interview
        </h2>
        <p className="text-sm mb-9 text-[var(--color-ink3)]">
          Evaluating responses against criteria
        </p>

        {/* Phase list */}
        <div className="flex flex-col gap-2.5 text-left">
          {phases.map((p, i) => (
            <div
              key={p}
              className={`flex items-center gap-3 transition-all duration-400 px-4 py-[11px] rounded-xl border ${
                i === phase
                  ? "bg-[var(--acg)] border-[rgba(124,111,255,0.25)]"
                  : i < phase
                    ? "bg-[var(--color-layer)] border-[var(--color-edge)]"
                    : "bg-[var(--color-canvas2)] border-[var(--color-edge)]"
              }`}
            >
              {/* Status circle */}
              <div
                className={`flex items-center justify-center shrink-0 w-[26px] h-[26px] rounded-full text-[11px] font-bold transition-all duration-300 ${
                  i < phase
                    ? "bg-[var(--color-success)] text-white"
                    : i === phase
                      ? "bg-[var(--color-brand)] text-white"
                      : "bg-[var(--color-layer2)] text-[var(--color-ink3)]"
                }`}
              >
                {i < phase ? (
                  <RiCheckLine size={12} />
                ) : i === phase ? (
                  <div
                    className="animate-spin-slow w-2.5 h-2.5 rounded-full border-2 border-white border-t-transparent"
                  />
                ) : (
                  <span className="text-[var(--color-ink3)]">{i + 1}</span>
                )}
              </div>

              <span
                className={`flex-1 text-[13px] transition-all duration-300 ${
                  i === phase
                    ? "font-bold text-[var(--color-ink)]"
                    : i < phase
                      ? "font-medium text-[var(--color-ink)]"
                      : "font-medium text-[var(--color-ink3)]"
                }`}
              >
                {p}
              </span>

              {i < phase && (
                <span className="text-[11px] font-semibold font-mono text-[var(--color-success)]">
                  Done
                </span>
              )}
              {i === phase && (
                <span className="animate-pulse-slow text-[11px] font-semibold text-[var(--color-brand)]">
                  Processing
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Powered by */}
        <div className="mt-10 text-[11px] font-medium text-[var(--color-ink3)] opacity-60">
          Powered by RoleSignal
        </div>
      </div>
    </div>
  );
}
