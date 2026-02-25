import { RiArrowDownSLine } from "react-icons/ri";
import { Card } from "../ui/Card";
import { SubCriterionScoreRow } from "./SubCriterionScoreRow";
import type { CriterionScore } from "../../types";

interface EvaluationCriterionCardProps {
  criterion: CriterionScore;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

function ScoreBadge({ score }: { score: number }) {
  const isHigh = score >= 75;
  return (
    <div
      className={`flex items-center justify-center shrink-0 w-9 h-9 rounded-lg text-[13px] font-extrabold font-mono ${
        isHigh ? "bg-(--grg) text-success" : "bg-(--acg) text-brand"
      }`}
    >
      {Math.round(score)}
    </div>
  );
}

export function EvaluationCriterionCard({
  criterion,
  isExpanded,
  onToggle,
  index,
}: EvaluationCriterionCardProps) {
  return (
    <Card
      glow
      padding="p-0"
      onClick={onToggle}
      className={`px-[18px] py-[14px] mb-2 animate-fade-in delay-${Math.min(index + 2, 5) as 1 | 2 | 3 | 4 | 5}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <ScoreBadge score={criterion.score} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-ink">
                {criterion.name}
              </span>
              <span className="text-[11px] font-medium text-ink3">
                {criterion.weight}%
              </span>
            </div>
            <div className="text-xs text-ink3">
              Score: {Math.round(criterion.score)}/100
              {criterion.subCriterionScores.length > 0 && (
                <span className="ml-2">
                  · {criterion.subCriterionScores.length} sub-criteria
                </span>
              )}
            </div>
          </div>
        </div>
        <RiArrowDownSLine
          size={18}
          className={`text-ink3 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>

      {isExpanded && (
        <div className="animate-fade-in mt-3.5 pt-3.5 border-t border-edge">
          {/* Sub-criteria breakdown */}
          {criterion.subCriterionScores.length > 0 && (
            <div className="mb-4">
              <div className="text-[10px] font-bold text-brand uppercase tracking-wide mb-2">
                Sub-Criteria Breakdown
              </div>
              {criterion.subCriterionScores.map((sub, idx) => (
                <SubCriterionScoreRow key={idx} sub={sub} />
              ))}
            </div>
          )}

          {/* Overall rationale */}
          <div className="text-[10px] font-bold text-brand uppercase tracking-wide mb-1.5">
            AI Rationale
          </div>
          <p className="text-[13px] text-ink2 leading-[1.65] mb-2.5">
            {criterion.rationale}
          </p>

          {/* Evidence and risk flags */}
          <div className="flex flex-wrap gap-2">
            {criterion.evidence.length > 0 && (
              <span className="py-[5px] px-3 rounded-md text-xs font-semibold text-brand bg-(--acg)">
                {criterion.evidence.length} evidence quotes
              </span>
            )}
            {criterion.riskFlags.length === 0 ? (
              <span className="py-[5px] px-3 rounded-md text-xs font-semibold text-success bg-(--grg)">
                No risk flags
              </span>
            ) : (
              criterion.riskFlags.map((flag, idx) => (
                <span
                  key={idx}
                  className="py-[5px] px-3 rounded-md text-xs font-semibold text-danger bg-[rgba(234,67,53,0.08)]"
                >
                  {flag}
                </span>
              ))
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
