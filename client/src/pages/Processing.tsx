import { RiCheckLine } from "react-icons/ri";
import { useProcessing } from "../hooks/useProcessing";
import { ScoreRing } from "../components/ui/ScoreRing";

export default function Processing() {
  const { phase, phases, scoreProgress } = useProcessing();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-canvas)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 45%, rgba(124,111,255,0.05), transparent 60%)",
        }}
      />

      <div
        className="animate-fade-in"
        style={{
          maxWidth: 460,
          width: "100%",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          padding: "0 16px",
        }}
      >
        {/* Animated score ring */}
        <div
          className="animate-glow"
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            margin: "0 auto 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ScoreRing value={scoreProgress} size={88} strokeWidth={3} />
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--color-ink)", marginBottom: 6 }}>
          Processing Interview
        </h2>
        <p style={{ fontSize: 14, color: "var(--color-ink3)", marginBottom: 36, fontWeight: 400 }}>
          Evaluating Sarah Chen's responses
        </p>

        {/* Phase list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left" }}>
          {phases.map((p, i) => (
            <div
              key={p}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 16px",
                borderRadius: 12,
                background: i === phase ? "var(--acg)" : i < phase ? "var(--color-layer)" : "var(--color-canvas2)",
                border: `1px solid ${i === phase ? "rgba(124,111,255,0.25)" : "var(--color-edge)"}`,
                transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {/* Status circle */}
              <div
                style={{
                  width: 26,
                  height: 26,
                  minWidth: 26,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
                style={{
                  fontSize: 13,
                  flex: 1,
                  fontWeight: i === phase ? 700 : 500,
                  color: i <= phase ? "var(--color-ink)" : "var(--color-ink3)",
                  transition: "all 0.3s",
                }}
              >
                {p}
              </span>

              {i < phase && (
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-success)", fontFamily: "var(--font-family-mono)" }}>
                  Done
                </span>
              )}
              {i === phase && (
                <span className="animate-pulse-slow" style={{ fontSize: 11, fontWeight: 600, color: "var(--color-brand)" }}>
                  Processing
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
