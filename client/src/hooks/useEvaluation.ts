import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { evaluationsApi } from "../api/evaluations";
import { candidatesApi } from "../api/candidates";
import { rolesApi } from "../api/roles";
import type { EvaluationInsight } from "../types";

export function useEvaluation(candidateId = "1") {
  const [selectedInsightIndex, setSelectedInsightIndex] = useState<number | null>(null);

  const query = useQuery({
    queryKey: ["evaluation", candidateId],
    queryFn: () => evaluationsApi.get(candidateId),
    staleTime: 60_000,
    retry: false,
    refetchInterval: (query) => (query.state.error ? 5_000 : false),
  });

  const roleId = query.data?.candidate.roleId ?? null;

  const roleCandidatesQuery = useQuery({
    queryKey: ["candidates", roleId],
    queryFn: () => candidatesApi.list(roleId!),
    enabled: !!roleId,
    staleTime: 30_000,
  });

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesApi.list(),
    staleTime: 30_000,
  });

  const roleCandidates = useMemo(() => {
    const candidates = roleCandidatesQuery.data ?? [];
    return [...candidates].sort((a, b) => b.score - a.score);
  }, [roleCandidatesQuery.data]);

  const currentIndex = roleCandidates.findIndex((c) => c.id === candidateId);
  const prevCandidate = currentIndex > 0 ? roleCandidates[currentIndex - 1] : null;
  const nextCandidate =
    currentIndex < roleCandidates.length - 1 ? roleCandidates[currentIndex + 1] : null;

  const role = rolesQuery.data?.find((r) => r.id === roleId) ?? null;

  const insights = useMemo<EvaluationInsight[]>(() => {
    if (!query.data) return [];
    const { criterionScores, transcript } = query.data;

    return criterionScores.map((cs) => {
      let matchedTranscriptId: string | null = null;

      for (const evidenceQuote of cs.evidence) {
        const words = evidenceQuote
          .toLowerCase()
          .split(/\s+/)
          .filter((w) => w.length > 3)
          .slice(0, 5);

        const match = transcript.find(
          (msg) =>
            msg.speaker === "candidate" &&
            words.some((w) => msg.text.toLowerCase().includes(w)),
        );

        if (match) {
          matchedTranscriptId = match.id;
          break;
        }
      }

      return {
        criterionName: cs.name,
        score: cs.score,
        confidence: Math.round((cs.score * cs.weight) / 100),
        insightText: cs.rationale,
        evidence: cs.evidence,
        riskFlags: cs.riskFlags,
        weight: cs.weight,
        subCriterionScores: cs.subCriterionScores,
        matchedTranscriptId,
      };
    });
  }, [query.data]);

  const summary = useMemo(() => {
    if (!query.data) return "";
    const topCriteria = [...query.data.criterionScores]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3);
    return topCriteria.map((cs) => cs.rationale).join(" ");
  }, [query.data]);

  const selectInsight = useCallback((index: number | null) => {
    setSelectedInsightIndex(index);
  }, []);

  const isTranscriptOpen = selectedInsightIndex !== null;

  const highlightedTranscriptId =
    selectedInsightIndex !== null
      ? insights[selectedInsightIndex]?.matchedTranscriptId ?? null
      : null;

  return {
    evaluation: query.data,
    isLoading: query.isLoading,
    error: query.error,
    role,
    roleCandidates,
    prevCandidate,
    nextCandidate,
    insights,
    summary,
    selectedInsightIndex,
    selectInsight,
    isTranscriptOpen,
    highlightedTranscriptId,
  };
}
