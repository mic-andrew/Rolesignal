import { RiSearchLine, RiArrowDownSLine } from "react-icons/ri";
import { useCandidates } from "../hooks/useCandidates";
import { CandidateCard } from "../components/shared/CandidateCard";
import { Button } from "../components/ui/Button";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { EmptyState } from "../components/ui/EmptyState";
import type { CandidateStatus } from "../types";

const FILTERS: Array<{ label: string; value: CandidateStatus | "all" }> = [
  { label: "All",          value: "all"         },
  { label: "Shortlisted",  value: "shortlisted" },
  { label: "Reviewed",     value: "reviewed"    },
  { label: "Pending",      value: "pending"     },
];

export default function Candidates() {
  const {
    groupedByRole, isLoading, search, setSearch, filter, setFilter,
    collapsedRoles, toggleRoleCollapsed,
  } = useCandidates();

  return (
    <div>
      {/* Search + filters */}
      <div className="flex animate-fade-in" style={{ gap: 10, marginBottom: 20 }}>
        <div
          className="flex items-center flex-1"
          style={{ gap: 8, padding: "7px 16px", background: "var(--color-layer)", border: "1px solid var(--color-edge)", borderRadius: 8 }}
        >
          <RiSearchLine size={16} className="text-ink3 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates..."
            style={{ flex: 1, fontSize: 13, color: "var(--color-ink)", background: "transparent", border: "none", outline: "none" }}
          />
        </div>

        {FILTERS.map(({ label, value }) => (
          <Button
            key={value}
            variant={filter === value ? "primary" : "ghost"}
            size="sm"
            onClick={() => setFilter(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Role sections */}
      {isLoading ? (
        <LoadingSkeleton rows={3} />
      ) : groupedByRole.length === 0 ? (
        <EmptyState title="No candidates found" description="Try adjusting your search or filters." />
      ) : (
        groupedByRole.map((group) => {
          const isCollapsed = collapsedRoles.has(group.role.id);
          return (
            <div key={group.role.id} className="animate-fade-in" style={{ marginBottom: 24 }}>
              {/* Section header */}
              <button
                onClick={() => toggleRoleCollapsed(group.role.id)}
                className="flex items-center justify-between w-full cursor-pointer bg-transparent border-0"
                style={{ padding: "10px 0", marginBottom: isCollapsed ? 0 : 12 }}
              >
                <div className="flex items-center" style={{ gap: 10 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "var(--color-ink)" }}>{group.role.title}</span>
                  <span style={{ fontSize: 12, color: "var(--color-ink3)" }}>
                    {group.role.department} &middot; {group.candidates.length} candidate{group.candidates.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center" style={{ gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, fontFamily: "var(--font-family-mono)", color: "var(--color-brand)" }}>
                    Avg {group.role.avgScore}
                  </span>
                  <RiArrowDownSLine
                    size={18}
                    className="text-ink3 transition-transform duration-200"
                    style={{ transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)" }}
                  />
                </div>
              </button>

              {/* Candidate grid */}
              {!isCollapsed && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                  {group.candidates.map((c, i) => (
                    <CandidateCard key={c.id} candidate={c} index={i} />
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
