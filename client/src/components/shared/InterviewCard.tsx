import { RiFileCopyLine, RiTimeLine, RiDeleteBinLine } from "react-icons/ri";
import type { InterviewResponse } from "../../api/interviews";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { useUIStore } from "../../stores/uiStore";

interface InterviewCardProps {
  interview: InterviewResponse;
  index: number;
  onDelete?: (id: string) => void;
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

export function InterviewCard({ interview, index, onDelete }: InterviewCardProps) {
  const showToast = useUIStore((s) => s.showToast);
  const { id, candidateName, roleTitle, status, durationSeconds, link, completedAt } = interview;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link);
    showToast("Interview link copied", "success");
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  const statusLabel =
    status === "in_progress" ? "In progress" :
    status === "completed" && durationSeconds ? `${formatDuration(durationSeconds)}` :
    status === "pending" ? "Not started" : status;

  return (
    <Card
      glow
      padding="p-0"
      className={`animate-fade-in delay-${Math.min(index + 1, 10)} px-6 py-5`}
    >
      <div className="flex items-center gap-3.5 mb-4">
        <Avatar initials={makeInitials(candidateName)} size={40} color="#7C6FFF" />
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-bold text-ink overflow-hidden text-ellipsis whitespace-nowrap">
            {candidateName}
          </div>
          <div className="text-[13px] text-ink3 mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
            {roleTitle}
          </div>
        </div>
        <Badge variant={status as "pending" | "in_progress" | "completed"} />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-edge">
        <div className="flex items-center gap-2">
          <RiTimeLine size={14} className="text-ink3" />
          <span className="text-[13px] text-ink3 font-medium">
            {statusLabel}
          </span>
          {completedAt && (
            <span className="text-xs text-ink3 font-mono ml-1">
              {new Date(completedAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyLink}
            title="Copy interview link"
            className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent border-none cursor-pointer text-ink3 transition-colors duration-150 hover:text-brand hover:bg-(--acg)"
          >
            <RiFileCopyLine size={15} />
          </button>
          {onDelete && (
            <button
              onClick={handleDelete}
              title="Delete interview"
              className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent border-none cursor-pointer text-ink3 transition-colors duration-150 hover:text-danger hover:bg-(--acg)"
            >
              <RiDeleteBinLine size={15} />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
