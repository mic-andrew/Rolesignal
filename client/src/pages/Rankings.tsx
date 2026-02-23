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
const MEDAL_COLOR = ["#FFD700", "#C0C0C0", "#CD7F32"];

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
    <div>
      {/* Role tabs */}
      <div className="flex items-center animate-fade-in" style={{ gap: 6, marginBottom: 18 }}>
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => selectRole(role.id)}
            className="cursor-pointer border-0 transition-all"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: role.id === activeRoleId ? 700 : 500,
              background: role.id === activeRoleId
                ? "linear-gradient(135deg, var(--color-brand), #6358E0)"
                : "transparent",
              color: role.id === activeRoleId ? "#fff" : "var(--color-ink3)",
              border: role.id === activeRoleId ? "none" : "1px solid var(--color-edge)",
              boxShadow: role.id === activeRoleId ? "0 2px 12px rgba(124,111,255,0.3)" : "none",
            }}
          >
            {role.title}
            <span
              style={{
                padding: "1px 7px",
                borderRadius: 10,
                fontSize: 10,
                fontWeight: 700,
                background: role.id === activeRoleId ? "rgba(255,255,255,0.2)" : "var(--color-edge)",
                color: role.id === activeRoleId ? "#fff" : "var(--color-ink3)",
              }}
            >
              {role.candidateCount}
            </span>
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <Button variant="ghost" size="sm" onClick={toggleCompare}>
          <RiEyeLine size={14} />{compareMode ? "Exit Compare" : "Compare"}
        </Button>
        <Button variant="ghost" size="sm">
          <RiDownloadLine size={14} />Export
        </Button>
      </div>

      {/* Subtitle */}
      {activeRole && (
        <div className="flex items-center animate-fade-in" style={{ gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 12, color: "var(--color-ink3)" }}>
            {activeRole.department} &middot; {activeRole.seniority} &middot; {activeRole.location}
          </span>
          <Badge variant="live" />
        </div>
      )}

      {/* Table */}
      {candidates.length === 0 ? (
        <EmptyState title="No candidates yet" description="Candidates will appear here once they complete their interviews." />
      ) : (
        <Card padding="p-0" className="overflow-hidden animate-fade-in delay-2">
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--color-canvas2)" }}>
                {["#", "Candidate", "Score", "Tech", "Behav", "Comm", "Risk", "Status", ""].map((h) => (
                  <th
                    key={h}
                    style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "var(--color-ink3)", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid var(--color-edge)" }}
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
                  className="cursor-pointer transition-colors hover:bg-[var(--acg2)]"
                  style={{
                    borderBottom: "1px solid var(--color-edge)",
                    background: compareMode && selectedIds.includes(c.id) ? "var(--acg2)" : "transparent",
                  }}
                >
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: i < 3 ? MEDAL_COLOR[i] : "var(--color-ink3)" }}>
                      {i < 3 ? MEDAL[i] : i + 1}
                    </span>
                  </td>

                  <td style={{ padding: "10px 14px" }}>
                    <div className="flex items-center" style={{ gap: 10 }}>
                      {compareMode && (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(c.id)}
                          readOnly
                          style={{ accentColor: "var(--color-brand)" }}
                        />
                      )}
                      <Avatar initials={c.initials} size={30} color={c.color} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ink)" }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: "var(--color-ink3)" }}>{c.date}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: "10px 14px" }}>
                    <div className="flex items-center" style={{ gap: 8 }}>
                      <div style={{ width: 50, height: 5, borderRadius: 3, overflow: "hidden", background: "var(--color-edge)" }}>
                        <div
                          className="animate-bar-fill"
                          style={{ height: "100%", width: `${c.score}%`, borderRadius: 3, background: c.score >= 80 ? "var(--color-success)" : c.score >= 60 ? "var(--color-warn)" : "var(--color-danger)" }}
                        />
                      </div>
                      <span
                        style={{ fontSize: 13, fontWeight: 800, fontFamily: "var(--font-family-mono)", color: c.score >= 80 ? "var(--color-success)" : c.score >= 60 ? "var(--color-warn)" : "var(--color-danger)" }}
                      >
                        {c.score}
                      </span>
                    </div>
                  </td>

                  {(["tech", "behavioral", "communication"] as const).map((sk) => (
                    <td key={sk} style={{ padding: "10px 14px" }}>
                      <span
                        style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-family-mono)", color: c.skills[sk] >= 80 ? "var(--color-success)" : c.skills[sk] >= 60 ? "var(--color-warn)" : "var(--color-danger)" }}
                      >
                        {c.skills[sk]}
                      </span>
                    </td>
                  ))}

                  <td style={{ padding: "10px 14px" }}>
                    {c.score >= 80 ? <Badge variant="shortlisted" /> : c.score >= 60 ? <Badge variant="pending" /> : <Badge variant="rejected" />}
                  </td>
                  <td style={{ padding: "10px 14px" }}><Badge variant={c.status} /></td>
                  <td style={{ padding: "10px 14px", color: "var(--color-ink3)" }}><RiArrowRightSLine size={16} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Comparison drawer */}
      {compareMode && selectedCandidates.length >= 2 && (
        <div className="animate-fade-in-scale" style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-ink)", marginBottom: 14 }}>
            Comparing: {selectedCandidates.map((c) => c.name.split(" ")[0]).join(" vs ")}
          </h3>
          <div className="flex" style={{ gap: 14 }}>
            {selectedCandidates.map((c) => (
              <CompareCard key={c.id} candidate={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
