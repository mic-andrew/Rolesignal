import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth";
import { useUIStore } from "../stores/uiStore";
import type { UserResponse } from "../api/auth";
import type { AxiosError } from "axios";

function extractError(error: AxiosError<{ detail?: string }>): string {
  return error.response?.data?.detail || "Something went wrong. Please try again.";
}

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showToast = useUIStore((s) => s.showToast);

  const userQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.me().then((r) => r.data),
    retry: false,
    staleTime: 5 * 60_000,
    enabled: !!localStorage.getItem("rs_token"),
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      localStorage.setItem("rs_token", res.data.token);
      queryClient.setQueryData(["auth", "me"], res.data.user);
      if (!res.data.user.onboardingCompleted) {
        navigate("/onboarding");
      } else {
        navigate("/interviews");
      }
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      showToast(extractError(error), "error");
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (res) => {
      localStorage.setItem("rs_token", res.data.token);
      queryClient.setQueryData(["auth", "me"], res.data.user);
      navigate("/onboarding");
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      showToast(extractError(error), "error");
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: authApi.googleLogin,
    onSuccess: (res) => {
      localStorage.setItem("rs_token", res.data.token);
      queryClient.setQueryData(["auth", "me"], res.data.user);
      if (!res.data.user.onboardingCompleted) {
        navigate("/onboarding");
      } else {
        navigate("/interviews");
      }
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      showToast(extractError(error), "error");
    },
  });

  const logout = useCallback(() => {
    localStorage.removeItem("rs_token");
    queryClient.clear();
    navigate("/auth");
  }, [queryClient, navigate]);

  return {
    user: userQuery.data as UserResponse | undefined,
    isAuthenticated: !!localStorage.getItem("rs_token") && !!userQuery.data,
    isOnboarded: userQuery.data?.onboardingCompleted ?? false,
    isLoading: userQuery.isLoading,
    login: loginMutation.mutate,
    loginError: loginMutation.error,
    loginPending: loginMutation.isPending,
    register: registerMutation.mutate,
    registerError: registerMutation.error,
    registerPending: registerMutation.isPending,
    googleLogin: googleLoginMutation.mutate,
    logout,
  };
}
