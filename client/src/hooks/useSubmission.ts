import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submissionsApi } from "../api/submissions";
import { useUIStore } from "../stores/uiStore";
import type { Language } from "../types";

export function useSubmission(problemSlug: string) {
  const queryClient = useQueryClient();
  const showToast = useUIStore((s) => s.showToast);

  const runMutation = useMutation({
    mutationFn: (payload: { language: Language; sourceCode: string }) =>
      submissionsApi.run(problemSlug, payload).then((r) => r.data),
  });

  const submitMutation = useMutation({
    mutationFn: (payload: { language: Language; sourceCode: string }) =>
      submissionsApi.submit(problemSlug, payload).then((r) => r.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      queryClient.invalidateQueries({ queryKey: ["problem", problemSlug] });
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      if (data.status === "accepted") {
        showToast("Solution accepted!", "success");
      } else {
        showToast(`Submission: ${data.status.replace(/_/g, " ")}`, "warning");
      }
    },
  });

  return {
    runCode: runMutation.mutate,
    isRunning: runMutation.isPending,
    runResults: runMutation.data ?? null,
    runError: runMutation.error,
    submitCode: submitMutation.mutate,
    isSubmitting: submitMutation.isPending,
    submissionResult: submitMutation.data ?? null,
    submitError: submitMutation.error,
  };
}
