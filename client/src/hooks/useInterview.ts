import { useState, useCallback } from "react";
import type { InterviewStage, TranscriptMessage } from "../types";
import { TRANSCRIPT } from "../api/seveum";

const STAGES: InterviewStage[] = ["Intro", "Technical", "Behavioral", "Situational", "Closing"];

const QUESTIONS: Record<InterviewStage, string[]> = {
  Intro:        ["Tell me about yourself and what draws you to this role."],
  Technical:    ["Walk me through a design system you've built from scratch.", "How do you handle versioning across 12+ teams?", "What's your approach to token synchronization from Figma?", "Describe a complex performance optimization you've led."],
  Behavioral:   ["Tell me about a time you resolved a conflict in your team.", "Describe a project that didn't go as planned. What did you learn?", "How do you mentor junior engineers?"],
  Situational:  ["If the design system you own breaks in production, what do you do first?", "You discover a critical a11y gap 48 hours before launch. Walk me through your response."],
  Closing:      ["What questions do you have for us?"],
};

export function useInterview() {
  const [stageIndex, setStageIndex]     = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [transcript, setTranscript]     = useState<TranscriptMessage[]>(TRANSCRIPT.slice(0, 2));

  const currentStage    = STAGES[stageIndex];
  const stageQuestions  = QUESTIONS[currentStage];
  const currentQuestion = stageQuestions[questionIndex] ?? stageQuestions[0];
  const visibleTranscript = transcript.slice(0, (questionIndex + 1) * 2);

  const advanceQuestion = useCallback(() => {
    if (questionIndex < stageQuestions.length - 1) {
      setQuestionIndex((q) => q + 1);
      setTranscript((t) => [...t, ...TRANSCRIPT.slice(t.length, t.length + 2)]);
    } else if (stageIndex < STAGES.length - 1) {
      setStageIndex((s) => s + 1);
      setQuestionIndex(0);
      setTranscript((t) => [...t, ...TRANSCRIPT.slice(t.length, t.length + 2)]);
    }
  }, [questionIndex, stageQuestions.length, stageIndex]);

  return {
    stages: STAGES,
    stageIndex,
    currentStage,
    currentQuestion,
    questionIndex,
    stageQuestions,
    visibleTranscript,
    advanceQuestion,
  };
}
