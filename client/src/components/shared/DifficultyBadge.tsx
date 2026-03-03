import type { Difficulty } from "../../types";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

const COLORS: Record<Difficulty, { bg: string; text: string }> = {
  easy:   { bg: "bg-(--grg)", text: "text-success" },
  medium: { bg: "bg-(--amg)", text: "text-warn"    },
  hard:   { bg: "bg-(--rdg)", text: "text-danger"  },
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const { bg, text } = COLORS[difficulty];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${bg} ${text}`}>
      {difficulty}
    </span>
  );
}
