import type { Verdict } from "../types";

export function getVerdict(score: number): Verdict {
  if (score >= 85) return "Strong Yes";
  if (score >= 78) return "Lean Yes";
  if (score >= 70) return "Neutral";
  return "Lean No";
}

export function getVerdictDotColor(verdict: Verdict): string {
  switch (verdict) {
    case "Strong Yes": return "bg-success";
    case "Lean Yes":   return "bg-brand2";
    case "Neutral":    return "bg-warn";
    case "Lean No":    return "bg-danger";
  }
}

export function getVerdictBgColor(verdict: Verdict): string {
  switch (verdict) {
    case "Strong Yes": return "bg-(--grg)";
    case "Lean Yes":   return "bg-(--acg)";
    case "Neutral":    return "bg-(--amg)";
    case "Lean No":    return "bg-(--rdg)";
  }
}

export function getVerdictTextColor(verdict: Verdict): string {
  switch (verdict) {
    case "Strong Yes": return "text-success";
    case "Lean Yes":   return "text-brand2";
    case "Neutral":    return "text-warn";
    case "Lean No":    return "text-danger";
  }
}
