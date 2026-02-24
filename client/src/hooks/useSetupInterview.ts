import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesApi } from "../api/roles";
import { useUIStore } from "../stores/uiStore";
import type { Criterion, InterviewConfig, RoleSeniority } from "../types";

const STEP_COUNT = 6;

const DEFAULT_CRITERIA: Criterion[] = [
  { id: "c1", name: "System Design",            description: "Ability to design scalable distributed systems",            weight: 25, questionCount: 3, color: "#7C6FFF" },
  { id: "c2", name: "React & TypeScript",       description: "Proficiency with React patterns and TypeScript type system", weight: 25, questionCount: 4, color: "#7C6FFF" },
  { id: "c3", name: "Performance Optimization", description: "Knowledge of Core Web Vitals and bundle optimization",      weight: 20, questionCount: 3, color: "#7C6FFF" },
  { id: "c4", name: "Team Collaboration",       description: "Cross-team communication and collaboration skills",         weight: 15, questionCount: 2, color: "#7C6FFF" },
  { id: "c5", name: "Problem Solving",          description: "Structured thinking and decomposition of complex problems", weight: 15, questionCount: 3, color: "#7C6FFF" },
];

const DEFAULT_CONFIG: InterviewConfig = {
  duration: 30,
  tone: "Conversational",
  adaptiveDifficulty: true,
};

export function useSetupInterview() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showToast = useUIStore((s) => s.showToast);
  const [step, setStep]                           = useState(0);
  const [roleTitle, setRoleTitle]                 = useState("");
  const [department, setDepartment]               = useState("Engineering");
  const [seniority, setSeniority]                 = useState<RoleSeniority>("Senior");
  const [location, setLocation]                   = useState("Remote");
  const [jobDescription, setJobDescription]       = useState("");
  const [criteria, setCriteria]                   = useState<Criterion[]>(DEFAULT_CRITERIA);
  const [config, setConfig]                       = useState<InterviewConfig>(DEFAULT_CONFIG);
  const [emails, setEmails]                       = useState<string[]>([]);
  const [criteriaInputText, setCriteriaInputText] = useState("");
  const [isParsing, setIsParsing]                 = useState(false);

  const nextStep = useCallback(() => setStep((s) => Math.min(s + 1, STEP_COUNT - 1)), []);
  const prevStep = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);
  const goToStep = useCallback((i: number) => setStep(i), []);

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
        },
      ];
    });
  }, []);

  const removeCriterion = useCallback((id: string) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const parseCriteria = useCallback(() => {
    setIsParsing(true);
    setTimeout(() => {
      setCriteria(DEFAULT_CRITERIA);
      setIsParsing(false);
    }, 1500);
  }, []);

  const removeEmail = useCallback((email: string) => {
    setEmails((prev) => prev.filter((e) => e !== email));
  }, []);

  const addEmail = useCallback((email: string) => {
    if (email && !emails.includes(email)) setEmails((prev) => [...prev, email]);
  }, [emails]);

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  const createRoleMutation = useMutation({
    mutationFn: () =>
      rolesApi.create({
        title: roleTitle,
        department,
        seniority,
        location,
        description: jobDescription,
        criteria: criteria.map((c) => ({
          name: c.name,
          description: c.description,
          weight: c.weight,
          question_count: c.questionCount,
          color: c.color,
        })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      showToast("Role created successfully", "success");
      navigate("/interviews");
    },
    onError: () => showToast("Failed to create role", "error"),
  });

  return {
    step,
    nextStep,
    prevStep,
    goToStep,
    roleData: { roleTitle, department, seniority, location },
    setRoleTitle,
    setDepartment,
    setSeniority,
    setLocation,
    jobDescription,
    setJobDescription,
    criteria,
    updateWeight,
    totalWeight,
    updateCriterionName,
    updateCriterionDescription,
    addCriterion,
    removeCriterion,
    criteriaInputText,
    setCriteriaInputText,
    isParsing,
    parseCriteria,
    config,
    setConfig,
    emails,
    addEmail,
    removeEmail,
    submitRole: createRoleMutation.mutate,
    submitPending: createRoleMutation.isPending,
  };
}
