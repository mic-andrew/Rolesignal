import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PHASES = [
  "Analyzing Transcript",
  "Mapping Criteria",
  "Computing Scores",
  "Assessing Risks",
  "Generating Report",
];

const PHASE_DURATION_MS = 1400;

export function useProcessing() {
  const [phase, setPhase]   = useState(0);
  const navigate            = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((p) => {
        if (p >= PHASES.length - 1) {
          clearInterval(timer);
          setTimeout(() => navigate("/evaluation"), 900);
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
