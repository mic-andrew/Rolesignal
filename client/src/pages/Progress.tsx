import { useQuery } from "@tanstack/react-query";
import { useProgress } from "../hooks/useProgress";
import { progressApi } from "../api/progress";
import { Card } from "../components/ui/Card";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { DifficultyBreakdown } from "../components/shared/DifficultyBreakdown";
import { StreakDisplay } from "../components/shared/StreakDisplay";
import { SubmissionRow } from "../components/shared/SubmissionRow";

export default function Progress() {
  const { stats, isLoading: statsLoading } = useProgress();

  const submissionsQuery = useQuery({
    queryKey: ["progress", "submissions"],
    queryFn: () => progressApi.submissions({ perPage: 20 }).then((r) => r.data),
    staleTime: 30_000,
  });

  if (statsLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ink">Progress</h1>
        <p className="text-ink3 mt-1">Your detailed learning stats and submission history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overview */}
        <Card>
          <h3 className="text-sm font-semibold text-ink mb-4">Overview</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-3xl font-extrabold font-mono text-brand">{stats?.totalSolved ?? 0}</div>
              <div className="text-[10px] uppercase tracking-wider text-ink3 font-semibold mt-1">Problems Solved</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold font-mono text-success">{stats?.acceptanceRate ?? 0}%</div>
              <div className="text-[10px] uppercase tracking-wider text-ink3 font-semibold mt-1">Acceptance Rate</div>
            </div>
          </div>
          <StreakDisplay
            current={stats?.currentStreak ?? 0}
            longest={stats?.longestStreak ?? 0}
          />
        </Card>

        {/* Difficulty Breakdown */}
        <Card>
          <h3 className="text-sm font-semibold text-ink mb-4">Difficulty Breakdown</h3>
          <DifficultyBreakdown
            easySolved={stats?.easySolved ?? 0}
            mediumSolved={stats?.mediumSolved ?? 0}
            hardSolved={stats?.hardSolved ?? 0}
          />
        </Card>
      </div>

      {/* Topic-by-Topic Progress */}
      {stats?.topicProgress && stats.topicProgress.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-ink mb-4">Topic-by-Topic</h3>
          <div className="space-y-3">
            {stats.topicProgress.map((tp) => {
              const pct = tp.total > 0 ? Math.round((tp.solved / tp.total) * 100) : 0;
              return (
                <div key={tp.topicId} className="flex items-center gap-4">
                  <div className="w-36 text-sm font-medium text-ink truncate">{tp.topicName}</div>
                  <div className="flex-1 h-2 bg-edge rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, minWidth: tp.solved > 0 ? "4px" : "0" }}
                    />
                  </div>
                  <span className="text-xs font-mono text-ink2 w-16 text-right">
                    {tp.solved}/{tp.total} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Recent Submissions */}
      <Card>
        <h3 className="text-sm font-semibold text-ink mb-4">Recent Submissions</h3>
        {submissionsQuery.isLoading && <LoadingSkeleton />}
        {!submissionsQuery.isLoading && (!submissionsQuery.data?.data || submissionsQuery.data.data.length === 0) && (
          <EmptyState
            title="No submissions yet"
            description="Start solving problems to see your submission history."
          />
        )}
        {submissionsQuery.data?.data && submissionsQuery.data.data.length > 0 && (
          <div className="divide-y divide-edge">
            {submissionsQuery.data.data.map((sub) => (
              <SubmissionRow
                key={sub.id}
                submission={{
                  id: sub.id,
                  language: sub.language,
                  status: sub.status,
                  runtimeMs: sub.runtimeMs,
                  createdAt: sub.createdAt,
                }}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
