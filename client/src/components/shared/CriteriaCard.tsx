import { useState } from "react";
import {
  RiDeleteBin6Line,
  RiArrowDownSLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import type { Criterion } from "../../types";
import { SubCriteriaEditor } from "./SubCriteriaEditor";
import { Card } from "../ui/Card";

interface CriteriaCardProps {
  criterion: Criterion;
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

export function CriteriaCard({
  criterion,
  onWeightChange,
  onNameChange,
  onDescriptionChange,
  onRemove,
  onAddSub,
  onUpdateSub,
  onRemoveSub,
}: CriteriaCardProps) {
  const { id, name, description, weight, subCriteria } = criterion;
  const [expanded, setExpanded] = useState(false);

  return (
    <Card padding="p-0" className="mb-3 px-5 py-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="cursor-pointer bg-transparent border-none p-0 shrink-0 text-[var(--color-ink3)]"
          >
            {expanded ? (
              <RiArrowDownSLine size={16} />
            ) : (
              <RiArrowRightSLine size={16} />
            )}
          </button>
          <input
            value={name}
            onChange={(e) => onNameChange(id, e.target.value)}
            className="text-sm font-bold text-[var(--color-ink)] bg-transparent border-none outline-none flex-1 min-w-0 p-0"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-[var(--color-ink3)]">
            {(subCriteria ?? []).length} sub
          </span>
          <span className="text-[13px] font-bold font-mono text-[var(--color-ink2)]">
            {weight}%
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(id);
            }}
            className="cursor-pointer border-0 bg-transparent p-1 rounded text-[var(--color-ink3)] transition-colors hover:text-[var(--color-danger)]"
          >
            <RiDeleteBin6Line size={14} />
          </button>
        </div>
      </div>

      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(id, e.target.value)}
        placeholder="Describe this criterion..."
        rows={2}
        className="w-full text-xs text-[var(--color-ink2)] bg-[var(--color-canvas2)] border border-[var(--color-edge)] rounded-md resize-y outline-none px-2.5 py-2 font-[inherit] mb-2.5"
      />

      <input
        type="range"
        min={5}
        max={50}
        value={weight}
        onChange={(e) => onWeightChange(id, Number(e.target.value))}
        className="criteria-slider w-full"
      />

      {expanded && (
        <SubCriteriaEditor
          subCriteria={subCriteria ?? []}
          onAdd={() => onAddSub(id)}
          onUpdate={(subId, updates) => onUpdateSub(id, subId, updates)}
          onRemove={(subId) => onRemoveSub(id, subId)}
        />
      )}
    </Card>
  );
}
