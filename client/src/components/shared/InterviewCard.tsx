import { RiFileCopyLine, RiTimeLine } from "react-icons/ri";
import type { InterviewResponse } from "../../api/interviews";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { useUIStore } from "../../stores/uiStore";

interface InterviewCardProps {
  interview: InterviewResponse;
  index: number;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "\u2014";
  const mins = Math.floor(seconds / 60);
  return `${mins}m`;
}

function makeInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function InterviewCard({ interview, index }: InterviewCardProps) {
  const showToast = useUIStore((s) => s.showToast);
  const { candidateName, roleTitle, status, durationSeconds, link, completedAt } = interview;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link);
    showToast("Interview link copied", "success");
  };

  const statusLabel =
    status === "in_progress" ? "In progress" :
    status === "completed" && durationSeconds ? `${formatDuration(durationSeconds)}` :
    status === "pending" ? "Not started" : status;

  return (
    <Card
      padding="p-0"
      className={`animate-fade-in delay-${Math.min(index + 1, 5) as 1 | 2 | 3 | 4 | 5} px-5 py-4`}
    >
      <div className="flex items-center gap-3 mb-3.5">
        <Avatar initials={makeInitials(candidateName)} size={36} color="#7C6FFF" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-ink overflow-hidden text-ellipsis whitespace-nowrap">
            {candidateName}
          </div>
          <div className="text-xs text-ink3 overflow-hidden text-ellipsis whitespace-nowrap">
            {roleTitle}
          </div>
        </div>
        <Badge variant={status as "pending" | "in_progress" | "completed"} />
      </div>

      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1.5">
          <RiTimeLine size={13} className="text-ink3" />
          <span className="text-xs text-ink3 font-medium">
            {statusLabel}
          </span>
          {completedAt && (
            <span className="text-[11px] text-ink3 font-mono ml-1">
              {new Date(completedAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <button
          onClick={handleCopyLink}
          title="Copy interview link"
          className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent border-none cursor-pointer text-ink3 transition-colors duration-150 hover:text-brand hover:bg-(--acg)"
        >
          <RiFileCopyLine size={14} />
        </button>
      </div>
    </Card>
  );
}
