import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { rolesApi } from "../api/roles";
import { candidatesApi } from "../api/candidates";
import type { ScoreFilter, SortDirection } from "../types";

export function useRankings() {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ScoreFilter>("all");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesApi.list(),
    staleTime: 30_000,
  });

  const roles = rolesQuery.data ?? [];
  const activeRoleId = selectedRoleId ?? roles[0]?.id ?? null;

  const candidatesQuery = useQuery({
    queryKey: ["candidates", activeRoleId],
    queryFn: () => candidatesApi.list(activeRoleId ?? undefined),
    enabled: !!activeRoleId,
    staleTime: 30_000,
  });

  const allCandidates = candidatesQuery.data ?? [];

  const filteredCandidates = useMemo(() => {
    const evaluated = allCandidates.filter((c) => c.score > 0);
    switch (filter) {
      case "80+":   return evaluated.filter((c) => c.score >= 80);
      case "70-79": return evaluated.filter((c) => c.score >= 70 && c.score < 80);
      case "<70":   return evaluated.filter((c) => c.score < 70);
      default:      return evaluated;
    }
  }, [allCandidates, filter]);

  const candidates = useMemo(
    () =>
      [...filteredCandidates].sort((a, b) =>
        sortDirection === "desc" ? b.score - a.score : a.score - b.score,
      ),
    [filteredCandidates, sortDirection],
  );

  const selectRole = useCallback((roleId: string) => {
    setSelectedRoleId(roleId);
    setFilter("all");
  }, []);

  const toggleSort = useCallback(() => {
    setSortDirection((d) => (d === "desc" ? "asc" : "desc"));
  }, []);

  return {
    roles,
    activeRoleId,
    selectRole,
    candidates,
    isLoading: rolesQuery.isLoading || candidatesQuery.isLoading,
    filter,
    setFilter,
    sortDirection,
    toggleSort,
  };
}
