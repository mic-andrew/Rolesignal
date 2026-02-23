import { useState, useCallback } from "react";
import type { Criterion, InterviewConfig, RoleSeniority } from "../types";

const STEP_COUNT = 6;

const CRITERION_COLORS = [
  "var(--color-brand)", "var(--color-brand2)", "var(--color-success)",
  "var(--color-warn)", "#EC4899", "#06B6D4", "#F97316", "#A855F7",
];

const DEFAULT_CRITERIA: Criterion[] = [
  { id: "c1", name: "System Design",            description: "Ability to design scalable distributed systems",            weight: 25, questionCount: 3, color: "var(--color-brand)"   },
  { id: "c2", name: "React & TypeScript",       description: "Proficiency with React patterns and TypeScript type system", weight: 25, questionCount: 4, color: "var(--color-brand2)"  },
  { id: "c3", name: "Performance Optimization", description: "Knowledge of Core Web Vitals and bundle optimization",      weight: 20, questionCount: 3, color: "var(--color-success)" },
  { id: "c4", name: "Team Collaboration",       description: "Cross-team communication and collaboration skills",         weight: 15, questionCount: 2, color: "var(--color-warn)"    },
  { id: "c5", name: "Problem Solving",          description: "Structured thinking and decomposition of complex problems", weight: 15, questionCount: 3, color: "#EC4899"              },
];

const DEFAULT_CONFIG: InterviewConfig = {
  duration: 30,
  tone: "Conversational",
  adaptiveDifficulty: true,
};

export function useSetupInterview() {
  const [step, setStep]                           = useState(0);
  const [roleTitle, setRoleTitle]                 = useState("Senior Frontend Engineer");
  const [department, setDepartment]               = useState("Engineering");
  const [seniority, setSeniority]                 = useState<RoleSeniority>("Senior");
  const [location, setLocation]                   = useState("Remote");
  const [jobDescription, setJobDescription]       = useState("");
  const [criteria, setCriteria]                   = useState<Criterion[]>(DEFAULT_CRITERIA);
  const [config, setConfig]                       = useState<InterviewConfig>(DEFAULT_CONFIG);
  const [emails, setEmails]                       = useState<string[]>(["sarah.chen@email.com", "marcus.j@email.com", "priya.p@email.com"]);
  const [criteriaInputText, setCriteriaInputText] = useState("");
  const [isParsing, setIsParsing]                 = useState(false);

  const nextStep = useCallback(() => setStep((s) => Math.min(s + 1, STEP_COUNT - 1)), []);
  const prevStep = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);
  const goToStep = useCallback((i: number) => setStep(i), []);

  const updateWeight = useCallback((id: string, weight: number) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, weight } : c)));
  }, []);

  const updateCriterionName = useCallback((id: string, name: string) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
  }, []);

  const updateCriterionDescription = useCallback((id: string, description: string) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, description } : c)));
  }, []);

  const addCriterion = useCallback(() => {
    setCriteria((prev) => [
      ...prev,
      {
        id: `c${Date.now()}`,
        name: "New Criterion",
        description: "",
        weight: 10,
        questionCount: 2,
        color: CRITERION_COLORS[prev.length % CRITERION_COLORS.length],
      },
    ]);
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
  };
}
