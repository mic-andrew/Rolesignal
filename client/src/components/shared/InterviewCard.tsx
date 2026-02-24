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
  if (!seconds) return "—";
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
      className={`animate-fade-in delay-${Math.min(index + 1, 5) as 1 | 2 | 3 | 4 | 5}`}
      style={{ padding: "16px 18px" }}
    >
      <div className="flex items-center" style={{ gap: 12, marginBottom: 12 }}>
        <Avatar initials={makeInitials(candidateName)} size={36} color="#7C6FFF" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {candidateName}
          </div>
          <div style={{ fontSize: 12, color: "var(--color-ink3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {roleTitle}
          </div>
        </div>
        <Badge variant={status as "pending" | "in_progress" | "completed"} />
      </div>

      <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
        <div className="flex items-center" style={{ gap: 6 }}>
          <RiTimeLine size={13} style={{ color: "var(--color-ink3)" }} />
          <span style={{ fontSize: 12, color: "var(--color-ink3)", fontWeight: 500 }}>
            {statusLabel}
          </span>
          {completedAt && (
            <span style={{ fontSize: 11, color: "var(--color-ink3)", fontFamily: "var(--font-family-mono)", marginLeft: 4 }}>
              {new Date(completedAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <button
          onClick={handleCopyLink}
          title="Copy interview link"
          className="flex items-center justify-center"
          style={{
            width: 28, height: 28, borderRadius: 6,
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--color-ink3)", transition: "color 0.15s, background 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-brand)"; e.currentTarget.style.background = "var(--acg)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-ink3)"; e.currentTarget.style.background = "transparent"; }}
        >
          <RiFileCopyLine size={14} />
        </button>
      </div>
    </Card>
  );
}
