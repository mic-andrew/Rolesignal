import client from "./client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  org_name: string;
}

export interface GoogleLoginPayload {
  credential: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  initials: string;
  role: string;
  organizationId: string;
  onboardingCompleted: boolean;
  avatarUrl: string | null;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    client.post<AuthResponse>("/api/auth/login", payload),
  register: (payload: RegisterPayload) =>
    client.post<AuthResponse>("/api/auth/register", payload),
  googleLogin: (payload: GoogleLoginPayload) =>
    client.post<AuthResponse>("/api/auth/google", payload),
  me: () => client.get<UserResponse>("/api/auth/me"),
};
