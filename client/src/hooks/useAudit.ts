import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { seveumApi, REASONING_STEPS } from "../api/seveum";
import type { AuditEventType } from "../types";

type AuditFilter = AuditEventType | "all";

export function useAudit() {
  const [filter, setFilter]             = useState<AuditFilter>("all");
  const [selectedEventId, setSelectedEventId] = useState<string>("e1");

  const query = useQuery({
    queryKey: ["audit"],
    queryFn: () => seveumApi.getAuditEvents(),
    staleTime: 30_000,
  });

  const allEvents = query.data ?? [];
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
