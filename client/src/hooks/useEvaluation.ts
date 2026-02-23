import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { seveumApi } from "../api/seveum";

export function useEvaluation(candidateId = "1") {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const query = useQuery({
    queryKey: ["evaluation", candidateId],
    queryFn: () => seveumApi.getEvaluation(candidateId),
    staleTime: 60_000,
  });

  const roleId = query.data?.candidate.roleId ?? null;

  const roleCandidatesQuery = useQuery({
    queryKey: ["candidates", roleId],
    queryFn: () => seveumApi.getCandidates(roleId!),
    enabled: !!roleId,
    staleTime: 30_000,
  });

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: () => seveumApi.getRoles(),
    staleTime: 30_000,
  });

  const roleCandidates = useMemo(() => {
    const candidates = roleCandidatesQuery.data ?? [];
    return [...candidates].sort((a, b) => b.score - a.score);
  }, [roleCandidatesQuery.data]);

  const currentIndex = roleCandidates.findIndex((c) => c.id === candidateId);
  const prevCandidate = currentIndex > 0 ? roleCandidates[currentIndex - 1] : null;
  const nextCandidate = currentIndex < roleCandidates.length - 1 ? roleCandidates[currentIndex + 1] : null;

  const role = rolesQuery.data?.find((r) => r.id === roleId) ?? null;

  const toggleExpanded = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return {
    evaluation:    query.data,
    isLoading:     query.isLoading,
    error:         query.error,
    expandedIndex,
    toggleExpanded,
    role,
    roleCandidates,
    prevCandidate,
    nextCandidate,
  };
}
