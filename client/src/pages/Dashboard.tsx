import { useNavigate } from "react-router-dom";
import { RiAddLine, RiBriefcaseLine } from "react-icons/ri";
import { useDashboard } from "../hooks/useDashboard";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Avatar } from "../components/ui/Avatar";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { CANDIDATES } from "../api/seveum";

const METRIC_CONFIG = [
  { key: "activeRoles",        label: "Active Roles",         color: "var(--color-brand)",   suffix: "+2 this week" },
  { key: "interviewsThisWeek", label: "Interviews This Week", color: "var(--color-success)", suffix: "+12%"         },
  { key: "avgFitScore",        label: "Avg. Fit Score",       color: "var(--color-success)", suffix: "+3 pts"       },
  { key: "pendingReviews",     label: "Pending Reviews",      color: "var(--color-warn)",    suffix: ""             },
] as const;

export default function Dashboard() {
  const navigate = useNavigate();
  const { metrics, pipeline, roles, activity, isLoading } = useDashboard();

  if (isLoading) return <LoadingSkeleton rows={6} />;

  return (
    <div>
      {/* Metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
        {METRIC_CONFIG.map(({ key, label, color, suffix }, i) => (
          <Card
            key={key}
            padding="p-0"
            className={`animate-fade-in delay-${(i + 1) as 1|2|3|4}`}
            style={{ padding: "18px 22px", borderLeft: `3px solid ${color}` }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-ink3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
              {label}
            </div>
            <div className="flex items-baseline" style={{ gap: 8 }}>
              <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--color-ink)" }}>
                {metrics?.[key] ?? "—"}
              </span>
              {suffix && <span style={{ fontSize: 12, fontWeight: 600, color }}>{suffix}</span>}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        <div>
          {/* Pipeline */}
          <div className="flex items-center justify-between animate-fade-in delay-4" style={{ marginBottom: 14 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-ink)" }}>Interview Pipeline</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/setup")}>
              <RiAddLine size={14} />New Role
            </Button>
          </div>

          <div className="animate-fade-in delay-4" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 28 }}>
            {pipeline.map((col) => (
              <Card key={col.stage} padding="p-0" style={{ padding: 14, textAlign: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-ink3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                  {col.label}
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: col.color, letterSpacing: "-0.02em", marginBottom: 10 }}>
                  {col.count}
                </div>
                {CANDIDATES.slice(0, 2).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => navigate(`/evaluation/${c.id}`)}
                    className="flex items-center gap-1.5 w-full cursor-pointer border-0 hover:bg-[var(--acg2)] transition-colors"
                    style={{ padding: "5px 7px", background: "var(--color-canvas2)", borderRadius: 6, marginBottom: 4 }}
                  >
                    <Avatar initials={c.initials} size={20} color={c.color} />
                    <span style={{ fontSize: 11, fontWeight: 500, color: "var(--color-ink2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.name.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </Card>
            ))}
          </div>

          {/* Active roles */}
          <div className="animate-fade-in delay-5">
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-ink)", marginBottom: 14 }}>Active Roles</h2>
            {roles.map((role) => (
              <Card
                key={role.id}
                glow
                padding="p-0"
                onClick={() => navigate("/rankings")}
                className="flex items-center justify-between"
                style={{ marginBottom: 8, padding: "14px 18px" }}
              >
                <div className="flex items-center" style={{ gap: 14 }}>
                  <div
                    className="flex items-center justify-center text-brand"
                    style={{ width: 38, height: 38, borderRadius: 10, background: "var(--acg)" }}
                  >
                    <RiBriefcaseLine size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>{role.title}</div>
                    <div style={{ fontSize: 12, color: "var(--color-ink3)", fontWeight: 400 }}>
                      {role.department} &middot; {role.candidateCount} candidates &middot; {role.daysAgo}d ago
                    </div>
                  </div>
                </div>
                <div className="flex items-center" style={{ gap: 14 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "var(--color-ink3)", textTransform: "uppercase" }}>Avg Score</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: role.avgScore >= 80 ? "var(--color-success)" : "var(--color-warn)", fontFamily: "var(--font-family-mono)" }}>
                      {role.avgScore}
                    </div>
                  </div>
                  <Badge variant="live" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="animate-fade-in delay-5">
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-ink)", marginBottom: 14 }}>Activity</h2>
          <Card padding="p-0" style={{ maxHeight: 500, overflow: "auto" }}>
            {activity.map((item) => (
              <div
                key={item.id}
                className="flex cursor-pointer transition-colors hover:bg-[var(--acg2)]"
                style={{ gap: 12, padding: "13px 18px", borderBottom: "1px solid var(--color-edge)" }}
              >
                <span style={{ fontSize: 16, lineHeight: "20px" }}>{item.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.5, color: "var(--color-ink)" }}>{item.text}</div>
                  <div style={{ fontSize: 11, color: "var(--color-ink3)", marginTop: 2, fontWeight: 400 }}>{item.timeAgo}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
