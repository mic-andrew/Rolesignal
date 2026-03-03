type BadgeVariant =
  | "easy" | "medium" | "hard"
  | "accepted" | "wrong_answer" | "time_limit" | "runtime_error" | "compile_error"
  | "pending" | "running"
  | "solved" | "attempted" | "not_started"
  | "live" | "active";

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
}

const CONFIG: Record<BadgeVariant, { bgClass: string; textClass: string; dotClass: string; text: string }> = {
  easy:          { bgClass: "bg-(--grg)",  textClass: "text-success", dotClass: "bg-success", text: "Easy"          },
  medium:        { bgClass: "bg-(--amg)",  textClass: "text-warn",    dotClass: "bg-warn",    text: "Medium"        },
  hard:          { bgClass: "bg-(--rdg)",  textClass: "text-danger",  dotClass: "bg-danger",  text: "Hard"          },
  accepted:      { bgClass: "bg-(--grg)",  textClass: "text-success", dotClass: "bg-success", text: "Accepted"      },
  wrong_answer:  { bgClass: "bg-(--rdg)",  textClass: "text-danger",  dotClass: "bg-danger",  text: "Wrong Answer"  },
  time_limit:    { bgClass: "bg-(--amg)",  textClass: "text-warn",    dotClass: "bg-warn",    text: "Time Limit"    },
  runtime_error: { bgClass: "bg-(--rdg)",  textClass: "text-danger",  dotClass: "bg-danger",  text: "Runtime Error" },
  compile_error: { bgClass: "bg-(--rdg)",  textClass: "text-danger",  dotClass: "bg-danger",  text: "Compile Error" },
  pending:       { bgClass: "bg-(--amg)",  textClass: "text-warn",    dotClass: "bg-warn",    text: "Pending"       },
  running:       { bgClass: "bg-(--acg)",  textClass: "text-brand",   dotClass: "bg-brand",   text: "Running"       },
  solved:        { bgClass: "bg-(--grg)",  textClass: "text-success", dotClass: "bg-success", text: "Solved"        },
  attempted:     { bgClass: "bg-(--amg)",  textClass: "text-warn",    dotClass: "bg-warn",    text: "Attempted"     },
  not_started:   { bgClass: "bg-layer3",   textClass: "text-ink3",    dotClass: "bg-ink3",    text: "Not Started"   },
  live:          { bgClass: "bg-(--grg)",  textClass: "text-success", dotClass: "bg-success", text: "Live"          },
  active:        { bgClass: "bg-(--acg)",  textClass: "text-brand",   dotClass: "bg-brand",   text: "Active"        },
};

export function Badge({ variant, label }: BadgeProps) {
  const cfg = CONFIG[variant] ?? CONFIG.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${cfg.bgClass} ${cfg.textClass}`}
    >
      {(variant === "live" || variant === "running") && (
        <span
          className={`w-1.5 h-1.5 rounded-full animate-breathe ${cfg.dotClass}`}
        />
      )}
      {label ?? cfg.text}
    </span>
  );
}
