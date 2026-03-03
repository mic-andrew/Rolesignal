import client from "./client";
import type { UserProgress, Submission } from "../types";

export const progressApi = {
  me: () => client.get<UserProgress>("/api/progress/me"),

  submissions: (params: { page?: number; perPage?: number } = {}) =>
    client.get<{ data: Submission[]; count: number }>("/api/progress/me/submissions", {
      params: {
        page: params.page ?? 1,
        per_page: params.perPage ?? 20,
      },
    }),
};
