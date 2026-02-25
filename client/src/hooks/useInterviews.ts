import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { interviewsApi } from "../api/interviews";
import type { InterviewResponse } from "../api/interviews";
import { rolesApi } from "../api/roles";
import { useUIStore } from "../stores/uiStore";

type StatusFilter = "all" | "pending" | "in_progress" | "completed";

export interface RoleGroup {
  roleId: string;
  roleTitle: string;
  department: string;
  candidates: InterviewResponse[];
  pending: number;
  inProgress: number;
  completed: number;
  configDuration: number;
  configTone: string;
}

export function useInterviews() {
  const queryClient = useQueryClient();
  const showToast = useUIStore((s) => s.showToast);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

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

  const deleteMutation = useMutation({
    mutationFn: (id: string) => interviewsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      showToast("Interview deleted", "success");
    },
    onError: () => {
      showToast("Failed to delete interview", "error");
    },
  });

  const interviews = useMemo(() => interviewsQuery.data ?? [], [interviewsQuery.data]);
  const roles = useMemo(() => rolesQuery.data ?? [], [rolesQuery.data]);

  // Group interviews by roleId
  const roleGroups = useMemo(() => {
    const map = new Map<string, RoleGroup>();
    for (const iv of interviews) {
      let group = map.get(iv.roleId);
      if (!group) {
        group = {
          roleId: iv.roleId,
          roleTitle: iv.roleTitle,
          department: roles.find((r) => r.id === iv.roleId)?.department ?? "",
          candidates: [],
          pending: 0,
          inProgress: 0,
          completed: 0,
          configDuration: iv.configDuration,
          configTone: iv.configTone,
        };
        map.set(iv.roleId, group);
      }
      group.candidates.push(iv);
      if (iv.status === "pending") group.pending++;
      else if (iv.status === "in_progress") group.inProgress++;
      else if (iv.status === "completed") group.completed++;
    }
    return Array.from(map.values());
  }, [interviews, roles]);

  // Filter
  const filtered = useMemo(() => {
    return roleGroups.filter((g) => {
      const matchesSearch =
        !search ||
        g.roleTitle.toLowerCase().includes(search.toLowerCase()) ||
        g.candidates.some((c) =>
          c.candidateName.toLowerCase().includes(search.toLowerCase()),
        );
      const matchesStatus =
        statusFilter === "all" ||
        g.candidates.some((c) => c.status === statusFilter);
      return matchesSearch && matchesStatus;
    });
  }, [roleGroups, search, statusFilter]);

  const stats = useMemo(() => {
    const all = interviews;
    return {
      total: roleGroups.length,
      pending: all.filter((i: InterviewResponse) => i.status === "pending").length,
      inProgress: all.filter((i: InterviewResponse) => i.status === "in_progress").length,
      completed: all.filter((i: InterviewResponse) => i.status === "completed").length,
    };
  }, [interviews, roleGroups]);

  const deleteInterview = useCallback(
    (id: string) => deleteMutation.mutate(id),
    [deleteMutation],
  );

  return {
    roleGroups: filtered,
    interviews,
    roles,
    stats,
    isLoading: interviewsQuery.isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    deleteInterview,
  };
}
