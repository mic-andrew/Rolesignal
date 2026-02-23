import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { seveumApi } from "../api/seveum";
import type { AIConfig, AITone, SettingsTab } from "../types";

const DEFAULT_AI_CONFIG: AIConfig = {
  tone: "Conversational",
  formality: 60,
  probingDepth: 75,
  warmth: 50,
  pace: 65,
};

export function useSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [aiConfig, setAiConfig]   = useState<AIConfig>(DEFAULT_AI_CONFIG);

  const teamQuery         = useQuery({ queryKey: ["team"],         queryFn: seveumApi.getTeam,         staleTime: 60_000 });
  const integrationsQuery = useQuery({ queryKey: ["integrations"], queryFn: seveumApi.getIntegrations, staleTime: 60_000 });
  const templatesQuery    = useQuery({ queryKey: ["templates"],    queryFn: seveumApi.getTemplates,    staleTime: 60_000 });

  const setTone = (tone: AITone) => setAiConfig((c) => ({ ...c, tone }));

  const setSlider = (key: keyof Omit<AIConfig, "tone">, value: number) => {
    setAiConfig((c) => ({ ...c, [key]: value }));
  };

  return {
    activeTab,
    setActiveTab,
    aiConfig,
    setTone,
    setSlider,
    team:         teamQuery.data ?? [],
    integrations: integrationsQuery.data ?? [],
    templates:    templatesQuery.data ?? [],
    isLoadingTeam: teamQuery.isLoading,
  };
}
