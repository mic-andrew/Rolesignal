import { useNavigate } from "react-router-dom";
import { RiCodeLine, RiStackLine, RiNodeTree, RiGitBranchLine, RiBarChartBoxLine, RiDatabase2Line } from "react-icons/ri";
import { Card } from "../ui/Card";
import type { Topic } from "../../types";

interface TopicCardProps {
  topic: Topic;
  solved?: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  core_dsa: "Core DSA",
  advanced: "Advanced",
  system_design: "System Design",
};

const ICON_MAP: Record<string, React.ReactNode> = {
  array: <RiBarChartBoxLine size={22} />,
  string: <RiCodeLine size={22} />,
  "linked-list": <RiGitBranchLine size={22} />,
  stack: <RiStackLine size={22} />,
  tree: <RiNodeTree size={22} />,
  graph: <RiGitBranchLine size={22} />,
  default: <RiDatabase2Line size={22} />,
};

export function TopicCard({ topic, solved = 0 }: TopicCardProps) {
  const navigate = useNavigate();
  const progress = topic.problemCount > 0 ? (solved / topic.problemCount) * 100 : 0;
  const icon = ICON_MAP[topic.icon] ?? ICON_MAP.default;

  return (
    <Card
      onClick={() => navigate(`/problems?topic=${topic.slug}`)}
      className="flex flex-col gap-3 p-5 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-(--acg) text-brand flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-ink truncate">{topic.name}</h3>
          <span className="text-[11px] text-ink3">{CATEGORY_LABELS[topic.category] ?? topic.category}</span>
        </div>
      </div>

      <p className="text-xs text-ink2 line-clamp-2">{topic.description}</p>

      <div className="mt-auto">
        <div className="flex items-center justify-between text-[11px] text-ink3 mb-1.5">
          <span>{solved}/{topic.problemCount} solved</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-canvas3 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
