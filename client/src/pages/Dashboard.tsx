import { useNavigate } from "react-router-dom";
import { RiAddLine, RiBriefcaseLine } from "react-icons/ri";
import { useDashboard } from "../hooks/useDashboard";
import { Card } from "../components/ui/Card";
import { StatCard } from "../components/ui/StatCard";
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
      <div className="flex items-center justify-center animate-fade-in min-h-[60vh]">
        <EmptyState
          title="Welcome to RoleSignal"
          description="Set up your first interview to start evaluating candidates with AI-powered assessments."
          action={{ label: "Create Interview", onClick: () => navigate("/setup") }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-5">
        {METRIC_CONFIG.map(({ key, label, color }, i) => (
          <StatCard
            key={key}
            label={label}
            value={metrics?.[key] ?? 0}
            accentColor={color}
            animationDelay={i + 1}
          />
        ))}
      </div>

      <div className="grid gap-8 grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between animate-fade-in delay-4 mb-4">
              <h2 className="text-base font-bold text-ink">Interview Pipeline</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/setup")}>
                <RiAddLine size={14} />New Interview
              </Button>
            </div>

            <div className="animate-fade-in delay-4 grid grid-cols-5 gap-4">
              {pipeline.map((col) => (
                <Card key={col.stage} padding="p-0" className="text-center px-4 py-6">
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5 text-ink3">
                    {col.label}
                  </div>
                  <div
                    className="text-2xl font-extrabold mb-3 tracking-tight"
                    style={{ color: col.color }}
                  >
                    {col.count}
                  </div>
                  {col.candidateIds.slice(0, 2).map((cid: string) => (
                    <button
                      key={cid}
                      onClick={() => navigate(`/evaluation/${cid}`)}
                      className="flex items-center gap-1.5 w-full cursor-pointer border-0 hover:bg-(--acg2) transition-colors px-2 py-[5px] bg-canvas2 rounded-md mb-1"
                    >
                      <div className="shrink-0 rounded-full w-5 h-5 bg-brand opacity-15" />
                      <span className="text-[11px] font-medium text-ink2">View</span>
                    </button>
                  ))}
                </Card>
              ))}
            </div>
          </div>

          <div className="animate-fade-in delay-5">
            <h2 className="text-base font-bold mb-4 text-ink">Interview Roles</h2>
            {roles.length === 0 ? (
              <EmptyState
                title="No interview roles yet"
                description="Create your first interview to start evaluating candidates."
                action={{ label: "Create Interview", onClick: () => navigate("/setup") }}
              />
            ) : (
              <div className="space-y-2.5">
                {roles.map((role) => (
                  <Card
                    key={role.id}
                    glow
                    padding="p-0"
                    onClick={() => navigate("/interviews")}
                    className="flex items-center justify-between px-6 py-5"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex items-center justify-center text-brand w-[38px] h-[38px] rounded-[10px] bg-(--acg)">
                        <RiBriefcaseLine size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-ink">{role.title}</div>
                        <div className="text-xs text-ink3">
                          {role.department} &middot; {role.candidateCount} candidates
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3.5">
                      {role.avgScore > 0 && (
                        <div className="text-right">
                          <div className="text-[10px] font-semibold uppercase text-ink3">Avg Score</div>
                          <div className={`text-lg font-extrabold font-mono ${role.avgScore >= 80 ? "text-success" : "text-warn"}`}>
                            {role.avgScore}
                          </div>
                        </div>
                      )}
                      <Badge variant="live" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="animate-fade-in delay-5">
          <h2 className="text-base font-bold mb-4 text-ink">Activity</h2>
          {activity.length === 0 ? (
            <Card padding="p-0" className="px-5 py-6 text-center">
              <p className="text-xs text-ink3">No activity yet. Create an interview to get started.</p>
            </Card>
          ) : (
            <Card padding="p-0" className="max-h-[500px] overflow-auto">
              {activity.map((item) => (
                <div
                  key={item.id}
                  className="flex cursor-pointer transition-colors hover:bg-(--acg2) gap-3 px-5 py-3.5 border-b border-edge"
                >
                  <span className="text-base leading-5">{item.emoji}</span>
                  <div className="flex-1">
                    <div className="text-[13px] font-medium leading-relaxed text-ink">{item.text}</div>
                    <div className="text-[11px] mt-0.5 text-ink3">{item.timeAgo}</div>
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
