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

export default function Interviews() {
  const hook = useInterviews();
  const navigate = useNavigate();

  return (
    <div>
      {/* Stat bar */}
      {!hook.isLoading && hook.stats.total > 0 && (
        <div className="flex animate-fade-in" style={{ gap: 12, marginBottom: 20 }}>
          {([
            { label: "Total", value: hook.stats.total, color: "var(--color-ink)" },
            { label: "Pending", value: hook.stats.pending, color: "var(--color-warn)" },
            { label: "In Progress", value: hook.stats.inProgress, color: "var(--color-brand)" },
            { label: "Completed", value: hook.stats.completed, color: "var(--color-success)" },
          ] as const).map((s) => (
            <div
              key={s.label}
              style={{
                flex: 1, padding: "14px 18px", borderRadius: 12,
                background: "var(--color-layer)", border: "1px solid var(--color-edge)",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-ink3)", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "var(--font-family-mono)" }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Search + filters + Send button */}
      <div className="flex items-center animate-fade-in" style={{ gap: 10, marginBottom: 20 }}>
        <div
          className="flex items-center flex-1"
          style={{ gap: 8, padding: "7px 16px", background: "var(--color-layer)", border: "1px solid var(--color-edge)", borderRadius: 8 }}
        >
          <RiSearchLine size={16} className="text-ink3 shrink-0" />
          <input
            value={hook.search}
            onChange={(e) => hook.setSearch(e.target.value)}
            placeholder="Search by candidate name..."
            style={{ flex: 1, fontSize: 13, color: "var(--color-ink)", background: "transparent", border: "none", outline: "none" }}
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

      {/* Role filter */}
      {hook.roles.length > 1 && (
        <div className="flex items-center animate-fade-in" style={{ gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: "var(--color-ink3)", fontWeight: 500 }}>Role:</span>
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

      {/* Content */}
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {hook.interviews.map((interview, i) => (
            <InterviewCard key={interview.id} interview={interview} index={i} />
          ))}
        </div>
      )}

    </div>
  );
}
