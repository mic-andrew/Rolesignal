import client from "./client";
import type { Candidate } from "../types";

export interface CandidateCreatePayload {
  name: string;
  email: string;
  role_id: string;
  color?: string;
}

export const candidatesApi = {
  list: (roleId?: string) =>
    client
      .get<{ data: Candidate[]; count: number }>("/api/candidates", {
        params: roleId ? { role_id: roleId } : undefined,
      })
      .then((r) => r.data.data),
  get: (id: string) =>
    client.get<Candidate>(`/api/candidates/${id}`).then((r) => r.data),
  create: (payload: CandidateCreatePayload) =>
    client.post<Candidate>("/api/candidates", payload).then((r) => r.data),
  update: (id: string, payload: Partial<Candidate>) =>
    client.put<Candidate>(`/api/candidates/${id}`, payload).then((r) => r.data),
  delete: (id: string) => client.delete(`/api/candidates/${id}`),
};
