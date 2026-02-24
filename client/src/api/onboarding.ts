import client from "./client";

export interface ProfilePayload {
  name: string;
  avatar_url?: string;
}

export interface TeamPayload {
  emails: string[];
}

export interface CriterionInput {
  name: string;
  description: string;
  weight: number;
  question_count: number;
}

export interface CandidateInput {
  name: string;
  email: string;
}

export interface RolePayload {
  title: string;
  department: string;
  seniority: string;
  location: string;
  criteria: CriterionInput[];
  candidate?: CandidateInput;
}

export interface OnboardingCompleteResponse {
  message: string;
  roleId: string;
  interviewLink: string | null;
}

export const onboardingApi = {
  completeProfile: (payload: ProfilePayload) =>
    client.put("/api/onboarding/profile", payload),
  inviteTeam: (payload: TeamPayload) =>
    client.post("/api/onboarding/team", payload),
  createFirstRole: (payload: RolePayload) =>
    client.post<OnboardingCompleteResponse>("/api/onboarding/role", payload),
};
