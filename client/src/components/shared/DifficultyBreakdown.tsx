interface DifficultyBreakdownProps {
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

const DIFFICULTIES = [
  { label: "Easy", key: "easy" as const, color: "#16A34A" },
  { label: "Medium", key: "medium" as const, color: "#D97706" },
  { label: "Hard", key: "hard" as const, color: "#DC2626" },
];

export function DifficultyBreakdown({ easySolved, mediumSolved, hardSolved }: DifficultyBreakdownProps) {
  const counts = { easy: easySolved, medium: mediumSolved, hard: hardSolved };
  const max = Math.max(easySolved, mediumSolved, hardSolved, 1);

  return (
    <div className="space-y-3">
      {DIFFICULTIES.map((d) => (
        <div key={d.key}>
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium text-ink2">{d.label}</span>
            <span className="text-xs font-bold font-mono" style={{ color: d.color }}>
              {counts[d.key]}
            </span>
          </div>
          <div className="h-2 bg-edge rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(counts[d.key] / max) * 100}%`,
                backgroundColor: d.color,
                minWidth: counts[d.key] > 0 ? "8px" : "0",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
