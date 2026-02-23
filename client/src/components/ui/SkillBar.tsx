interface SkillBarProps {
  label: string;
  value: number;
  delay?: number;
}

function barColor(v: number): string {
  if (v >= 80) return "var(--color-success)";
  if (v >= 60) return "var(--color-warn)";
  return "var(--color-danger)";
}

export function SkillBar({ label, value, delay = 0 }: SkillBarProps) {
  const color = barColor(value);
  return (
    <div style={{ marginBottom: 14 }}>
      <div className="flex justify-between" style={{ marginBottom: 5 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-ink2)" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "var(--font-family-mono)", color }}>{value}</span>
      </div>
      <div style={{ height: 5, background: "var(--color-edge)", borderRadius: 3, overflow: "hidden" }}>
        <div
          className="animate-bar-fill"
          style={{
            height: "100%",
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            borderRadius: 3,
            animationDelay: `${delay * 0.08}s`,
          }}
        />
      </div>
    </div>
  );
}
