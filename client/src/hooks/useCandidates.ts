import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { candidatesApi } from "../api/candidates";
import { rolesApi } from "../api/roles";
import { useUIStore } from "../stores/uiStore";
import type { CandidateStatus, RoleCandidateGroup } from "../types";

type FilterOption = CandidateStatus | "all";

export function useCandidates() {
  const [search, setSearch]                 = useState("");
  const [filter, setFilter]                 = useState<FilterOption>("all");
  const [collapsedRoles, setCollapsedRoles] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();
  const showToast = useUIStore((s) => s.showToast);

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesApi.list(),
    staleTime: 30_000,
  });

  const candidatesQuery = useQuery({
    queryKey: ["candidates"],
    queryFn: () => candidatesApi.list(),
    staleTime: 30_000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: CandidateStatus }) =>
      candidatesApi.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      showToast("Candidate status updated", "success");
    },
    onError: () => showToast("Failed to update candidate status", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => candidatesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      showToast("Candidate removed", "success");
    },
    onError: () => showToast("Failed to remove candidate", "error"),
  });

  const roles = rolesQuery.data ?? [];

  const filtered = useMemo(() => {
    const all = candidatesQuery.data ?? [];
    return all.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || c.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [candidatesQuery.data, search, filter]);

  const groupedByRole = useMemo<RoleCandidateGroup[]>(() => {
    return roles
      .map((role) => ({
        role,
        candidates: filtered.filter((c) => c.roleId === role.id),
      }))
      .filter((g) => g.candidates.length > 0);
  }, [roles, filtered]);

  const toggleRoleCollapsed = useCallback((roleId: string) => {
    setCollapsedRoles((prev) => {
      const next = new Set(prev);
      if (next.has(roleId)) next.delete(roleId);
      else next.add(roleId);
      return next;
    });
  }, []);

  return {
    candidates: filtered,
    groupedByRole,
    roles,
    isLoading: candidatesQuery.isLoading || rolesQuery.isLoading,
    search,
    setSearch,
    filter,
    setFilter,
    collapsedRoles,
    toggleRoleCollapsed,
    updateStatus: updateStatusMutation.mutate,
    deleteCandidate: deleteMutation.mutate,
    deletePending: deleteMutation.isPending,
  };
}
