import client from "./client";
import type { CriteriaTemplate } from "../types";

export const criteriaLibraryApi = {
  list: () =>
    client
      .get<{ data: CriteriaTemplate[]; count: number }>("/api/criteria-library")
      .then((r) => r.data.data),

  get: (id: string) =>
    client
      .get<CriteriaTemplate>(`/api/criteria-library/${id}`)
      .then((r) => r.data),

  create: (payload: {
    name: string;
    description: string;
    criteria: Array<{
      name: string;
      description: string;
      weight: number;
      sub_criteria: Array<{
        name: string;
        description: string;
        weight: number;
      }>;
    }>;
  }) =>
    client
      .post<CriteriaTemplate>("/api/criteria-library", payload)
      .then((r) => r.data),

  update: (
    id: string,
    payload: {
      name?: string;
      description?: string;
      criteria?: Array<{
        name: string;
        description: string;
        weight: number;
        sub_criteria: Array<{
          name: string;
          description: string;
          weight: number;
        }>;
      }>;
    },
  ) =>
    client
      .put<CriteriaTemplate>(`/api/criteria-library/${id}`, payload)
      .then((r) => r.data),

  delete: (id: string) => client.delete(`/api/criteria-library/${id}`),

  importDocument: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return client
      .post<CriteriaTemplate>("/api/criteria-library/import-document", form, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      })
      .then((r) => r.data);
  },
};
