import client from "./client";
import type { TeamMember, Integration, InterviewTemplate } from "../types";

export const settingsApi = {
  // Team
  team: () =>
    client.get<TeamMember[]>("/api/settings/team").then((r) => r.data),
  inviteMember: (email: string, role: string = "Recruiter") =>
    client
      .post<TeamMember>("/api/settings/team/invite", { email, role })
      .then((r) => r.data),
  removeMember: (id: string) => client.delete(`/api/settings/team/${id}`),

  // Templates
  templates: () =>
    client
      .get<InterviewTemplate[]>("/api/settings/templates")
      .then((r) => r.data),
  createTemplate: (payload: {
    name: string;
    role_label: string;
    duration: number;
    criteria_count: number;
  }) =>
    client
      .post<InterviewTemplate>("/api/settings/templates", payload)
      .then((r) => r.data),
  deleteTemplate: (id: string) =>
    client.delete(`/api/settings/templates/${id}`),

  // Integrations
  integrations: () =>
    client
      .get<Integration[]>("/api/settings/integrations")
      .then((r) => r.data),
  toggleIntegration: (id: string) =>
    client
      .put<Integration>(`/api/settings/integrations/${id}`)
      .then((r) => r.data),
};
