import { useNavigate } from "react-router-dom";
import { RiCheckboxCircleFill, RiCheckboxBlankCircleLine, RiEditCircleLine } from "react-icons/ri";
import { DifficultyBadge } from "./DifficultyBadge";
import type { Problem } from "../../types";

interface ProblemRowProps {
  problem: Problem;
}

const STATUS_ICONS = {
  solved:      <RiCheckboxCircleFill size={18} className="text-success" />,
  attempted:   <RiEditCircleLine size={18} className="text-warn" />,
  not_started: <RiCheckboxBlankCircleLine size={18} className="text-ink3" />,
};

export function ProblemRow({ problem }: ProblemRowProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/problems/${problem.slug}`)}
      className="w-full flex items-center gap-4 px-5 py-3.5 bg-layer border border-edge rounded-xl cursor-pointer transition-all duration-150 hover:shadow-(--sh2) hover:border-edge2 text-left"
    >
      <span className="shrink-0">
        {STATUS_ICONS[problem.userStatus] ?? STATUS_ICONS.not_started}
      </span>

      <span className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-ink truncate block">{problem.title}</span>
        <span className="text-xs text-ink3 mt-0.5 block">{problem.topicName}</span>
      </span>

      <DifficultyBadge difficulty={problem.difficulty} />

      {problem.acceptanceRate !== null && (
        <span className="text-xs text-ink3 tabular-nums w-14 text-right shrink-0">
          {problem.acceptanceRate}%
        </span>
      )}
    </button>
  );
}
