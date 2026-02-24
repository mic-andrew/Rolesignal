import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { rolesApi } from "../api/roles";
import { candidatesApi } from "../api/candidates";

export function useRankings() {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [compareMode, setCompareMode]       = useState(false);
  const [selectedIds, setSelectedIds]       = useState<string[]>([]);

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

  const candidates = candidatesQuery.data ?? [];

  const selectRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    setSelectedIds([]);
    setCompareMode(false);
  };

  const toggleCompare = () => {
    if (!compareMode) {
      const defaultIds = candidates.slice(0, 2).map((c) => c.id);
      setSelectedIds(defaultIds);
    }
    setCompareMode((v) => !v);
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id].slice(-3),
    );
  };

  const selectedCandidates = candidates.filter((c) => selectedIds.includes(c.id));

  return {
    roles,
    activeRoleId,
    selectRole,
    candidates,
    isLoading: rolesQuery.isLoading || candidatesQuery.isLoading,
    compareMode,
    selectedIds,
    selectedCandidates,
    toggleCompare,
    toggleSelected,
  };
}
