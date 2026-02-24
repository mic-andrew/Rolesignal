import { RiCheckLine } from "react-icons/ri";
import { useProcessing } from "../hooks/useProcessing";
import { ScoreRing } from "../components/ui/ScoreRing";

export default function Processing() {
  const { phase, phases, scoreProgress } = useProcessing();

  return (
    <div
      className="flex items-center justify-center relative overflow-hidden"
      style={{ minHeight: "100vh", background: "var(--color-canvas)" }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 45%, rgba(124,111,255,0.05), transparent 60%)" }}
      />

      <div
        className="animate-fade-in relative z-10 w-full text-center px-4"
        style={{ maxWidth: 460 }}
      >
        {/* Animated score ring */}
        <div
          className="animate-glow flex items-center justify-center mx-auto mb-7"
          style={{ width: 100, height: 100, borderRadius: "50%" }}
        >
          <ScoreRing value={scoreProgress} size={88} strokeWidth={3} />
        </div>

        <h2 className="text-[22px] font-extrabold tracking-tight mb-1.5" style={{ color: "var(--color-ink)" }}>
          Processing Interview
        </h2>
        <p className="text-sm mb-9" style={{ color: "var(--color-ink3)" }}>
          Evaluating responses against criteria
        </p>

        {/* Phase list */}
        <div className="flex flex-col gap-2.5 text-left">
          {phases.map((p, i) => (
            <div
              key={p}
              className="flex items-center gap-3 transition-all duration-400"
              style={{
                padding: "11px 16px",
                borderRadius: 12,
                background: i === phase ? "var(--acg)" : i < phase ? "var(--color-layer)" : "var(--color-canvas2)",
                border: `1px solid ${i === phase ? "rgba(124,111,255,0.25)" : "var(--color-edge)"}`,
              }}
            >
              {/* Status circle */}
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: i < phase ? "var(--color-success)" : i === phase ? "var(--color-brand)" : "var(--color-layer2)",
                  color: i <= phase ? "#fff" : "var(--color-ink3)",
                  fontSize: 11,
                  fontWeight: 700,
                  transition: "all 0.3s",
                }}
              >
                {i < phase ? (
                  <RiCheckLine size={12} />
                ) : i === phase ? (
                  <div
                    className="animate-spin-slow"
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      border: "2px solid #fff",
                      borderTopColor: "transparent",
                    }}
                  />
                ) : (
                  <span style={{ color: "var(--color-ink3)" }}>{i + 1}</span>
                )}
              </div>

              <span
                className="flex-1 text-[13px]"
                style={{
                  fontWeight: i === phase ? 700 : 500,
                  color: i <= phase ? "var(--color-ink)" : "var(--color-ink3)",
                  transition: "all 0.3s",
                }}
              >
                {p}
              </span>

              {i < phase && (
                <span className="text-[11px] font-semibold font-mono" style={{ color: "var(--color-success)" }}>
                  Done
                </span>
              )}
              {i === phase && (
                <span className="animate-pulse-slow text-[11px] font-semibold" style={{ color: "var(--color-brand)" }}>
                  Processing
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Powered by */}
        <div className="mt-10 text-[11px] font-medium" style={{ color: "var(--color-ink3)", opacity: 0.6 }}>
          Powered by RoleSignal
        </div>
      </div>
    </div>
  );
}
