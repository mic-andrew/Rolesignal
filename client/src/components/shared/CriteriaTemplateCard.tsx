import { useState } from "react";
import {
  RiDeleteBinLine,
  RiEditLine,
  RiCheckLine,
  RiCloseLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import type { CriteriaTemplate } from "../../types";

interface CriteriaTemplateCardProps {
  template: CriteriaTemplate;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (payload: {
    name?: string;
    description?: string;
    criteria?: Array<{
      name: string;
      description: string;
      weight: number;
      sub_criteria: Array<{ name: string; description: string; weight: number }>;
    }>;
  }) => void;
  isSaving: boolean;
  onDelete: () => void;
}

export function CriteriaTemplateCard({
  template,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  isSaving,
  onDelete,
}: CriteriaTemplateCardProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [editName, setEditName] = useState(template.name);
  const [editDesc, setEditDesc] = useState(template.description);

  const totalCriteria = template.criteria.length;
  const totalSub = template.criteria.reduce(
    (sum, c) => sum + (c.subCriteria?.length ?? 0),
    0,
  );

  return (
    <div className="rounded-xl border border-[var(--color-edge)] bg-[var(--color-canvas2)] overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-1">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-transparent border border-[var(--color-edge)] rounded px-2 py-1 text-sm font-semibold text-[var(--color-ink)] outline-none"
              />
              <input
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full bg-transparent border border-[var(--color-edge)] rounded px-2 py-1 text-xs text-[var(--color-ink3)] outline-none"
                placeholder="Description"
              />
            </div>
          ) : (
            <>
              <h3 className="text-sm font-semibold text-[var(--color-ink)] truncate">
                {template.name}
              </h3>
              {template.description && (
                <p className="text-xs text-[var(--color-ink3)] mt-0.5 truncate">
                  {template.description}
                </p>
              )}
            </>
          )}
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[11px] text-[var(--color-ink3)]">
              {totalCriteria} criteria
            </span>
            <span className="text-[11px] text-[var(--color-ink3)]">
              {totalSub} sub-criteria
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 ml-3 shrink-0">
          {isEditing ? (
            <>
              <button
                onClick={() =>
                  onSave({ name: editName, description: editDesc })
                }
                disabled={isSaving}
                className="flex items-center justify-center w-7 h-7 rounded-md text-[var(--color-success)] hover:bg-[var(--color-success-bg)] cursor-pointer bg-transparent border-none"
              >
                <RiCheckLine size={16} />
              </button>
              <button
                onClick={onCancel}
                className="flex items-center justify-center w-7 h-7 rounded-md text-[var(--color-ink3)] hover:bg-[var(--acg2)] cursor-pointer bg-transparent border-none"
              >
                <RiCloseLine size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="flex items-center justify-center w-7 h-7 rounded-md text-[var(--color-ink3)] hover:text-[var(--color-ink2)] hover:bg-[var(--acg2)] cursor-pointer bg-transparent border-none"
              >
                <RiEditLine size={14} />
              </button>
              <button
                onClick={onDelete}
                className="flex items-center justify-center w-7 h-7 rounded-md text-[var(--color-ink3)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] cursor-pointer bg-transparent border-none"
              >
                <RiDeleteBinLine size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-[var(--color-edge)]">
        {template.criteria.map((c, idx) => (
          <div key={idx} className="border-b border-[var(--color-edge)] last:border-b-0">
            <button
              onClick={() =>
                setExpandedIdx(expandedIdx === idx ? null : idx)
              }
              className="flex items-center gap-2 w-full px-4 py-2.5 text-left bg-transparent border-none cursor-pointer hover:bg-[var(--acg2)]"
            >
              {expandedIdx === idx ? (
                <RiArrowDownSLine size={14} className="text-[var(--color-ink3)] shrink-0" />
              ) : (
                <RiArrowRightSLine size={14} className="text-[var(--color-ink3)] shrink-0" />
              )}
              <span className="text-xs font-medium text-[var(--color-ink)] flex-1 truncate">
                {c.name}
              </span>
              <span className="text-[11px] font-medium text-[var(--color-brand2)] shrink-0">
                {c.weight}%
              </span>
              <span className="text-[11px] text-[var(--color-ink3)] shrink-0">
                {c.subCriteria?.length ?? 0} sub
              </span>
            </button>

            {expandedIdx === idx && (
              <div className="px-4 pb-3">
                {c.description && (
                  <p className="text-[11px] text-[var(--color-ink3)] mb-2">
                    {c.description}
                  </p>
                )}
                {(c.subCriteria ?? []).map((sc, scIdx) => (
                  <div
                    key={scIdx}
                    className="flex items-center gap-2 py-1 ml-4"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand2)] opacity-40 shrink-0" />
                    <span className="text-[11px] text-[var(--color-ink)] flex-1">
                      {sc.name}
                    </span>
                    <span className="text-[11px] text-[var(--color-ink3)]">
                      {sc.weight}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
