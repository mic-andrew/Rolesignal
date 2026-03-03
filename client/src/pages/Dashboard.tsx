import { useNavigate } from "react-router-dom";
import { RiArrowRightLine, RiCodeLine, RiBookOpenLine } from "react-icons/ri";
import { useProgress } from "../hooks/useProgress";
import { useAuth } from "../hooks/useAuth";
import { StatCard } from "../components/ui/StatCard";
import { Card } from "../components/ui/Card";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { DifficultyBreakdown } from "../components/shared/DifficultyBreakdown";
import { StreakDisplay } from "../components/shared/StreakDisplay";
import { Button } from "../components/ui/Button";

export default function Dashboard() {
  const navigate = useNavigate();
  const { stats, isLoading } = useProgress();
  const { user } = useAuth();

  if (isLoading) return <LoadingSkeleton />;

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-ink">
          Welcome back, {firstName}
        </h1>
        <p className="text-ink3 mt-1">Keep up the momentum. Here's your progress.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Problems Solved" value={stats?.totalSolved ?? 0} accentColor="var(--color-brand)" />
        <StatCard label="Acceptance Rate" value={`${stats?.acceptanceRate ?? 0}%`} accentColor="var(--color-success)" animationDelay={100} />
        <StatCard label="Current Streak" value={stats?.currentStreak ?? 0} accentColor="var(--color-warn)" animationDelay={200} />
        <StatCard label="Longest Streak" value={stats?.longestStreak ?? 0} accentColor="var(--color-ink2)" animationDelay={300} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Breakdown */}
        <Card>
          <h3 className="text-sm font-semibold text-ink mb-4">Difficulty Breakdown</h3>
          <DifficultyBreakdown
            easySolved={stats?.easySolved ?? 0}
            mediumSolved={stats?.mediumSolved ?? 0}
            hardSolved={stats?.hardSolved ?? 0}
          />
        </Card>

        {/* Streak */}
        <Card>
          <h3 className="text-sm font-semibold text-ink mb-4">Solve Streak</h3>
          <StreakDisplay
            current={stats?.currentStreak ?? 0}
            longest={stats?.longestStreak ?? 0}
          />
          <p className="text-xs text-ink3 mt-3">
            Solve at least one problem a day to keep your streak alive.
          </p>
        </Card>
      </div>

      {/* Topic Progress */}
      {stats?.topicProgress && stats.topicProgress.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink">Topic Progress</h3>
            <button
              onClick={() => navigate("/progress")}
              className="text-xs text-brand hover:underline flex items-center gap-1"
            >
              View all <RiArrowRightLine size={12} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.topicProgress.map((tp) => {
              const pct = tp.total > 0 ? Math.round((tp.solved / tp.total) * 100) : 0;
              return (
                <div key={tp.topicId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-canvas2 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-ink truncate">{tp.topicName}</div>
                    <div className="h-1.5 bg-edge rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-brand rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, minWidth: tp.solved > 0 ? "4px" : "0" }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-mono text-ink3 shrink-0">
                    {tp.solved}/{tp.total}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button variant="primary" onClick={() => navigate("/problems")}>
          <RiCodeLine size={16} />
          Browse Problems
        </Button>
        <Button variant="ghost" onClick={() => navigate("/topics")}>
          <RiBookOpenLine size={16} />
          Explore Topics
        </Button>
      </div>
    </div>
  );
}
