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

export interface LaunchPayload {
  title: string;
  department: string;
  seniority: string;
  description?: string;
  criteria: Array<{
    name: string;
    description: string;
    weight: number;
    question_count: number;
    color: string;
    sub_criteria: Array<{
      name: string;
      description: string;
      weight: number;
    }>;
  }>;
  candidates: Array<{ name: string; email: string }>;
  config_duration: number;
  config_tone: string;
  config_adaptive: boolean;
}

export interface LaunchInterviewItem {
  id: string;
  candidateName: string;
  candidateEmail: string;
  link: string;
  emailSent: boolean;
}

export interface LaunchResponse {
  roleId: string;
  interviews: LaunchInterviewItem[];
  message: string;
}

export interface AddCandidatePayload {
  name: string;
  email: string;
  config_duration?: number;
  config_tone?: string;
  config_adaptive?: boolean;
}

export interface InterviewUpdatePayload {
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
  launch: (payload: LaunchPayload) =>
    client
      .post<LaunchResponse>("/api/interviews/launch", payload)
      .then((r) => r.data),
  complete: (id: string) => client.post(`/api/interviews/${id}/complete`),
  delete: (id: string) => client.delete(`/api/interviews/${id}`),
  update: (id: string, payload: InterviewUpdatePayload) =>
    client
      .patch<InterviewResponse>(`/api/interviews/${id}`, payload)
      .then((r) => r.data),
  addCandidate: (roleId: string, payload: AddCandidatePayload) =>
    client
      .post<InterviewResponse>(`/api/interviews/roles/${roleId}/candidates`, payload)
      .then((r) => r.data),
  live: () =>
    client
      .get<{ count: number }>("/api/interviews/live")
      .then((r) => r.data.count),
};
