import { useCallback, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { criteriaLibraryApi } from "../api/criteriaLibrary";
import { useUIStore } from "../stores/uiStore";
import { useConfirmModal } from "./useConfirmModal";
import type { CriteriaTemplate } from "../types";

export function useCriteriaLibrary() {
  const queryClient = useQueryClient();
  const showToast = useUIStore((s) => s.showToast);
  const modal = useConfirmModal();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["criteria-library"],
    queryFn: criteriaLibraryApi.list,
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: criteriaLibraryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["criteria-library"] });
      showToast("Criteria template created", "success");
    },
    onError: () => showToast("Failed to create template", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: {
      id: string;
      payload: Parameters<typeof criteriaLibraryApi.update>[1];
    }) => criteriaLibraryApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["criteria-library"] });
      showToast("Template updated", "success");
      setEditingId(null);
    },
    onError: () => showToast("Failed to update template", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: criteriaLibraryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["criteria-library"] });
      showToast("Template deleted", "success");
    },
    onError: () => showToast("Failed to delete template", "error"),
  });

  const importMutation = useMutation({
    mutationFn: criteriaLibraryApi.importDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["criteria-library"] });
      showToast("Criteria imported from document", "success");
    },
    onError: () =>
      showToast("Failed to import criteria from document", "error"),
  });

  const handleDelete = useCallback(
    async (template: CriteriaTemplate) => {
      const confirmed = await modal.confirm({
        title: "Delete Template",
        message: `Are you sure you want to delete "${template.name}"? This action cannot be undone.`,
        confirmLabel: "Delete",
        variant: "danger",
      });
      if (confirmed) deleteMutation.mutate(template.id);
    },
    [modal, deleteMutation],
  );

  const handleImport = useCallback(
    async (file: File) => {
      const name = file.name.toLowerCase();
      if (
        ![".pdf", ".docx", ".txt"].some((ext) => name.endsWith(ext))
      ) {
        showToast("Unsupported file type. Use PDF, DOCX, or TXT.", "error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast("File exceeds 5 MB limit", "error");
        return;
      }
      importMutation.mutate(file);
    },
    [showToast, importMutation],
  );

  return {
    templates: query.data ?? [],
    isLoading: query.isLoading,
    editingId,
    setEditingId,
    createTemplate: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateTemplate: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    handleDelete,
    handleImport,
    isImporting: importMutation.isPending,
    fileInputRef,
    modal,
  };
}
