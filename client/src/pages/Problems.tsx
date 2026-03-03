import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { useProblems } from "../hooks/useProblems";
import { useTopics } from "../hooks/useTopics";
import { ProblemRow } from "../components/shared/ProblemRow";
import { SearchInput } from "../components/shared/SearchInput";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import type { Difficulty, UserProblemStatus } from "../types";

const DIFFICULTIES: (Difficulty | "all")[] = ["all", "easy", "medium", "hard"];
const STATUSES: (UserProblemStatus | "all")[] = ["all", "not_started", "attempted", "solved"];

export default function Problems() {
  const [searchParams] = useSearchParams();
  const {
    problems, totalCount, isLoading, page, setPage,
    topic, setTopic, difficulty, setDifficulty,
    search, setSearch, status, setStatus,
  } = useProblems();
  const { topics } = useTopics();

  // Sync URL query param for topic
  useEffect(() => {
    const urlTopic = searchParams.get("topic");
    if (urlTopic) setTopic(urlTopic);
  }, [searchParams, setTopic]);

  const totalPages = Math.ceil(totalCount / 20);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-64">
          <SearchInput value={search} onChange={setSearch} placeholder="Search problems..." />
        </div>

        {/* Topic dropdown */}
        <select
          value={topic ?? ""}
          onChange={(e) => { setTopic(e.target.value || undefined); setPage(1); }}
          className="input-field w-auto! min-w-[140px]"
        >
          <option value="">All Topics</option>
          {topics.map((t) => (
            <option key={t.id} value={t.slug}>{t.name}</option>
          ))}
        </select>

        {/* Difficulty chips */}
        <div className="flex items-center gap-1.5">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => { setDifficulty(d === "all" ? undefined : d); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                (difficulty ?? "all") === d
                  ? "bg-brand text-white"
                  : "bg-layer2 text-ink2 hover:bg-layer3"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Status chips */}
        <div className="flex items-center gap-1.5 ml-auto">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                status === s
                  ? "bg-brand text-white"
                  : "bg-layer2 text-ink2 hover:bg-layer3"
              }`}
            >
              {s === "all" ? "All" : s.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Problem list */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : problems.length === 0 ? (
        <EmptyState
          title="No problems found"
          description="Try adjusting your filters or search query."
        />
      ) : (
        <div className="space-y-2">
          {problems.map((problem) => (
            <ProblemRow key={problem.id} problem={problem} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            <RiArrowLeftSLine size={16} />
            Previous
          </Button>
          <span className="text-sm text-ink2">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
          >
            Next
            <RiArrowRightSLine size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
