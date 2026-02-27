import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { candidatesApi } from "../api/candidates";
import { rolesApi } from "../api/roles";
import { useUIStore } from "../stores/uiStore";

export function useAddCandidate(defaultRoleId?: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const showToast = useUIStore((s) => s.showToast);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState(defaultRoleId ?? "");

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesApi.list(),
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: () => candidatesApi.create({ name, email, role_id: roleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      showToast("Candidate added successfully", "success");
      onSuccess?.();
    },
    onError: () => showToast("Failed to add candidate", "error"),
  });

  const canSubmit = !!(name.trim() && email.trim() && roleId);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (canSubmit) createMutation.mutate();
    },
    [canSubmit, createMutation],
  );

  const resetForm = useCallback(() => {
    setName("");
    setEmail("");
    setRoleId(defaultRoleId ?? "");
  }, [defaultRoleId]);

  return {
    name,
    setName,
    email,
    setEmail,
    roleId,
    setRoleId,
    roles: rolesQuery.data ?? [],
    rolesLoading: rolesQuery.isLoading,
    canSubmit,
    isPending: createMutation.isPending,
    handleSubmit,
    resetForm,
  };
}
