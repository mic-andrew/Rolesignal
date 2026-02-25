import { useState } from "react";
import { RiDoubleQuotesL } from "react-icons/ri";
import type { SubCriterionScore } from "../../types";

interface SubCriterionScoreRowProps {
  sub: SubCriterionScore;
}

export function SubCriterionScoreRow({ sub }: SubCriterionScoreRowProps) {
  const [showEvidence, setShowEvidence] = useState(false);
  const isHigh = sub.score >= 75;

  return (
    <div className="py-2 border-b border-edge">
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center justify-center shrink-0 w-7 h-7 rounded-md text-[11px] font-bold font-mono ${
            isHigh ? "bg-(--grg) text-success" : "bg-(--acg) text-brand"
          }`}
        >
          {Math.round(sub.score)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold truncate text-ink">
              {sub.name}
            </span>
            <span className="text-[10px] font-medium shrink-0 text-ink3">
              {sub.weight}%
            </span>
          </div>
          <p className="text-[11px] mt-0.5 leading-normal text-ink3">
            {sub.rationale}
          </p>
        </div>
      </div>

      {sub.evidence.length > 0 && (
        <div className="ml-10 mt-1.5">
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="text-[11px] font-semibold cursor-pointer bg-transparent border-none p-0 text-brand2"
          >
            {showEvidence
              ? "Hide evidence"
              : `View evidence (${sub.evidence.length})`}
          </button>

          {showEvidence && (
            <div className="mt-2 space-y-1.5">
              {sub.evidence.map((quote, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 rounded-lg px-2.5 py-1.5 bg-(--acg) border border-[rgba(124,111,255,0.1)]"
                >
                  <RiDoubleQuotesL
                    size={12}
                    className="shrink-0 mt-0.5 text-brand opacity-60"
                  />
                  <span className="text-[11px] italic leading-[1.55] text-ink2">
                    {quote}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
