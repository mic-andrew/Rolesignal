import client from "./client";
import type { Role } from "../types";

export interface RoleDetail extends Role {
  criteria: Array<{
    id: string;
    name: string;
    description: string;
    weight: number;
    questionCount: number;
    color: string;
    sortOrder: number;
  }>;
}

export interface RoleCreatePayload {
  title: string;
  department: string;
  seniority: string;
  location: string;
  description?: string;
  criteria: Array<{
    name: string;
    description: string;
    weight: number;
    question_count: number;
    color: string;
  }>;
}

export const rolesApi = {
  list: () =>
    client
      .get<{ data: Role[]; count: number }>("/api/roles")
      .then((r) => r.data.data),
  get: (id: string) =>
    client.get<RoleDetail>(`/api/roles/${id}`).then((r) => r.data),
  create: (payload: RoleCreatePayload) =>
    client.post<RoleDetail>("/api/roles", payload).then((r) => r.data),
  update: (id: string, payload: Partial<Role>) =>
    client.put<Role>(`/api/roles/${id}`, payload).then((r) => r.data),
  delete: (id: string) => client.delete(`/api/roles/${id}`),
};
