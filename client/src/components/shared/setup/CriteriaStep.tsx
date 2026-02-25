import { RiAddLine } from "react-icons/ri";
import { CriteriaCard } from "../CriteriaCard";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import type { Criterion } from "../../../types";

interface CriteriaStepProps {
  criteria: Criterion[];
  totalWeight: number;
  jobDescription: string;
  isParsing: boolean;
  onExtractCriteria: () => void;
  onAddCriterion: () => void;
  onWeightChange: (id: string, weight: number) => void;
  onNameChange: (id: string, name: string) => void;
  onDescriptionChange: (id: string, description: string) => void;
  onRemove: (id: string) => void;
  onAddSub: (criterionId: string) => void;
  onUpdateSub: (
    criterionId: string,
    subId: string,
    updates: Partial<{ name: string; description: string; weight: number }>
  ) => void;
  onRemoveSub: (criterionId: string, subId: string) => void;
}

export function CriteriaStep({
  criteria,
  totalWeight,
  jobDescription,
  isParsing,
  onExtractCriteria,
  onAddCriterion,
  onWeightChange,
  onNameChange,
  onDescriptionChange,
  onRemove,
  onAddSub,
  onUpdateSub,
  onRemoveSub,
}: CriteriaStepProps) {
  return (
    <div>
      <div className="mb-[18px]">
        <h3 className="text-[17px] font-bold text-[var(--color-ink)]">
          Evaluation Criteria
        </h3>
        <p className="text-[13px] text-[var(--color-ink3)] mt-1">
          {criteria.length === 0
            ? "Extract criteria from your job description, or add them manually."
            : "Adjust weights and descriptions. Total must equal 100%."}
        </p>
      </div>

      {criteria.length === 0 && (
        <EmptyState
          jobDescription={jobDescription}
          isParsing={isParsing}
          onExtractCriteria={onExtractCriteria}
          onAddCriterion={onAddCriterion}
        />
      )}

      {criteria.length > 0 && (
        <>
          {jobDescription && (
            <div className="mb-3.5 text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={onExtractCriteria}
                className={isParsing ? "opacity-70" : ""}
              >
                {isParsing ? "Extracting..." : "Re-extract from JD"}
              </Button>
            </div>
          )}

          <WeightBar totalWeight={totalWeight} />

          {criteria.map((c) => (
            <CriteriaCard
              key={c.id}
              criterion={c}
              onWeightChange={onWeightChange}
              onNameChange={onNameChange}
              onDescriptionChange={onDescriptionChange}
              onRemove={onRemove}
              onAddSub={onAddSub}
              onUpdateSub={onUpdateSub}
              onRemoveSub={onRemoveSub}
            />
          ))}

          <div className="flex items-center justify-between mt-2.5">
            <Button variant="ghost" size="sm" onClick={onAddCriterion}>
              <RiAddLine size={14} />Add Criterion
            </Button>
            <p className="text-xs text-[var(--color-ink3)]">
              Total weight:{" "}
              <span
                className={`font-mono font-bold ${
                  totalWeight === 100
                    ? "text-[var(--color-success)]"
                    : "text-[var(--color-warn)]"
                }`}
              >
                {totalWeight}%
              </span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Sub-components (private to this file) ─────────────────────────── */

interface EmptyStateProps {
  jobDescription: string;
  isParsing: boolean;
  onExtractCriteria: () => void;
  onAddCriterion: () => void;
}

function EmptyState({
  jobDescription,
  isParsing,
  onExtractCriteria,
  onAddCriterion,
}: EmptyStateProps) {
  return (
    <Card padding="p-0" className="p-6 mb-[18px] text-center">
      <p className="text-[13px] text-[var(--color-ink3)] mb-4">
        {jobDescription
          ? "Click below to extract criteria from your job description."
          : "Go back and add a job description, or add criteria manually."}
      </p>
      <div className="flex justify-center gap-2.5">
        {jobDescription && (
          <Button
            onClick={onExtractCriteria}
            className={isParsing ? "opacity-70" : ""}
          >
            {isParsing ? "Extracting..." : "Extract from JD"}
          </Button>
        )}
        <Button variant="ghost" onClick={onAddCriterion}>
          <RiAddLine size={14} />Add Manually
        </Button>
      </div>
    </Card>
  );
}

interface WeightBarProps {
  totalWeight: number;
}

function WeightBar({ totalWeight }: WeightBarProps) {
  return (
    <div className="rounded-md mb-3.5 h-1.5 bg-[var(--color-edge)] overflow-hidden">
      <div
        className={`h-full rounded-md transition-all duration-300 ${
          totalWeight === 100 ? "bg-[var(--color-success)]" : "bg-[var(--color-brand)]"
        }`}
        style={{ width: `${Math.min(totalWeight, 100)}%` }}
      />
    </div>
  );
}
