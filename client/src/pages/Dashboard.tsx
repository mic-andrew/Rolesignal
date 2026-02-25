import { useNavigate } from "react-router-dom";
import { RiAddLine, RiBriefcaseLine } from "react-icons/ri";
import { useDashboard } from "../hooks/useDashboard";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { EmptyState } from "../components/ui/EmptyState";

const METRIC_CONFIG = [
  { key: "activeRoles",        label: "Active Interviews",     color: "var(--color-brand)"   },
  { key: "interviewsThisWeek", label: "Interviews This Week", color: "var(--color-success)" },
  { key: "avgFitScore",        label: "Avg. Fit Score",       color: "var(--color-success)" },
  { key: "pendingReviews",     label: "Pending Reviews",      color: "var(--color-warn)"    },
] as const;

export default function Dashboard() {
  const navigate = useNavigate();
  const { metrics, pipeline, roles, activity, isLoading } = useDashboard();

  if (isLoading) return <LoadingSkeleton rows={6} />;

  const hasData = metrics && (
    metrics.activeRoles > 0 ||
    metrics.interviewsThisWeek > 0 ||
    metrics.avgFitScore > 0 ||
    metrics.pendingReviews > 0
  );

  if (!hasData) {
    return (
      <div className="flex items-center justify-center animate-fade-in" style={{ minHeight: "60vh" }}>
        <EmptyState
          title="Welcome to RoleSignal"
          description="Set up your first interview to start evaluating candidates with AI-powered assessments."
          action={{ label: "Create Interview", onClick: () => navigate("/setup") }}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-3.5 mb-7">
        {METRIC_CONFIG.map(({ key, label, color }, i) => (
          <Card
            key={key}
            padding="p-0"
            className={`animate-fade-in delay-${(i + 1) as 1|2|3|4}`}
            style={{ padding: "18px 22px", borderLeft: `3px solid ${color}` }}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-2.5" style={{ color: "var(--color-ink3)" }}>
              {label}
            </div>
            <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--color-ink)" }}>
              {metrics?.[key] ?? 0}
            </span>
          </Card>
        ))}
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 340px" }}>
        <div>
          {/* Pipeline */}
          <div className="flex items-center justify-between animate-fade-in delay-4 mb-3.5">
            <h2 className="text-[15px] font-bold" style={{ color: "var(--color-ink)" }}>Interview Pipeline</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/setup")}>
              <RiAddLine size={14} />New Interview
            </Button>
          </div>

          <div className="animate-fade-in delay-4 grid grid-cols-5 gap-2.5 mb-7">
            {pipeline.map((col) => (
              <Card key={col.stage} padding="p-0" className="text-center" style={{ padding: 14 }}>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-ink3)" }}>
                  {col.label}
                </div>
                <div className="text-[26px] font-extrabold mb-2.5" style={{ color: col.color, letterSpacing: "-0.02em" }}>
                  {col.count}
                </div>
                {col.candidateIds.slice(0, 2).map((cid: string) => (
                  <button
                    key={cid}
                    onClick={() => navigate(`/evaluation/${cid}`)}
                    className="flex items-center gap-1.5 w-full cursor-pointer border-0 hover:bg-[var(--acg2)] transition-colors"
                    style={{ padding: "5px 7px", background: "var(--color-canvas2)", borderRadius: 6, marginBottom: 4 }}
                  >
                    <div className="shrink-0 rounded-full" style={{ width: 20, height: 20, background: "var(--color-brand)", opacity: 0.15 }} />
                    <span className="text-[11px] font-medium" style={{ color: "var(--color-ink2)" }}>View</span>
                  </button>
                ))}
              </Card>
            ))}
          </div>

          {/* Interview roles */}
          <div className="animate-fade-in delay-5">
            <h2 className="text-[15px] font-bold mb-3.5" style={{ color: "var(--color-ink)" }}>Interview Roles</h2>
            {roles.length === 0 ? (
              <EmptyState
                title="No interview roles yet"
                description="Create your first interview to start evaluating candidates."
                action={{ label: "Create Interview", onClick: () => navigate("/setup") }}
              />
            ) : (
              roles.map((role) => (
                <Card
                  key={role.id}
                  glow
                  padding="p-0"
                  onClick={() => navigate("/rankings")}
                  className="flex items-center justify-between mb-2"
                  style={{ padding: "14px 18px" }}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="flex items-center justify-center text-brand"
                      style={{ width: 38, height: 38, borderRadius: 10, background: "var(--acg)" }}
                    >
                      <RiBriefcaseLine size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: "var(--color-ink)" }}>{role.title}</div>
                      <div className="text-xs" style={{ color: "var(--color-ink3)" }}>
                        {role.department} &middot; {role.candidateCount} candidates
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5">
                    {role.avgScore > 0 && (
                      <div className="text-right">
                        <div className="text-[10px] font-semibold uppercase" style={{ color: "var(--color-ink3)" }}>Avg Score</div>
                        <div className="text-lg font-extrabold font-mono" style={{ color: role.avgScore >= 80 ? "var(--color-success)" : "var(--color-warn)" }}>
                          {role.avgScore}
                        </div>
                      </div>
                    )}
                    <Badge variant="live" />
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Activity feed */}
        <div className="animate-fade-in delay-5">
          <h2 className="text-[15px] font-bold mb-3.5" style={{ color: "var(--color-ink)" }}>Activity</h2>
          {activity.length === 0 ? (
            <Card padding="p-0" style={{ padding: "24px 18px", textAlign: "center" }}>
              <p className="text-xs" style={{ color: "var(--color-ink3)" }}>No activity yet. Create an interview to get started.</p>
            </Card>
          ) : (
            <Card padding="p-0" style={{ maxHeight: 500, overflow: "auto" }}>
              {activity.map((item) => (
                <div
                  key={item.id}
                  className="flex cursor-pointer transition-colors hover:bg-[var(--acg2)]"
                  style={{ gap: 12, padding: "13px 18px", borderBottom: "1px solid var(--color-edge)" }}
                >
                  <span style={{ fontSize: 16, lineHeight: "20px" }}>{item.emoji}</span>
                  <div className="flex-1">
                    <div className="text-[13px] font-medium leading-relaxed" style={{ color: "var(--color-ink)" }}>{item.text}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: "var(--color-ink3)" }}>{item.timeAgo}</div>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
