import type { CandidateStatus } from "../../types";

type BadgeVariant = CandidateStatus | "live" | "active" | "invited" | "in_progress" | "completed";

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
}

const CONFIG: Record<BadgeVariant, { bgClass: string; textClass: string; dotClass: string; text: string }> = {
  shortlisted:  { bgClass: "bg-[var(--grg)]",  textClass: "text-success", dotClass: "bg-success", text: "Shortlisted"  },
  reviewed:     { bgClass: "bg-[var(--acg)]",  textClass: "text-brand2",  dotClass: "bg-brand2",  text: "Reviewed"     },
  pending:      { bgClass: "bg-[var(--amg)]",  textClass: "text-warn",    dotClass: "bg-warn",    text: "Pending"      },
  rejected:     { bgClass: "bg-[var(--rdg)]",  textClass: "text-danger",  dotClass: "bg-danger",  text: "Rejected"     },
  live:         { bgClass: "bg-[var(--grg)]",  textClass: "text-success", dotClass: "bg-success", text: "Live"         },
  active:       { bgClass: "bg-[var(--acg)]",  textClass: "text-brand2",  dotClass: "bg-brand2",  text: "Active"       },
  invited:      { bgClass: "bg-[var(--amg)]",  textClass: "text-warn",    dotClass: "bg-warn",    text: "Invited"      },
  in_progress:  { bgClass: "bg-[var(--acg)]",  textClass: "text-brand2",  dotClass: "bg-brand2",  text: "In Progress"  },
  completed:    { bgClass: "bg-[var(--grg)]",  textClass: "text-success", dotClass: "bg-success", text: "Completed"    },
};

export function Badge({ variant, label }: BadgeProps) {
  const cfg = CONFIG[variant] ?? CONFIG.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${cfg.bgClass} ${cfg.textClass}`}
    >
      {(variant === "live" || variant === "in_progress") && (
        <span
          className={`w-1.5 h-1.5 rounded-full animate-breathe ${cfg.dotClass}`}
        />
      )}
      {label ?? cfg.text}
    </span>
  );
}
