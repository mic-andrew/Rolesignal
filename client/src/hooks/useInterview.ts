import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { interviewPublicApi, type InterviewPublicData } from "../api/interview";
import type { InterviewStage, TranscriptMessage } from "../types";

const STAGES: InterviewStage[] = ["Intro", "Technical", "Behavioral", "Situational", "Closing"];

const QUESTIONS: Record<InterviewStage, string[]> = {
  Intro:        ["Tell me about yourself and what draws you to this role."],
  Technical:    ["Walk me through a design system you've built from scratch.", "How do you handle versioning across 12+ teams?", "What's your approach to token synchronization from Figma?", "Describe a complex performance optimization you've led."],
  Behavioral:   ["Tell me about a time you resolved a conflict in your team.", "Describe a project that didn't go as planned. What did you learn?", "How do you mentor junior engineers?"],
  Situational:  ["If the design system you own breaks in production, what do you do first?", "You discover a critical a11y gap 48 hours before launch. Walk me through your response."],
  Closing:      ["What questions do you have for us?"],
};

export function useInterview() {
  const { token } = useParams<{ token: string }>();
  const [stageIndex, setStageIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

  const interviewQuery = useQuery<InterviewPublicData>({
    queryKey: ["interview-public", token],
    queryFn: () => interviewPublicApi.getInterview(token!),
    enabled: !!token,
    staleTime: 60_000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (text: string) => interviewPublicApi.sendMessage(token!, text),
    onSuccess: (response) => {
      setTranscript((t) => [
        ...t,
        {
          id: `ai-${Date.now()}`,
          speaker: "ai" as const,
          text: response.text,
          timestamp: new Date().toISOString(),
        },
      ]);
    },
  });

  const currentStage = STAGES[stageIndex];
  const stageQuestions = QUESTIONS[currentStage];
  const currentQuestion = stageQuestions[questionIndex] ?? stageQuestions[0];

  const advanceQuestion = useCallback(() => {
    if (questionIndex < stageQuestions.length - 1) {
      setQuestionIndex((q) => q + 1);
    } else if (stageIndex < STAGES.length - 1) {
      setStageIndex((s) => s + 1);
      setQuestionIndex(0);
    }
  }, [questionIndex, stageQuestions.length, stageIndex]);

  const sendMessage = useCallback(
    (text: string) => {
      setTranscript((t) => [
        ...t,
        {
          id: `cand-${Date.now()}`,
          speaker: "candidate" as const,
          text,
          timestamp: new Date().toISOString(),
        },
      ]);
      sendMessageMutation.mutate(text);
    },
    [sendMessageMutation],
  );

  return {
    token: token ?? "",
    interview: interviewQuery.data ?? null,
    isLoading: interviewQuery.isLoading,
    stages: STAGES,
    stageIndex,
    currentStage,
    currentQuestion,
    questionIndex,
    stageQuestions,
    transcript,
    advanceQuestion,
    sendMessage,
    isSending: sendMessageMutation.isPending,
  };
}
