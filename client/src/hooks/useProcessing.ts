import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { interviewPublicApi } from "../api/interview";

const PHASES = [
  "Analyzing Transcript",
  "Mapping Criteria",
  "Computing Scores",
  "Assessing Risks",
  "Generating Report",
];

const PHASE_DURATION_MS = 1400;

export function useProcessing() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);

  const completeMutation = useMutation({
    mutationFn: () => interviewPublicApi.completeInterview(token!),
  });

  // Trigger the complete call once on mount
  useEffect(() => {
    if (token) {
      completeMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((p) => {
        if (p >= PHASES.length - 1) {
          clearInterval(timer);
          setTimeout(() => navigate("/dashboard"), 900);
          return p;
        }
        return p + 1;
      });
    }, PHASE_DURATION_MS);

    return () => clearInterval(timer);
  }, [navigate]);

  const scoreProgress = Math.min(Math.round(((phase + 1) / PHASES.length) * 100), 100);

  return { phase, phases: PHASES, scoreProgress };
}
