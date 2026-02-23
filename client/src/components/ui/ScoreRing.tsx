interface ScoreRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
}

function scoreColor(v: number): string {
  if (v >= 80) return "var(--color-success)";
  if (v >= 60) return "var(--color-warn)";
  return "var(--color-danger)";
}

export function ScoreRing({ value, size = 60, strokeWidth = 3.5 }: ScoreRingProps) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  const color = scoreColor(value);
  const fontSize = Math.round(size * 0.28);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="var(--color-edge)" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center font-mono font-extrabold"
        style={{ fontSize, color }}
      >
        {value}
      </div>
    </div>
  );
}
