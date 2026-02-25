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
    <div className="mb-3.5">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-medium text-ink2">{label}</span>
        <span className="text-xs font-bold font-mono" style={{ color }}>{value}</span>
      </div>
      <div className="h-[5px] bg-edge rounded-sm overflow-hidden">
        <div
          className="animate-bar-fill h-full rounded-sm"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            animationDelay: `${delay * 0.08}s`,
          }}
        />
      </div>
    </div>
  );
}
