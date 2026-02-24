import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { interviewsApi } from "../api/interviews";
import type { InterviewResponse } from "../api/interviews";
import { rolesApi } from "../api/roles";

type StatusFilter = "all" | "pending" | "in_progress" | "completed";

export function useInterviews() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const interviewsQuery = useQuery({
    queryKey: ["interviews"],
    queryFn: () => interviewsApi.list(),
    staleTime: 15_000,
  });

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesApi.list(),
    staleTime: 30_000,
  });

  const interviews = interviewsQuery.data ?? [];
  const roles = rolesQuery.data ?? [];

  const filtered = useMemo(() => {
    return interviews.filter((i: InterviewResponse) => {
      const matchesSearch =
        !search || i.candidateName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || i.status === statusFilter;
      const matchesRole =
        roleFilter === "all" || i.roleId === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [interviews, search, statusFilter, roleFilter]);

  const stats = useMemo(() => {
    const all = interviews;
    return {
      total: all.length,
      pending: all.filter((i: InterviewResponse) => i.status === "pending").length,
      inProgress: all.filter((i: InterviewResponse) => i.status === "in_progress").length,
      completed: all.filter((i: InterviewResponse) => i.status === "completed").length,
    };
  }, [interviews]);

  return {
    interviews: filtered,
    roles,
    stats,
    isLoading: interviewsQuery.isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
  };
}
