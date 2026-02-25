import { useNavigate } from "react-router-dom";
import { RiSearchLine, RiAddLine } from "react-icons/ri";
import { useInterviews } from "../hooks/useInterviews";
import { InterviewCard } from "../components/shared/InterviewCard";
import { Button } from "../components/ui/Button";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { EmptyState } from "../components/ui/EmptyState";

type StatusFilter = "all" | "pending" | "in_progress" | "completed";

const STATUS_FILTERS: Array<{ label: string; value: StatusFilter }> = [
  { label: "All",         value: "all"         },
  { label: "Pending",     value: "pending"     },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed",   value: "completed"   },
];

const STAT_COLOR_CLASS: Record<string, string> = {
  "var(--color-ink)": "text-ink",
  "var(--color-warn)": "text-warn",
  "var(--color-brand)": "text-brand",
  "var(--color-success)": "text-success",
};

export default function Interviews() {
  const hook = useInterviews();
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      {!hook.isLoading && hook.stats.total > 0 && (
        <div className="grid grid-cols-4 gap-3 animate-fade-in">
          {([
            { label: "Total", value: hook.stats.total, color: "var(--color-ink)" },
            { label: "Pending", value: hook.stats.pending, color: "var(--color-warn)" },
            { label: "In Progress", value: hook.stats.inProgress, color: "var(--color-brand)" },
            { label: "Completed", value: hook.stats.completed, color: "var(--color-success)" },
          ] as const).map((s) => (
            <div
              key={s.label}
              className="px-5 py-4 rounded-xl bg-layer border border-edge"
            >
              <div className="text-[11px] font-medium text-ink3 mb-1.5">{s.label}</div>
              <div className={`text-[22px] font-extrabold font-family-mono ${STAT_COLOR_CLASS[s.color]}`}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2.5 animate-fade-in">
        <div
          className="flex items-center flex-1 gap-2 px-4 py-[9px] bg-layer border border-edge rounded-lg"
        >
          <RiSearchLine size={16} className="text-ink3 shrink-0" />
          <input
            value={hook.search}
            onChange={(e) => hook.setSearch(e.target.value)}
            placeholder="Search by candidate name..."
            className="flex-1 text-[13px] text-ink bg-transparent border-none outline-none"
          />
        </div>

        {STATUS_FILTERS.map(({ label, value }) => (
          <Button
            key={value}
            variant={hook.statusFilter === value ? "primary" : "ghost"}
            size="sm"
            onClick={() => hook.setStatusFilter(value)}
          >
            {label}
          </Button>
        ))}

        <Button size="sm" onClick={() => navigate("/setup")}>
          <RiAddLine size={14} />
          Create Interview
        </Button>
      </div>

      {hook.roles.length > 1 && (
        <div className="flex items-center gap-2 animate-fade-in">
          <span className="text-xs text-ink3 font-medium">Role:</span>
          <Button
            variant={hook.roleFilter === "all" ? "primary" : "ghost"}
            size="sm"
            onClick={() => hook.setRoleFilter("all")}
          >
            All
          </Button>
          {hook.roles.map((r) => (
            <Button
              key={r.id}
              variant={hook.roleFilter === r.id ? "primary" : "ghost"}
              size="sm"
              onClick={() => hook.setRoleFilter(r.id)}
            >
              {r.title}
            </Button>
          ))}
        </div>
      )}

      {hook.isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : hook.interviews.length === 0 && hook.stats.total === 0 ? (
        <EmptyState
          title="No interviews yet"
          description="Create your first interview to start evaluating candidates."
          action={{ label: "Create Interview", onClick: () => navigate("/setup") }}
        />
      ) : hook.interviews.length === 0 ? (
        <EmptyState title="No interviews match your filters" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {hook.interviews.map((interview, i) => (
            <InterviewCard key={interview.id} interview={interview} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
