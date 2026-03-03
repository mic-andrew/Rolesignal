import client from "./client";
import type { TutoringSession, TutoringMessage } from "../types";

export const tutoringApi = {
  startSession: (payload: { problemId: string; voiceEnabled?: boolean }) =>
    client.post<TutoringSession>("/api/tutoring/sessions", {
      problem_id: payload.problemId,
      voice_enabled: payload.voiceEnabled ?? false,
    }),

  sendMessage: (
    sessionId: string,
    payload: { content: string; currentCode: string; language: string },
  ) =>
    client.post<TutoringMessage>(`/api/tutoring/sessions/${sessionId}/message`, {
      content: payload.content,
      current_code: payload.currentCode,
      language: payload.language,
    }),

  getMessages: (sessionId: string) =>
    client.get<TutoringMessage[]>(`/api/tutoring/sessions/${sessionId}/messages`),

  getRealtimeSession: (sessionId: string) =>
    client.post<{
      clientSecret: string;
      model: string;
      voice: string;
      systemPrompt: string;
    }>(`/api/tutoring/sessions/${sessionId}/realtime-session`),

  endSession: (sessionId: string) =>
    client.post(`/api/tutoring/sessions/${sessionId}/end`),
};
