import client from "./client";
import type { ProblemDetail, Problem } from "../types";

interface ProblemListParams {
  topic?: string;
  difficulty?: string;
  search?: string;
  status?: string;
  page?: number;
  perPage?: number;
}

export const problemsApi = {
  list: (params: ProblemListParams = {}) =>
    client.get<{ data: Problem[]; count: number }>("/api/problems", {
      params: {
        topic: params.topic,
        difficulty: params.difficulty,
        search: params.search,
        status: params.status,
        page: params.page ?? 1,
        per_page: params.perPage ?? 20,
      },
    }),

  get: (slug: string) =>
    client.get<ProblemDetail>(`/api/problems/${slug}`),
};
