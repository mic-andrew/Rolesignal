import { useState, useEffect, useCallback } from "react";
import type { Language } from "../types";

export function useCodeEditor(
  problemSlug: string | undefined,
  starterCode: Record<string, string> = {},
) {
  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState(starterCode.python || "");

  // When language changes, load draft or starter code
  useEffect(() => {
    if (!problemSlug) return;
    const saved = localStorage.getItem(`draft:${problemSlug}:${language}`);
    if (saved) {
      setCode(saved);
    } else {
      setCode(starterCode[language] || "");
    }
  }, [language, problemSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist draft to localStorage
  useEffect(() => {
    if (!problemSlug || !code) return;
    localStorage.setItem(`draft:${problemSlug}:${language}`, code);
  }, [code, problemSlug, language]);

  const resetCode = useCallback(() => {
    setCode(starterCode[language] || "");
    if (problemSlug) {
      localStorage.removeItem(`draft:${problemSlug}:${language}`);
    }
  }, [language, problemSlug, starterCode]);

  return { language, setLanguage, code, setCode, resetCode };
}
