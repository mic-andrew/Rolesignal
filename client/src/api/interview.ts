import axios from "axios";

/** Public API client — no auth token. Used for candidate-facing interview. */
const publicClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

export interface InterviewPublicData {
  interviewId: string;
  roleTitle: string;
  roleDepartment: string;
  candidateName: string;
  configDuration: number;
  configTone: string;
  status: string;
  orgName: string;
  orgLogoUrl: string | null;
  orgBrandColor: string;
}

export interface TranscriptMessage {
  id: string;
  speaker: string;
  text: string;
  timestamp: string;
}

export interface RealtimeSession {
  clientSecret: string;
  model: string;
  voice: string;
  systemPrompt: string;
}

export interface TranscriptBatchMessage {
  speaker: string;
  text: string;
  sort_order: number;
}

export const interviewPublicApi = {
  getInterview: (token: string) =>
    publicClient
      .get<InterviewPublicData>(`/api/i/${token}`)
      .then((r) => r.data),
  startInterview: (token: string) =>
    publicClient
      .post<InterviewPublicData>(`/api/i/${token}/start`)
      .then((r) => r.data),
  sendMessage: (token: string, text: string) =>
    publicClient
      .post<TranscriptMessage>(`/api/i/${token}/message`, { text })
      .then((r) => r.data),
  completeInterview: (token: string) =>
    publicClient.post(`/api/i/${token}/complete`),
  getRealtimeSession: (token: string) =>
    publicClient
      .post<RealtimeSession>(`/api/i/${token}/realtime-session`)
      .then((r) => r.data),
  saveTranscript: (token: string, messages: TranscriptBatchMessage[]) =>
    publicClient
      .post(`/api/i/${token}/transcript`, { messages }),
};
