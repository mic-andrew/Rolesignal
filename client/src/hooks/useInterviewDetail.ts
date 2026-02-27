import { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { interviewsApi } from "../api/interviews";
import type { InterviewResponse } from "../api/interviews";
import { rolesApi } from "../api/roles";
import type { RoleDetail } from "../api/roles";
import { useUIStore } from "../stores/uiStore";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useInterviewDetail() {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showToast = useUIStore((s) => s.showToast);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const roleQuery = useQuery<RoleDetail>({
    queryKey: ["role-detail", roleId],
    queryFn: () => rolesApi.get(roleId!),
    enabled: !!roleId,
    staleTime: 15_000,
  });

  const interviewsQuery = useQuery<InterviewResponse[]>({
    queryKey: ["interviews", roleId],
    queryFn: () => interviewsApi.list(roleId!),
    enabled: !!roleId,
    staleTime: 15_000,
  });

  const role = roleQuery.data ?? null;
  const interviews = useMemo(
    () => interviewsQuery.data ?? [],
    [interviewsQuery.data],
  );

  const stats = useMemo(() => {
    const all = interviews;
    return {
      total: all.length,
      pending: all.filter((i) => i.status === "pending").length,
      inProgress: all.filter((i) => i.status === "in_progress").length,
      completed: all.filter((i) => i.status === "completed").length,
    };
  }, [interviews]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => interviewsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      showToast("Interview deleted", "success");
    },
    onError: () => showToast("Failed to delete interview", "error"),
  });

  const addCandidateMutation = useMutation({
    mutationFn: (data: { name: string; email: string }) =>
      interviewsApi.addCandidate(roleId!, {
        name: data.name,
        email: data.email,
        config_duration: interviews[0]?.configDuration ?? 30,
        config_tone: interviews[0]?.configTone ?? "Conversational",
        config_adaptive: interviews[0]?.configAdaptive ?? true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setNewName("");
      setNewEmail("");
      setIsAddModalOpen(false);
      showToast("Candidate added successfully", "success");
    },
    onError: (err: unknown) => {
      const detail =
        err != null &&
        typeof err === "object" &&
        "response" in err
          ? (err as { response?: { data?: { detail?: string } } }).response
              ?.data?.detail
          : undefined;
      showToast(detail || "Failed to add candidate", "error");
    },
  });

  const isEmailValid = EMAIL_RE.test(newEmail.trim());

  const addCandidate = useCallback(() => {
    const name = newName.trim();
    const email = newEmail.trim();
    if (!name) {
      showToast("Please enter a candidate name", "warning");
      return;
    }
    if (!email) {
      showToast("Please enter an email address", "warning");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      showToast("Please enter a valid email address", "warning");
      return;
    }
    addCandidateMutation.mutate({ name, email });
  }, [newName, newEmail, addCandidateMutation, showToast]);

  const openAddModal = useCallback(() => setIsAddModalOpen(true), []);
  const closeAddModal = useCallback(() => {
    setIsAddModalOpen(false);
    setNewName("");
    setNewEmail("");
  }, []);

  const deleteInterview = useCallback(
    (id: string) => deleteMutation.mutate(id),
    [deleteMutation],
  );

  const goBack = useCallback(() => navigate("/interviews"), [navigate]);

  return {
    roleId: roleId ?? "",
    role,
    interviews,
    stats,
    isLoading: roleQuery.isLoading || interviewsQuery.isLoading,
    newName,
    setNewName,
    newEmail,
    setNewEmail,
    isEmailValid,
    addCandidate,
    isAddingCandidate: addCandidateMutation.isPending,
    isAddModalOpen,
    openAddModal,
    closeAddModal,
    deleteInterview,
    goBack,
  };
}
