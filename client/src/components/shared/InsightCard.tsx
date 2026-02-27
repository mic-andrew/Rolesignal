import { useState } from "react";
import { RiArrowDownSLine, RiAlertLine, RiDoubleQuotesL } from "react-icons/ri";
import { Card } from "../ui/Card";
import { SubCriterionScoreRow } from "./SubCriterionScoreRow";
import type { EvaluationInsight } from "../../types";

interface InsightCardProps {
  insight: EvaluationInsight;
  isSelected: boolean;
  onViewTranscript: () => void;
  index: number;
}

function scoreBgClass(score: number): string {
  if (score >= 80) return "bg-(--grg)";
  return "bg-(--acg)";
}

function scoreTextClass(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warn";
  return "text-danger";
}

export function InsightCard({ insight, isSelected, onViewTranscript, index }: InsightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const delay = Math.min(index + 2, 10);

  return (
    <Card
      glow
      padding="p-0"
      className={`animate-fade-in delay-${delay} ${isSelected ? "border-brand!" : ""}`}
    >
      <div className="px-5 py-4">
        {/* Header row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`flex items-center justify-center shrink-0 w-9 h-9 rounded-lg text-[13px] font-extrabold font-mono ${scoreBgClass(insight.score)} ${scoreTextClass(insight.score)}`}
            >
              {Math.round(insight.score)}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-ink truncate">{insight.criterionName}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-ink3">{insight.weight}% weight</span>
                <span className="text-[11px] font-medium text-brand2">
                  {insight.confidence}% confidence
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {insight.riskFlags.length > 0 && (
              <RiAlertLine size={14} className="text-danger" />
            )}
            <button
              onClick={onViewTranscript}
              className="text-[11px] font-semibold text-brand2 bg-transparent border-none cursor-pointer hover:text-brand transition-colors"
            >
              View transcript
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-1 bg-transparent border-none cursor-pointer text-ink3 hover:text-ink transition-colors"
            >
              <RiArrowDownSLine
                size={16}
                className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Rationale preview */}
        <p className={`text-[13px] text-ink2 leading-[1.65] mt-2.5 ${isExpanded ? "" : "line-clamp-2"}`}>
          {insight.insightText}
        </p>

        {/* Expanded detail */}
        {isExpanded && (
          <div className="animate-fade-in mt-3 pt-3 border-t border-edge">
            {/* Sub-criteria */}
            {insight.subCriterionScores.length > 0 && (
              <div className="mb-3">
                <div className="text-[10px] font-bold text-brand uppercase tracking-wide mb-2">
                  Sub-Criteria Breakdown
                </div>
                {insight.subCriterionScores.map((sub, idx) => (
                  <SubCriterionScoreRow key={idx} sub={sub} />
                ))}
              </div>
            )}

            {/* Evidence quotes */}
            {insight.evidence.length > 0 && (
              <div className="mb-3">
                <div className="text-[10px] font-bold text-ink3 uppercase tracking-wide mb-2">
                  Evidence ({insight.evidence.length})
                </div>
                <div className="space-y-1.5">
                  {insight.evidence.map((quote, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 rounded-lg px-2.5 py-1.5 bg-(--acg) border border-[rgba(124,111,255,0.1)]"
                    >
                      <RiDoubleQuotesL size={12} className="shrink-0 mt-0.5 text-brand opacity-60" />
                      <span className="text-[11px] italic leading-[1.55] text-ink2">{quote}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags row */}
            <div className="flex flex-wrap gap-2">
              {insight.riskFlags.length === 0 ? (
                <span className="py-[5px] px-3 rounded-md text-xs font-semibold text-success bg-(--grg)">
                  No risk flags
                </span>
              ) : (
                insight.riskFlags.map((flag, idx) => (
                  <span
                    key={idx}
                    className="py-[5px] px-3 rounded-md text-xs font-semibold text-danger bg-(--rdg)"
                  >
                    {flag}
                  </span>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
