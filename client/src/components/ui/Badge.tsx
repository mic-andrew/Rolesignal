import type { CandidateStatus } from "../../types";

type BadgeVariant = CandidateStatus | "live" | "active" | "invited" | "in_progress" | "completed";

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
}

const CONFIG: Record<BadgeVariant, { bg: string; color: string; text: string }> = {
  shortlisted:  { bg: "var(--grg)",  color: "var(--color-success)", text: "Shortlisted"  },
  reviewed:     { bg: "var(--acg)",  color: "var(--color-brand2)",  text: "Reviewed"     },
  pending:      { bg: "var(--amg)",  color: "var(--color-warn)",    text: "Pending"      },
  rejected:     { bg: "var(--rdg)",  color: "var(--color-danger)",  text: "Rejected"     },
  live:         { bg: "var(--grg)",  color: "var(--color-success)", text: "Live"         },
  active:       { bg: "var(--acg)",  color: "var(--color-brand2)",  text: "Active"       },
  invited:      { bg: "var(--amg)",  color: "var(--color-warn)",    text: "Invited"      },
  in_progress:  { bg: "var(--acg)",  color: "var(--color-brand2)",  text: "In Progress"  },
  completed:    { bg: "var(--grg)",  color: "var(--color-success)", text: "Completed"    },
};

export function Badge({ variant, label }: BadgeProps) {
  const cfg = CONFIG[variant] ?? CONFIG.pending;
  return (
    <span
      className="inline-flex items-center"
      style={{ gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: cfg.bg, color: cfg.color, letterSpacing: "0.01em" }}
    >
      {(variant === "live" || variant === "in_progress") && (
        <span
          className="rounded-full animate-breathe"
          style={{ width: 6, height: 6, background: cfg.color }}
        />
      )}
      {label ?? cfg.text}
    </span>
  );
}
