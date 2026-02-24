import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesApi } from "../api/roles";
import { candidatesApi } from "../api/candidates";
import { interviewsApi } from "../api/interviews";
import { useUIStore } from "../stores/uiStore";
import type { AITone } from "../types";

export function useSendInterview() {
  const queryClient = useQueryClient();
  const showToast = useUIStore((s) => s.showToast);

  const [step, setStep] = useState(0);

  // Step 0: Candidate
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [useExisting, setUseExisting] = useState(false);
  const [existingCandidateId, setExistingCandidateId] = useState("");

  // Step 1: Config
  const [duration, setDuration] = useState<number>(30);
  const [tone, setTone] = useState<AITone>("Professional");
  const [adaptive, setAdaptive] = useState(true);

  // Step 2: Result
  const [interviewLink, setInterviewLink] = useState("");

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesApi.list(),
    staleTime: 30_000,
  });

  const candidatesQuery = useQuery({
    queryKey: ["candidates", roleId],
    queryFn: () => candidatesApi.list(roleId),
    enabled: !!roleId && useExisting,
    staleTime: 15_000,
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      let candidateId = existingCandidateId;

      if (!useExisting) {
        const candidate = await candidatesApi.create({
          name: candidateName,
          email: candidateEmail,
          role_id: roleId,
        });
        candidateId = candidate.id;
      }

      const interview = await interviewsApi.create({
        candidate_id: candidateId,
        role_id: roleId,
        config_duration: duration,
        config_tone: tone,
        config_adaptive: adaptive,
      });

      return interview.link;
    },
    onSuccess: (link) => {
      setInterviewLink(link);
      setStep(2);
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      showToast("Interview created successfully", "success");
    },
    onError: () => {
      showToast("Failed to create interview", "error");
    },
  });

  const canAdvanceStep0 =
    roleId &&
    (useExisting ? !!existingCandidateId : candidateName.trim() && candidateEmail.trim());

  const nextStep = useCallback(() => {
    if (step === 0) setStep(1);
    else if (step === 1) sendMutation.mutate();
  }, [step, sendMutation]);

  const prevStep = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setStep(0);
    setCandidateName("");
    setCandidateEmail("");
    setExistingCandidateId("");
    setUseExisting(false);
    setInterviewLink("");
    setDuration(30);
    setTone("Professional");
    setAdaptive(true);
  }, []);

  return {
    step,
    nextStep,
    prevStep,
    reset,
    isPending: sendMutation.isPending,
    // Step 0
    candidateName,
    setCandidateName,
    candidateEmail,
    setCandidateEmail,
    roleId,
    setRoleId,
    useExisting,
    setUseExisting,
    existingCandidateId,
    setExistingCandidateId,
    roles: rolesQuery.data ?? [],
    existingCandidates: candidatesQuery.data ?? [],
    canAdvanceStep0,
    // Step 1
    duration,
    setDuration,
    tone,
    setTone,
    adaptive,
    setAdaptive,
    // Step 2
    interviewLink,
  };
}
