import { useState } from "react";
import { RiAddLine, RiBookOpenLine, RiLoader4Line } from "react-icons/ri";
import { CriteriaCard } from "../CriteriaCard";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import type { Criterion, CriteriaTemplate } from "../../../types";

interface CriteriaStepProps {
  criteria: Criterion[];
  totalWeight: number;
  jobDescription: string;
  isParsing: boolean;
  templates: CriteriaTemplate[];
  isLoadingTemplates: boolean;
  onExtractCriteria: () => void;
  onAddCriterion: () => void;
  onSelectTemplate: (template: CriteriaTemplate) => void;
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
  templates,
  isLoadingTemplates,
  onExtractCriteria,
  onAddCriterion,
  onSelectTemplate,
  onWeightChange,
  onNameChange,
  onDescriptionChange,
  onRemove,
  onAddSub,
  onUpdateSub,
  onRemoveSub,
}: CriteriaStepProps) {
  const [showLibrary, setShowLibrary] = useState(false);

  return (
    <div>
      <div className="mb-[18px]">
        <h3 className="text-[17px] font-bold text-ink">
          Evaluation Criteria
        </h3>
        <p className="text-[13px] text-ink3 mt-1">
          {criteria.length === 0
            ? "Extract criteria from your job description, select from your library, or add them manually."
            : "Adjust weights and descriptions. Total must equal 100%."}
        </p>
      </div>

      {criteria.length === 0 && !showLibrary && (
        <EmptyCriteriaState
          jobDescription={jobDescription}
          isParsing={isParsing}
          hasTemplates={templates.length > 0}
          onExtractCriteria={onExtractCriteria}
          onAddCriterion={onAddCriterion}
          onShowLibrary={() => setShowLibrary(true)}
        />
      )}

      {showLibrary && criteria.length === 0 && (
        <TemplateSelector
          templates={templates}
          isLoading={isLoadingTemplates}
          onSelect={(t) => { onSelectTemplate(t); setShowLibrary(false); }}
          onBack={() => setShowLibrary(false)}
        />
      )}

      {criteria.length > 0 && (
        <>
          <div className="mb-3.5 flex justify-end gap-2">
            {jobDescription && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onExtractCriteria}
                disabled={isParsing}
              >
                {isParsing && <RiLoader4Line size={14} className="animate-spin" />}
                {isParsing ? "Extracting..." : "Re-extract from JD"}
              </Button>
            )}
            {templates.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setShowLibrary(true)}>
                <RiBookOpenLine size={14} />Replace from Library
              </Button>
            )}
          </div>

          {showLibrary && (
            <TemplateSelector
              templates={templates}
              isLoading={isLoadingTemplates}
              onSelect={(t) => { onSelectTemplate(t); setShowLibrary(false); }}
              onBack={() => setShowLibrary(false)}
            />
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
            <p className="text-xs text-ink3">
              Total weight:{" "}
              <span
                className={`font-mono font-bold ${
                  totalWeight === 100
                    ? "text-success"
                    : "text-warn"
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

interface EmptyCriteriaStateProps {
  jobDescription: string;
  isParsing: boolean;
  hasTemplates: boolean;
  onExtractCriteria: () => void;
  onAddCriterion: () => void;
  onShowLibrary: () => void;
}

function EmptyCriteriaState({
  jobDescription,
  isParsing,
  hasTemplates,
  onExtractCriteria,
  onAddCriterion,
  onShowLibrary,
}: EmptyCriteriaStateProps) {
  return (
    <Card padding="p-0" className="p-6 mb-[18px] text-center">
      <p className="text-[13px] text-ink3 mb-4">
        {jobDescription
          ? "Extract criteria from your job description, select from your library, or add manually."
          : "Go back and add a job description, select from your library, or add criteria manually."}
      </p>
      <div className="flex justify-center gap-2.5">
        {jobDescription && (
          <Button onClick={onExtractCriteria} disabled={isParsing}>
            {isParsing && <RiLoader4Line size={14} className="animate-spin" />}
            {isParsing ? "Extracting..." : "Extract from JD"}
          </Button>
        )}
        {hasTemplates && (
          <Button variant="ghost" onClick={onShowLibrary}>
            <RiBookOpenLine size={14} />Use from Library
          </Button>
        )}
        <Button variant="ghost" onClick={onAddCriterion}>
          <RiAddLine size={14} />Add Manually
        </Button>
      </div>
    </Card>
  );
}

interface TemplateSelectorProps {
  templates: CriteriaTemplate[];
  isLoading: boolean;
  onSelect: (template: CriteriaTemplate) => void;
  onBack: () => void;
}

function TemplateSelector({ templates, isLoading, onSelect, onBack }: TemplateSelectorProps) {
  if (isLoading) {
    return (
      <Card padding="p-0" className="p-6 mb-[18px] text-center">
        <RiLoader4Line size={20} className="animate-spin mx-auto text-brand mb-2" />
        <p className="text-[13px] text-ink3">Loading templates...</p>
      </Card>
    );
  }

  if (templates.length === 0) {
    return (
      <Card padding="p-0" className="p-6 mb-[18px] text-center">
        <p className="text-[13px] text-ink3 mb-3">No saved templates yet.</p>
        <Button variant="ghost" size="sm" onClick={onBack}>Back</Button>
      </Card>
    );
  }

  return (
    <div className="mb-[18px] space-y-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-semibold text-ink">Select a template</span>
        <Button variant="ghost" size="sm" onClick={onBack}>Cancel</Button>
      </div>
      {templates.map((t) => (
        <Card
          key={t.id}
          padding="p-0"
          className="px-4 py-3 cursor-pointer transition-colors hover:bg-(--acg)"
          onClick={() => onSelect(t)}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[14px] font-semibold text-ink">{t.name}</div>
              <div className="text-[12px] text-ink3 mt-0.5">
                {t.criteria.length} criteria &middot; {t.description || "No description"}
              </div>
            </div>
            <span className="text-[11px] font-mono text-ink3">
              {new Date(t.createdAt).toLocaleDateString()}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}

interface WeightBarProps {
  totalWeight: number;
}

function WeightBar({ totalWeight }: WeightBarProps) {
  return (
    <div className="rounded-md mb-3.5 h-1.5 bg-edge overflow-hidden">
      <div
        className={`h-full rounded-md transition-all duration-300 ${
          totalWeight === 100 ? "bg-success" : "bg-brand"
        }`}
        style={{ width: `${Math.min(totalWeight, 100)}%` }}
      />
    </div>
  );
}
