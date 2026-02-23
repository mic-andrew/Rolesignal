interface CriterionBar {
  name: string;
  score: number;
}

interface CriteriaChartProps {
  criteria: CriterionBar[];
}

function barColor(v: number): string {
  if (v >= 90) return "var(--color-success)";
  if (v >= 80) return "var(--color-brand)";
  return "var(--color-warn)";
}

export function CriteriaChart({ criteria }: CriteriaChartProps) {
  return (
    <div className="flex justify-between" style={{ gap: 12 }}>
      {criteria.map((c, i) => {
        const color = barColor(c.score);
        return (
          <div key={c.name} style={{ flex: 1, textAlign: "center" }}>
            <div className="flex items-end justify-center" style={{ height: 70, marginBottom: 6 }}>
              <div
                className="animate-bar-fill"
                style={{
                  width: 24,
                  borderRadius: "4px 4px 0 0",
                  height: `${c.score * 0.7}px`,
                  background: color,
                  boxShadow: `0 0 8px ${color === "var(--color-success)" ? "rgba(34,201,151,0.3)" : "rgba(124,111,255,0.3)"}`,
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, fontFamily: "var(--font-family-mono)", color }}>{c.score}</div>
            <div style={{ fontSize: 10, color: "var(--color-ink3)", fontWeight: 500, marginTop: 2 }}>
              {c.name.split(" ")[0]}
            </div>
          </div>
        );
      })}
    </div>
  );
}
