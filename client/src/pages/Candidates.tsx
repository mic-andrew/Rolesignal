import { useNavigate } from "react-router-dom";
import { RiArrowDownSLine } from "react-icons/ri";
import { useCandidates } from "../hooks/useCandidates";
import { CandidateCard } from "../components/shared/CandidateCard";
import { SearchInput } from "../components/shared/SearchInput";
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
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2.5 animate-fade-in">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search candidates..."
        />

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

      {isLoading ? (
        <LoadingSkeleton rows={3} />
      ) : groupedByRole.length === 0 ? (
        <EmptyState
          title="No candidates yet"
          description="Candidates are added when you create an interview."
          action={{ label: "Create Interview", onClick: () => navigate("/setup") }}
        />
      ) : (
        groupedByRole.map((group) => {
          const isCollapsed = collapsedRoles.has(group.role.id);
          return (
            <div key={group.role.id} className="animate-fade-in">
              <button
                onClick={() => toggleRoleCollapsed(group.role.id)}
                className={`flex items-center justify-between w-full cursor-pointer bg-transparent border-0 py-3 px-1 ${isCollapsed ? "mb-0" : "mb-3"}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base font-bold text-ink">{group.role.title}</span>
                  <span className="text-xs text-ink3">
                    {group.role.department} &middot; {group.candidates.length} candidate{group.candidates.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold font-family-mono text-brand">
                    Avg {group.role.avgScore}
                  </span>
                  <RiArrowDownSLine
                    size={18}
                    className={`text-ink3 transition-transform duration-200 ${isCollapsed ? "-rotate-90" : "rotate-0"}`}
                  />
                </div>
              </button>

              {!isCollapsed && (
                <div className="grid grid-cols-3 gap-5">
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
