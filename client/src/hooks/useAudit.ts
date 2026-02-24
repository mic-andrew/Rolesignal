import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { auditApi } from "../api/audit";
import type { AuditEventType, ReasoningStep } from "../types";

type AuditFilter = AuditEventType | "all";

const REASONING_STEPS: ReasoningStep[] = [
  { label: "Criteria Analysis",       detail: "Mapped evaluation criteria to interview questions and scoring rubric" },
  { label: "Response Evaluation",      detail: "Analyzed candidate responses against structured criteria with evidence tagging" },
  { label: "Bias Detection",           detail: "Checked for demographic bias, halo effects, and ordering bias in scoring" },
  { label: "Confidence Calibration",   detail: "Adjusted confidence interval based on response depth and evidence quality" },
  { label: "Final Score Composition",  detail: "Weighted criterion scores into composite fit score with explainability trace" },
];

export function useAudit() {
  const [filter, setFilter]             = useState<AuditFilter>("all");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["audit"],
    queryFn: () => auditApi.list(1, 50),
    staleTime: 30_000,
  });

  const allEvents = query.data?.data ?? [];
  const events    = filter === "all" ? allEvents : allEvents.filter((e) => e.type === filter);
  const selectedEvent = allEvents.find((e) => e.id === selectedEventId) ?? allEvents[0];

  return {
    events,
    isLoading: query.isLoading,
    filter,
    setFilter,
    selectedEvent,
    setSelectedEventId,
    reasoningSteps: REASONING_STEPS,
  };
}
