import { useNavigate } from "react-router-dom";
import { RiEyeLine, RiDownloadLine, RiArrowRightSLine } from "react-icons/ri";
import { useRankings } from "../hooks/useRankings";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Avatar } from "../components/ui/Avatar";
import { CompareCard } from "../components/shared/CompareCard";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { EmptyState } from "../components/ui/EmptyState";

const MEDAL = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];
const MEDAL_COLOR_CLASS = ["text-[#FFD700]", "text-[#C0C0C0]", "text-[#CD7F32]"];

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

export default function Rankings() {
  const navigate = useNavigate();
  const {
    roles, activeRoleId, selectRole,
    candidates, isLoading,
    compareMode, selectedIds, selectedCandidates,
    toggleCompare, toggleSelected,
  } = useRankings();

  if (isLoading) return <LoadingSkeleton rows={5} />;

  const activeRole = roles.find((r) => r.id === activeRoleId);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1.5 animate-fade-in">
        {roles.map((role) => {
          const isActive = role.id === activeRoleId;
          return (
            <button
              key={role.id}
              onClick={() => selectRole(role.id)}
              className={`cursor-pointer border-0 transition-all inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-lg text-[13px] ${
                isActive
                  ? "font-bold bg-linear-to-br from-brand to-[#6358E0] text-white border-none shadow-[0_2px_12px_rgba(124,111,255,0.3)]"
                  : "font-medium bg-transparent text-ink3 border border-edge shadow-none"
              }`}
            >
              {role.title}
              <span
                className={`px-[7px] py-px rounded-[10px] text-[10px] font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-edge text-ink3"
                }`}
              >
                {role.candidateCount}
              </span>
            </button>
          );
        })}

        <div className="flex-1" />

        <Button variant="ghost" size="sm" onClick={toggleCompare}>
          <RiEyeLine size={14} />{compareMode ? "Exit Compare" : "Compare"}
        </Button>
        <Button variant="ghost" size="sm">
          <RiDownloadLine size={14} />Export
        </Button>
      </div>

      {activeRole && (
        <div className="flex items-center gap-2 animate-fade-in">
          <span className="text-xs text-ink3">
            {activeRole.department} &middot; {activeRole.seniority} &middot; {activeRole.location}
          </span>
          <Badge variant="live" />
        </div>
      )}

      {candidates.length === 0 ? (
        <EmptyState title="No candidates yet" description="Candidates will appear here once they complete their interviews." />
      ) : (
        <Card padding="p-0" className="overflow-hidden animate-fade-in delay-2">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-canvas2">
                {["#", "Candidate", "Score", "Tech", "Behav", "Comm", "Risk", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[10px] font-bold text-ink3 uppercase tracking-[0.06em] border-b border-edge"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {candidates.map((c, i) => (
                <tr
                  key={c.id}
                  onClick={() => compareMode ? toggleSelected(c.id) : navigate(`/evaluation/${c.id}`)}
                  className={`cursor-pointer transition-colors hover:bg-(--acg2) border-b border-edge ${
                    compareMode && selectedIds.includes(c.id) ? "bg-(--acg2)" : "bg-transparent"
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className={`text-sm font-extrabold ${i < 3 ? MEDAL_COLOR_CLASS[i] : "text-ink3"}`}>
                      {i < 3 ? MEDAL[i] : i + 1}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {compareMode && (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(c.id)}
                          readOnly
                          className="accent-brand"
                        />
                      )}
                      <Avatar initials={c.initials} size={30} color={c.color} />
                      <div>
                        <div className="text-[13px] font-semibold text-ink">{c.name}</div>
                        <div className="text-[11px] text-ink3">{c.date}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-[50px] h-[5px] rounded-[3px] overflow-hidden bg-edge">
                        <div
                          className={`h-full rounded-[3px] animate-bar-fill ${barBgClass(c.score)}`}
                          style={{ width: `${c.score}%` }}
                        />
                      </div>
                      <span
                        className={`text-[13px] font-extrabold font-family-mono ${scoreColorClass(c.score)}`}
                      >
                        {c.score}
                      </span>
                    </div>
                  </td>

                  {(["tech", "behavioral", "communication"] as const).map((sk) => (
                    <td key={sk} className="px-4 py-3">
                      <span
                        className={`text-[13px] font-semibold font-family-mono ${scoreColorClass(c.skills[sk])}`}
                      >
                        {c.skills[sk]}
                      </span>
                    </td>
                  ))}

                  <td className="px-4 py-3">
                    {c.score >= 80 ? <Badge variant="shortlisted" /> : c.score >= 60 ? <Badge variant="pending" /> : <Badge variant="rejected" />}
                  </td>
                  <td className="px-4 py-3"><Badge variant={c.status} /></td>
                  <td className="px-4 py-3 text-ink3"><RiArrowRightSLine size={16} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {compareMode && selectedCandidates.length >= 2 && (
        <div className="animate-fade-in-scale">
          <h3 className="text-[15px] font-bold text-ink mb-4">
            Comparing: {selectedCandidates.map((c) => c.name.split(" ")[0]).join(" vs ")}
          </h3>
          <div className="flex gap-4">
            {selectedCandidates.map((c) => (
              <CompareCard key={c.id} candidate={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
