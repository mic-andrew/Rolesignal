interface PerformanceBarProps {
  name: string;
  score: number;
  index: number;
}

function getBarColor(score: number): string {
  if (score >= 80) return "var(--color-success)";
  if (score >= 60) return "var(--color-warn)";
  return "var(--color-danger)";
}

function getBarOpacity(score: number): string {
  if (score >= 85) return "opacity-100";
  if (score >= 75) return "opacity-80";
  if (score >= 65) return "opacity-60";
  return "opacity-40";
}

function getScoreColorClass(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warn";
  return "text-danger";
}

export function PerformanceBar({ name, score, index }: PerformanceBarProps) {
  const color = getBarColor(score);
  const delay = Math.min(index + 1, 10);

  return (
    <div className={`flex items-center gap-4 animate-fade-in delay-${delay}`}>
      <span className="text-xs font-medium text-ink2 w-[140px] shrink-0 truncate">
        {name}
      </span>
      <div className="flex-1 h-[5px] bg-edge rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full animate-bar-fill ${getBarOpacity(score)}`}
          style={{
            width: `${score}%`,
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            animationDelay: `${index * 0.08}s`,
          }}
        />
      </div>
      <span className={`text-sm font-extrabold font-mono w-8 text-right ${getScoreColorClass(score)}`}>
        {Math.round(score)}
      </span>
    </div>
  );
}
