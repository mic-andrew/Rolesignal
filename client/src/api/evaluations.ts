import client from "./client";
import type { CandidateEvaluation } from "../types";

export interface RankingCandidate {
  id: string;
  name: string;
  initials: string;
  score: number;
  status: string;
  color: string;
  roleId: string;
}

export const evaluationsApi = {
  get: (candidateId: string) =>
    client
      .get<CandidateEvaluation>(`/api/evaluations/${candidateId}`)
      .then((r) => r.data),
  rankings: (roleId: string) =>
    client
      .get<RankingCandidate[]>("/api/evaluations/rankings", {
        params: { role_id: roleId },
      })
      .then((r) => r.data),
};
