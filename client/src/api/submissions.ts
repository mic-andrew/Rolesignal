import client from "./client";
import type { Submission, SubmissionDetail, TestResult } from "../types";

export const submissionsApi = {
  run: (slug: string, payload: { language: string; sourceCode: string }) =>
    client.post<TestResult[]>(`/api/problems/${slug}/run`, {
      language: payload.language,
      source_code: payload.sourceCode,
    }),

  submit: (slug: string, payload: { language: string; sourceCode: string }) =>
    client.post<Submission>(`/api/problems/${slug}/submit`, {
      language: payload.language,
      source_code: payload.sourceCode,
    }),

  list: (params: { problemId?: string; page?: number; perPage?: number } = {}) =>
    client.get<{ data: Submission[]; count: number }>("/api/submissions", {
      params: {
        problem_id: params.problemId,
        page: params.page ?? 1,
        per_page: params.perPage ?? 20,
      },
    }),

  get: (id: string) =>
    client.get<SubmissionDetail>(`/api/submissions/${id}`),
};
