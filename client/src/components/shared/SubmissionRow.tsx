import { useNavigate } from "react-router-dom";
import { RiCheckLine, RiCloseLine, RiTimeLine } from "react-icons/ri";
import { Badge } from "../ui/Badge";

interface SubmissionRowProps {
  submission: {
    id: string;
    problemTitle?: string;
    problemSlug?: string;
    language: string;
    status: string;
    runtimeMs: number | null;
    createdAt: string;
  };
}

function statusIcon(status: string) {
  if (status === "accepted") return <RiCheckLine className="text-success" />;
  if (status === "running" || status === "pending") return <RiTimeLine className="text-warn" />;
  return <RiCloseLine className="text-danger" />;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function SubmissionRow({ submission }: SubmissionRowProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => submission.problemSlug && navigate(`/problems/${submission.problemSlug}`)}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-canvas2 cursor-pointer transition-colors"
    >
      <span className="text-lg">{statusIcon(submission.status)}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-ink truncate">
          {submission.problemTitle ?? "Problem"}
        </div>
        <div className="text-xs text-ink3">{submission.language}</div>
      </div>
      <div className="text-right shrink-0">
        <Badge variant={submission.status as "accepted" | "wrong_answer"}>
          {submission.status.replace(/_/g, " ")}
        </Badge>
        <div className="text-[10px] text-ink3 mt-0.5">{formatTime(submission.createdAt)}</div>
      </div>
    </div>
  );
}
