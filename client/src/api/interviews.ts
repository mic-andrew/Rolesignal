import client from "./client";

export interface InterviewResponse {
  id: string;
  candidateId: string;
  roleId: string;
  token: string;
  status: string;
  durationSeconds: number | null;
  configDuration: number;
  configTone: string;
  configAdaptive: boolean;
  startedAt: string | null;
  completedAt: string | null;
  candidateName: string;
  roleTitle: string;
  link: string;
}

export interface InterviewCreatePayload {
  candidate_id: string;
  role_id: string;
  config_duration?: number;
  config_tone?: string;
  config_adaptive?: boolean;
}

export const interviewsApi = {
  list: (roleId?: string, status?: string) =>
    client
      .get<{ data: InterviewResponse[]; count: number }>("/api/interviews", {
        params: { role_id: roleId, status },
      })
      .then((r) => r.data.data),
  get: (id: string) =>
    client.get<InterviewResponse>(`/api/interviews/${id}`).then((r) => r.data),
  create: (payload: InterviewCreatePayload) =>
    client
      .post<InterviewResponse>("/api/interviews", payload)
      .then((r) => r.data),
  complete: (id: string) => client.post(`/api/interviews/${id}/complete`),
  live: () =>
    client
      .get<{ count: number }>("/api/interviews/live")
      .then((r) => r.data.count),
};
