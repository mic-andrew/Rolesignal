import { getVerdict, getVerdictDotColor, getVerdictBgColor, getVerdictTextColor } from "../../utils/verdict";

interface VerdictBadgeProps {
  score: number;
}

export function VerdictBadge({ score }: VerdictBadgeProps) {
  const verdict = getVerdict(score);
  const dotColor = getVerdictDotColor(verdict);
  const bgColor = getVerdictBgColor(verdict);
  const textColor = getVerdictTextColor(verdict);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${bgColor} ${textColor}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      {verdict}
    </span>
  );
}
