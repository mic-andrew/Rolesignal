import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { seveumApi } from "../api/seveum";
import type { CandidateStatus, RoleCandidateGroup } from "../types";

type FilterOption = CandidateStatus | "all";

export function useCandidates() {
  const [search, setSearch]                 = useState("");
  const [filter, setFilter]                 = useState<FilterOption>("all");
  const [collapsedRoles, setCollapsedRoles] = useState<Set<string>>(new Set());

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: () => seveumApi.getRoles(),
    staleTime: 30_000,
  });

  const candidatesQuery = useQuery({
    queryKey: ["candidates"],
    queryFn: () => seveumApi.getCandidates(),
    staleTime: 30_000,
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
  };
}
