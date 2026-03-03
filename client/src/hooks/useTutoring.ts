import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tutoringApi } from "../api/tutoring";
import { useUIStore } from "../stores/uiStore";
import type { TutoringMessage, TutoringSession, Language } from "../types";

export function useTutoring(problemId: string) {
  const queryClient = useQueryClient();
  const showToast = useUIStore((s) => s.showToast);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const messagesQuery = useQuery<TutoringMessage[]>({
    queryKey: ["tutoring-messages", sessionId],
    queryFn: () => tutoringApi.getMessages(sessionId!).then((r) => r.data),
    enabled: !!sessionId,
    refetchInterval: false,
  });

  const startMutation = useMutation({
    mutationFn: (voiceEnabled: boolean) =>
      tutoringApi.startSession({ problemId, voiceEnabled }).then((r) => r.data),
    onSuccess: (session: TutoringSession) => {
      setSessionId(session.id);
    },
    onError: () => {
      showToast("Failed to start tutoring session", "error");
    },
  });

  const sendMutation = useMutation({
    mutationFn: (payload: { content: string; currentCode: string; language: Language }) => {
      if (!sessionId) throw new Error("No active session");
      return tutoringApi
        .sendMessage(sessionId, {
          content: payload.content,
          currentCode: payload.currentCode,
          language: payload.language,
        })
        .then((r) => r.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutoring-messages", sessionId] });
    },
    onError: () => {
      showToast("Failed to send message", "error");
    },
  });

  const endMutation = useMutation({
    mutationFn: () => {
      if (!sessionId) throw new Error("No active session");
      return tutoringApi.endSession(sessionId);
    },
    onSuccess: () => {
      setSessionId(null);
      queryClient.removeQueries({ queryKey: ["tutoring-messages"] });
    },
  });

  const startSession = useCallback(
    (voiceEnabled = false) => startMutation.mutate(voiceEnabled),
    [startMutation],
  );

  const sendMessage = useCallback(
    (content: string, currentCode: string, language: Language) =>
      sendMutation.mutate({ content, currentCode, language }),
    [sendMutation],
  );

  const endSession = useCallback(() => endMutation.mutate(), [endMutation]);

  return {
    sessionId,
    messages: messagesQuery.data ?? [],
    isLoadingMessages: messagesQuery.isLoading,
    startSession,
    isStarting: startMutation.isPending,
    sendMessage,
    isSending: sendMutation.isPending,
    lastAiMessage: sendMutation.data ?? null,
    endSession,
    isEnding: endMutation.isPending,
    isActive: !!sessionId,
  };
}
