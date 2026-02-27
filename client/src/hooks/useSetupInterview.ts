import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { interviewsApi } from "../api/interviews";
import { rolesApi } from "../api/roles";
import { criteriaLibraryApi } from "../api/criteriaLibrary";
import { useUIStore } from "../stores/uiStore";
import type { Criterion, CriteriaTemplate, InterviewConfig, RoleSeniority } from "../types";

const STEP_COUNT = 5;

const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt"];

const DEFAULT_CONFIG: InterviewConfig = {
  duration: 30,
  tone: "Conversational",
  adaptiveDifficulty: true,
};

export interface CandidateEntry {
  name: string;
  email: string;
}

export function useSetupInterview() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showToast = useUIStore((s) => s.showToast);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const criteriaFileRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState(0);
  const [roleTitle, setRoleTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [seniority, setSeniority] = useState<RoleSeniority>("Senior");
  const [jobDescription, setJobDescription] = useState("");
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [config, setConfig] = useState<InterviewConfig>(DEFAULT_CONFIG);
  const [candidates, setCandidates] = useState<CandidateEntry[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  // --- Templates from library ---
  const templatesQuery = useQuery({
    queryKey: ["criteria-library"],
    queryFn: () => criteriaLibraryApi.list(),
    staleTime: 30_000,
  });

  // --- Step validation ---
  const validateStep = useCallback(
    (s: number): string | null => {
      if (s === 0 && !roleTitle.trim()) return "Enter a role title";
      if (s === 1 && !jobDescription.trim())
        return "Add a job description before continuing";
      if (s === 2 && criteria.length === 0)
        return "Add at least one evaluation criterion";
      return null;
    },
    [roleTitle, jobDescription, criteria],
  );

  // --- Step navigation ---
  const nextStep = useCallback(() => {
    const err = validateStep(step);
    if (err) {
      showToast(err, "warning");
      return;
    }
    setStep((s) => Math.min(s + 1, STEP_COUNT - 1));
  }, [step, validateStep, showToast]);

  const prevStep = useCallback(
    () => setStep((s) => Math.max(s - 1, 0)),
    [],
  );

  const goToStep = useCallback(
    (target: number) => {
      // Only allow jumping forward if all previous steps pass
      for (let s = step; s < target; s++) {
        const err = validateStep(s);
        if (err) {
          showToast(err, "warning");
          return;
        }
      }
      setStep(target);
    },
    [step, validateStep, showToast],
  );

  // --- File upload for JD ---
  const handleJdUpload = useCallback(
    async (file: File) => {
      const name = file.name.toLowerCase();
      if (!ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext))) {
        showToast(
          "Unsupported file type. Use PDF, DOCX, or TXT.",
          "error",
        );
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast("File exceeds 5 MB limit", "error");
        return;
      }
      setIsUploading(true);
      try {
        const text = await rolesApi.uploadJd(file);
        setJobDescription(text);
        showToast("File text extracted", "success");
      } catch {
        showToast("Failed to extract text from file", "error");
      } finally {
        setIsUploading(false);
      }
    },
    [showToast],
  );

  // --- Criteria extraction ---
  const extractCriteria = useCallback(async () => {
    const text = jobDescription.trim();
    if (!text) {
      showToast("Add a job description first", "warning");
      return;
    }
    setIsParsing(true);
    try {
      const parsed = await rolesApi.extractCriteria(text);
      setCriteria(
        parsed.map((c, i) => ({
          id: `c${Date.now()}-${i}`,
          name: c.name,
          description: c.description,
          weight: c.weight,
          questionCount: c.questionCount,
          color: c.color,
          subCriteria: (c.subCriteria ?? []).map((sc, j) => ({
            id: `sc${Date.now()}-${i}-${j}`,
            name: sc.name,
            description: sc.description,
            weight: sc.weight,
          })),
        })),
      );
      showToast(`Extracted ${parsed.length} criteria`, "success");

      // Auto-save to library for reuse
      if (roleTitle.trim()) {
        try {
          await criteriaLibraryApi.create({
            name: `${roleTitle.trim()} Criteria`,
            description: `Auto-generated from job description`,
            criteria: parsed.map((c) => ({
              name: c.name,
              description: c.description,
              weight: c.weight,
              sub_criteria: (c.subCriteria ?? []).map((sc) => ({
                name: sc.name,
                description: sc.description,
                weight: sc.weight,
              })),
            })),
          });
          queryClient.invalidateQueries({ queryKey: ["criteria-library"] });
        } catch {
          // Non-critical — don't block the flow
        }
      }
    } catch (err: unknown) {
      const detail =
        err != null &&
        typeof err === "object" &&
        "response" in err
          ? (err as { response?: { data?: { detail?: string } } }).response
              ?.data?.detail
          : undefined;
      showToast(detail || "Failed to extract criteria", "error");
    } finally {
      setIsParsing(false);
    }
  }, [jobDescription, showToast]);

  // --- Criteria CRUD ---
  const updateWeight = useCallback((id: string, weight: number) => {
    setCriteria((prev) => {
      const othersTotal = prev.reduce(
        (sum, c) => (c.id === id ? sum : sum + c.weight),
        0,
      );
      const clamped = Math.min(weight, 100 - othersTotal);
      return prev.map((c) =>
        c.id === id ? { ...c, weight: clamped } : c,
      );
    });
  }, []);

  const updateCriterionName = useCallback(
    (id: string, name: string) => {
      setCriteria((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name } : c)),
      );
    },
    [],
  );

  const updateCriterionDescription = useCallback(
    (id: string, description: string) => {
      setCriteria((prev) =>
        prev.map((c) => (c.id === id ? { ...c, description } : c)),
      );
    },
    [],
  );

  const addCriterion = useCallback(() => {
    setCriteria((prev) => {
      const currentTotal = prev.reduce((s, c) => s + c.weight, 0);
      const remaining = Math.max(0, 100 - currentTotal);
      return [
        ...prev,
        {
          id: `c${Date.now()}`,
          name: "New Criterion",
          description: "",
          weight: Math.min(10, remaining),
          questionCount: 3,
          color: "#7C6FFF",
          subCriteria: [],
        },
      ];
    });
  }, []);

  const removeCriterion = useCallback((id: string) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // --- Sub-criteria CRUD ---
  const addSubCriterion = useCallback(
    (criterionId: string) => {
      setCriteria((prev) =>
        prev.map((c) => {
          if (c.id !== criterionId) return c;
          const currentTotal = c.subCriteria.reduce((s, sc) => s + sc.weight, 0);
          const remaining = Math.max(0, 100 - currentTotal);
          return {
            ...c,
            subCriteria: [
              ...c.subCriteria,
              {
                id: `sc${Date.now()}`,
                name: "New Sub-criterion",
                description: "",
                weight: Math.min(20, remaining),
              },
            ],
          };
        }),
      );
    },
    [],
  );

  const updateSubCriterion = useCallback(
    (criterionId: string, subId: string, updates: Partial<{ name: string; description: string; weight: number }>) => {
      setCriteria((prev) =>
        prev.map((c) => {
          if (c.id !== criterionId) return c;
          return {
            ...c,
            subCriteria: c.subCriteria.map((sc) =>
              sc.id === subId ? { ...sc, ...updates } : sc,
            ),
          };
        }),
      );
    },
    [],
  );

  const removeSubCriterion = useCallback(
    (criterionId: string, subId: string) => {
      setCriteria((prev) =>
        prev.map((c) => {
          if (c.id !== criterionId) return c;
          return {
            ...c,
            subCriteria: c.subCriteria.filter((sc) => sc.id !== subId),
          };
        }),
      );
    },
    [],
  );

  // --- Import from template ---
  const importFromTemplate = useCallback(
    (template: { criteria: Array<{ name: string; description: string; weight: number; subCriteria: Array<{ name: string; description: string; weight: number }> }> }) => {
      setCriteria(
        template.criteria.map((c, i) => ({
          id: `c${Date.now()}-${i}`,
          name: c.name,
          description: c.description,
          weight: c.weight,
          questionCount: 3,
          color: "#7C6FFF",
          subCriteria: (c.subCriteria ?? []).map((sc, j) => ({
            id: `sc${Date.now()}-${i}-${j}`,
            name: sc.name,
            description: sc.description,
            weight: sc.weight,
          })),
        })),
      );
      showToast("Criteria imported from template", "success");
    },
    [showToast],
  );

  const totalWeight = criteria.reduce((s, c) => s + c.weight, 0);

  // --- Candidates ---
  const addCandidate = useCallback(
    (name: string, email: string) => {
      const trimName = name.trim();
      const trimEmail = email.trim().toLowerCase();
      if (!trimName || !trimEmail) return;
      if (candidates.some((c) => c.email === trimEmail)) {
        showToast("Candidate already added", "warning");
        return;
      }
      setCandidates((prev) => [
        ...prev,
        { name: trimName, email: trimEmail },
      ]);
    },
    [candidates, showToast],
  );

  const removeCandidate = useCallback((email: string) => {
    setCandidates((prev) => prev.filter((c) => c.email !== email));
  }, []);

  // --- Launch mutation ---
  const launchMutation = useMutation({
    mutationFn: () =>
      interviewsApi.launch({
        title: roleTitle,
        department,
        seniority,
        description: jobDescription || undefined,
        criteria: criteria.map((c) => ({
          name: c.name,
          description: c.description,
          weight: c.weight,
          question_count: c.questionCount,
          color: c.color,
          sub_criteria: c.subCriteria.map((sc) => ({
            name: sc.name,
            description: sc.description,
            weight: sc.weight,
          })),
        })),
        candidates,
        config_duration: config.duration,
        config_tone: config.tone,
        config_adaptive: config.adaptiveDifficulty,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      showToast(data.message, "success");
      navigate("/interviews");
    },
    onError: () => showToast("Failed to launch interviews", "error"),
  });

  return {
    step,
    nextStep,
    prevStep,
    goToStep,
    roleData: { roleTitle, department, seniority },
    setRoleTitle,
    setDepartment,
    setSeniority,
    jobDescription,
    setJobDescription,
    handleJdUpload,
    isUploading,
    fileInputRef,
    criteriaFileRef,
    criteria,
    updateWeight,
    totalWeight,
    updateCriterionName,
    updateCriterionDescription,
    addCriterion,
    removeCriterion,
    addSubCriterion,
    updateSubCriterion,
    removeSubCriterion,
    importFromTemplate,
    templates: templatesQuery.data ?? [],
    isLoadingTemplates: templatesQuery.isLoading,
    isParsing,
    extractCriteria,
    config,
    setConfig,
    candidates,
    addCandidate,
    removeCandidate,
    launch: launchMutation.mutate,
    launchPending: launchMutation.isPending,
  };
}
