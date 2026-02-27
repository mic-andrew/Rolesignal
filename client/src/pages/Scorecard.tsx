import { useNavigate } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";
import { useRankings } from "../hooks/useRankings";
import { formatDate } from "../utils/formatDate";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { ScoreFilterChips } from "../components/shared/ScoreFilterChips";
import { VerdictBadge } from "../components/shared/VerdictBadge";
import type { CandidateSkills } from "../types";

const SKILL_COLUMNS: Array<{ key: keyof CandidateSkills; label: string }> = [
  { key: "tech", label: "Tech" },
  { key: "behavioral", label: "Behav" },
  { key: "communication", label: "Comm" },
  { key: "problemSolving", label: "Problem" },
  { key: "culture", label: "Culture" },
];

function scoreColorClass(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warn";
  return "text-danger";
}

function barBgClass(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-warn";
  return "bg-danger";
}

export default function Scorecard() {
  const navigate = useNavigate();
  const {
    roles,
    activeRoleId,
    selectRole,
    candidates,
    isLoading,
    filter,
    setFilter,
    sortDirection,
    toggleSort,
  } = useRankings();

  if (isLoading) return <LoadingSkeleton rows={5} />;

  const activeRole = roles.find((r) => r.id === activeRoleId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-xl font-extrabold tracking-tight text-ink mb-1">
          Candidate Scorecard
        </h1>
        {activeRole && (
          <p className="text-xs text-ink3">
            {activeRole.department} &middot; {activeRole.seniority} &middot; {activeRole.location}
            &nbsp;&nbsp;&middot;&nbsp;&nbsp;{candidates.length} evaluated
          </p>
        )}
      </div>

      {/* Toolbar: role selector + filters */}
      <div className="flex items-center justify-between gap-4 flex-wrap animate-fade-in delay-1">
        <div className="flex items-center gap-3">
          <select
            value={activeRoleId ?? ""}
            onChange={(e) => selectRole(e.target.value)}
            className="input-field w-auto pr-8 text-[13px] py-[7px] appearance-none cursor-pointer"
          >
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.title} ({role.candidateCount})
              </option>
            ))}
          </select>
          {activeRole?.status === "live" && <Badge variant="live" />}
        </div>

        <ScoreFilterChips
          filter={filter}
          onFilterChange={setFilter}
          sortDirection={sortDirection}
          onToggleSort={toggleSort}
        />
      </div>

      {/* Table */}
      {candidates.length === 0 ? (
        <EmptyState
          title="No candidates match"
          description="Try adjusting the score filter or select a different role."
        />
      ) : (
        <Card padding="p-0" className="overflow-hidden animate-fade-in delay-2">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-canvas2">
                <th className="px-5 py-3 text-left text-[10px] font-bold text-ink3 uppercase tracking-[0.06em] border-b border-edge">
                  Candidate
                </th>
                {SKILL_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-3 text-center text-[10px] font-bold text-ink3 uppercase tracking-[0.06em] border-b border-edge"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-3 py-3 text-center text-[10px] font-bold text-ink3 uppercase tracking-[0.06em] border-b border-edge">
                  Avg
                </th>
                <th className="px-3 py-3 text-center text-[10px] font-bold text-ink3 uppercase tracking-[0.06em] border-b border-edge">
                  Verdict
                </th>
                <th className="w-10 border-b border-edge" />
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/evaluation/${c.id}`)}
                  className="cursor-pointer transition-colors hover:bg-(--acg2) border-b border-edge"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar initials={c.initials} size={32} color={c.color} />
                      <div>
                        <div className="text-[13px] font-semibold text-ink">{c.name}</div>
                        <div className="text-[11px] text-ink3">
                          {c.role} &middot; {formatDate(c.date)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {SKILL_COLUMNS.map((col) => (
                    <td key={col.key} className="px-3 py-3.5 text-center">
                      <span className={`text-[13px] font-semibold font-mono ${scoreColorClass(c.skills[col.key])}`}>
                        {c.skills[col.key]}
                      </span>
                    </td>
                  ))}

                  <td className="px-3 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-10 h-[4px] rounded-full overflow-hidden bg-edge">
                        <div
                          className={`h-full rounded-full animate-bar-fill ${barBgClass(c.score)}`}
                          style={{ width: `${c.score}%` }}
                        />
                      </div>
                      <span className={`text-[13px] font-extrabold font-mono ${scoreColorClass(c.score)}`}>
                        {c.score}
                      </span>
                    </div>
                  </td>

                  <td className="px-3 py-3.5 text-center">
                    <VerdictBadge score={c.score} />
                  </td>

                  <td className="px-2 py-3.5 text-ink3">
                    <RiArrowRightSLine size={16} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-5 pt-2 animate-fade-in delay-3">
        {[
          { label: "Strong Yes", cls: "bg-success" },
          { label: "Lean Yes", cls: "bg-brand2" },
          { label: "Neutral", cls: "bg-warn" },
          { label: "Lean No", cls: "bg-danger" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${item.cls}`} />
            <span className="text-[11px] text-ink3">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
