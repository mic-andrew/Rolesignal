import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "../api/settings";
import { useUIStore } from "../stores/uiStore";
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
  const queryClient = useQueryClient();
  const showToast = useUIStore((s) => s.showToast);

  const teamQuery         = useQuery({ queryKey: ["team"],         queryFn: () => settingsApi.team(),         staleTime: 60_000 });
  const integrationsQuery = useQuery({ queryKey: ["integrations"], queryFn: () => settingsApi.integrations(), staleTime: 60_000 });
  const templatesQuery    = useQuery({ queryKey: ["templates"],    queryFn: () => settingsApi.templates(),    staleTime: 60_000 });

  const inviteMemberMutation = useMutation({
    mutationFn: (email: string) => settingsApi.inviteMember(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      showToast("Team member invited successfully", "success");
    },
    onError: () => showToast("Failed to invite team member", "error"),
  });

  const removeMemberMutation = useMutation({
    mutationFn: (id: string) => settingsApi.removeMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      showToast("Team member removed", "success");
    },
    onError: () => showToast("Failed to remove team member", "error"),
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (id: string) => settingsApi.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      showToast("Template deleted", "success");
    },
    onError: () => showToast("Failed to delete template", "error"),
  });

  const toggleIntegrationMutation = useMutation({
    mutationFn: (id: string) => settingsApi.toggleIntegration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      showToast("Integration updated", "success");
    },
    onError: () => showToast("Failed to update integration", "error"),
  });

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
    inviteMember:      inviteMemberMutation.mutate,
    invitePending:     inviteMemberMutation.isPending,
    removeMember:      removeMemberMutation.mutate,
    removePending:     removeMemberMutation.isPending,
    deleteTemplate:    deleteTemplateMutation.mutate,
    deleteTplPending:  deleteTemplateMutation.isPending,
    toggleIntegration: toggleIntegrationMutation.mutate,
  };
}
