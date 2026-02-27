import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onboardingApi } from "../api/onboarding";
import { useUIStore } from "../stores/uiStore";
import type { Criterion, RoleSeniority } from "../types";

const STEP_COUNT = 3;

const DEFAULT_CRITERIA: Criterion[] = [
  { id: "c1", name: "Technical Skills", description: "Core technical competency", weight: 30, questionCount: 4, color: "#7C6FFF", subCriteria: [] },
  { id: "c2", name: "Problem Solving", description: "Analytical thinking", weight: 25, questionCount: 3, color: "#7C6FFF", subCriteria: [] },
  { id: "c3", name: "Communication", description: "Clear communication skills", weight: 20, questionCount: 3, color: "#7C6FFF", subCriteria: [] },
  { id: "c4", name: "Team Collaboration", description: "Working with others", weight: 15, questionCount: 2, color: "#7C6FFF", subCriteria: [] },
  { id: "c5", name: "Culture Fit", description: "Alignment with values", weight: 10, questionCount: 2, color: "#7C6FFF", subCriteria: [] },
];

export function useOnboarding() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showToast = useUIStore((s) => s.showToast);
  const [step, setStep] = useState(0);

  // Step 0: Role
  const [roleTitle, setRoleTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [seniority, setSeniority] = useState<RoleSeniority>("Senior");
  const [location, setLocation] = useState("Remote");

  // Step 1: Criteria
  const [criteria, setCriteria] = useState<Criterion[]>(DEFAULT_CRITERIA);

  // Step 2: First Candidate
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");

  const nextStep = useCallback(() => setStep((s) => Math.min(s + 1, STEP_COUNT - 1)), []);
  const prevStep = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  // Criteria management
  const updateWeight = useCallback((id: string, weight: number) => {
    setCriteria((prev) => {
      const othersTotal = prev.reduce((sum, c) => (c.id === id ? sum : sum + c.weight), 0);
      const maxAllowed = 100 - othersTotal;
      const clamped = Math.min(weight, maxAllowed);
      return prev.map((c) => (c.id === id ? { ...c, weight: clamped } : c));
    });
  }, []);

  const updateCriterionName = useCallback((id: string, name: string) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
  }, []);

  const updateCriterionDescription = useCallback((id: string, description: string) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, description } : c)));
  }, []);

  const addCriterion = useCallback(() => {
    setCriteria((prev) => {
      const currentTotal = prev.reduce((sum, c) => sum + c.weight, 0);
      const remaining = Math.max(0, 100 - currentTotal);
      const newWeight = Math.min(10, remaining);
      return [
        ...prev,
        {
          id: `c${Date.now()}`,
          name: "New Criterion",
          description: "",
          weight: newWeight,
          questionCount: 2,
          color: "#7C6FFF",
          subCriteria: [],
        },
      ];
    });
  }, []);

  const removeCriterion = useCallback((id: string) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  const completeMutation = useMutation({
    mutationFn: () =>
      onboardingApi.createFirstRole({
        title: roleTitle,
        department,
        seniority,
        location,
        criteria: criteria.map((c) => ({
          name: c.name,
          description: c.description,
          weight: c.weight,
          question_count: c.questionCount,
        })),
        candidate: candidateName.trim() && candidateEmail.trim()
          ? { name: candidateName, email: candidateEmail }
          : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      showToast("Setup complete!", "success");
      navigate("/interviews");
    },
    onError: () => showToast("Failed to complete setup", "error"),
  });

  const submitStep = useCallback(() => {
    if (step === 0) {
      if (!roleTitle.trim()) {
        showToast("Please enter a role title", "error");
        return;
      }
      nextStep();
    } else if (step === 1) {
      if (totalWeight !== 100) {
        showToast("Criteria weights must total 100%", "error");
        return;
      }
      nextStep();
    } else if (step === 2) {
      completeMutation.mutate();
    }
  }, [step, roleTitle, totalWeight, nextStep, completeMutation, showToast]);

  const isPending = completeMutation.isPending;

  return {
    step,
    nextStep,
    prevStep,
    submitStep,
    isPending,
    // Step 0: Role
    roleTitle,
    setRoleTitle,
    department,
    setDepartment,
    seniority,
    setSeniority,
    location,
    setLocation,
    // Step 1: Criteria
    criteria,
    updateWeight,
    totalWeight,
    updateCriterionName,
    updateCriterionDescription,
    addCriterion,
    removeCriterion,
    // Step 2: First Candidate
    candidateName,
    setCandidateName,
    candidateEmail,
    setCandidateEmail,
  };
}
