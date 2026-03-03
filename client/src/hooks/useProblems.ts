import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { problemsApi } from "../api/problems";
import type { Difficulty, UserProblemStatus } from "../types";

export function useProblems() {
  const [topic, setTopic] = useState<string | undefined>();
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<UserProblemStatus | "all">("all");
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["problems", { topic, difficulty, search, status, page }],
    queryFn: () =>
      problemsApi
        .list({
          topic,
          difficulty,
          search: search || undefined,
          status: status === "all" ? undefined : status,
          page,
          perPage: 20,
        })
        .then((r) => r.data),
  });

  return {
    problems: query.data?.data ?? [],
    totalCount: query.data?.count ?? 0,
    isLoading: query.isLoading,
    page,
    setPage,
    topic,
    setTopic,
    difficulty,
    setDifficulty,
    search,
    setSearch,
    status,
    setStatus,
  };
}
