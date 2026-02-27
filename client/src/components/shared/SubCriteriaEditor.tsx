import { RiAddLine, RiCloseLine } from "react-icons/ri";

interface SubCriterionItem {
  id: string;
  name: string;
  description: string;
  weight: number;
}

interface SubCriteriaEditorProps {
  subCriteria: SubCriterionItem[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<{ name: string; description: string; weight: number }>) => void;
  onRemove: (id: string) => void;
  readOnly?: boolean;
}

export function SubCriteriaEditor({
  subCriteria,
  onAdd,
  onUpdate,
  onRemove,
  readOnly = false,
}: SubCriteriaEditorProps) {
  return (
    <div className="mt-3 ml-4 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--color-ink3)]">
          Sub-criteria ({subCriteria.length})
        </span>
        {!readOnly && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 text-xs font-medium text-[var(--color-brand2)] hover:opacity-80 cursor-pointer bg-transparent border-none p-0"
          >
            <RiAddLine size={12} />
            Add
          </button>
        )}
      </div>

      {subCriteria.map((sc) => (
        <div
          key={sc.id}
          className="flex items-start gap-3 rounded-lg border border-[var(--color-edge)] bg-[var(--color-canvas)] p-3"
        >
          <div className="flex-1 space-y-1">
            {readOnly ? (
              <div className="text-xs font-medium text-[var(--color-ink)]">
                {sc.name}
              </div>
            ) : (
              <input
                value={sc.name}
                onChange={(e) => onUpdate(sc.id, { name: e.target.value })}
                className="w-full bg-transparent border-none text-xs font-medium text-[var(--color-ink)] outline-none p-0"
                placeholder="Sub-criterion name"
              />
            )}
            {readOnly ? (
              <div className="text-[11px] text-[var(--color-ink3)]">
                {sc.description}
              </div>
            ) : (
              <input
                value={sc.description}
                onChange={(e) => onUpdate(sc.id, { description: e.target.value })}
                className="w-full bg-transparent border-none text-[11px] text-[var(--color-ink3)] outline-none p-0"
                placeholder="Description"
              />
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {readOnly ? (
              <span className="text-[11px] font-medium text-[var(--color-ink2)]">
                {sc.weight}%
              </span>
            ) : (
              <input
                type="number"
                value={sc.weight}
                onChange={(e) =>
                  onUpdate(sc.id, {
                    weight: Math.max(0, Math.min(100, Number(e.target.value))),
                  })
                }
                className="w-10 text-center bg-transparent border border-[var(--color-edge)] rounded text-[11px] font-medium text-[var(--color-ink2)] outline-none"
                min={0}
                max={100}
              />
            )}
            {!readOnly && (
              <button
                onClick={() => onRemove(sc.id)}
                className="flex items-center justify-center w-5 h-5 rounded text-[var(--color-ink3)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] cursor-pointer bg-transparent border-none"
              >
                <RiCloseLine size={12} />
              </button>
            )}
          </div>
        </div>
      ))}

      {subCriteria.length === 0 && (
        <div className="text-[11px] text-[var(--color-ink3)] italic py-1">
          No sub-criteria yet
        </div>
      )}
    </div>
  );
}
