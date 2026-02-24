import { RiDeleteBin6Line } from "react-icons/ri";
import type { Criterion } from "../../types";
import { Card } from "../ui/Card";

interface CriteriaCardProps {
  criterion: Criterion;
  onWeightChange: (id: string, weight: number) => void;
  onNameChange: (id: string, name: string) => void;
  onDescriptionChange: (id: string, description: string) => void;
  onRemove: (id: string) => void;
}

export function CriteriaCard({
  criterion,
  onWeightChange,
  onNameChange,
  onDescriptionChange,
  onRemove,
}: CriteriaCardProps) {
  const { id, name, description, weight } = criterion;

  return (
    <Card padding="p-0" style={{ marginBottom: 8, padding: "16px 18px" }}>
      <div className="flex items-center justify-between" style={{ gap: 12, marginBottom: 8 }}>
        <input
          value={name}
          onChange={(e) => onNameChange(id, e.target.value)}
          style={{
            fontSize: 14, fontWeight: 700, color: "var(--color-ink)",
            background: "transparent", border: "none",
            outline: "none", flex: 1, minWidth: 0, padding: 0,
          }}
        />
        <div className="flex items-center shrink-0" style={{ gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-family-mono)", color: "var(--color-ink2)" }}>
            {weight}%
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(id); }}
            className="cursor-pointer border-0 bg-transparent transition-colors"
            style={{ color: "var(--color-ink3)", padding: 4, borderRadius: 4 }}
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
        style={{
          fontSize: 12, color: "var(--color-ink2)", background: "var(--color-canvas2)",
          border: "1px solid var(--color-edge)", borderRadius: 6, resize: "vertical",
          outline: "none", width: "100%", padding: "8px 10px", fontFamily: "inherit",
          marginBottom: 10,
        }}
      />

      <input
        type="range"
        min={5}
        max={50}
        value={weight}
        onChange={(e) => onWeightChange(id, Number(e.target.value))}
        className="criteria-slider"
        style={{ width: "100%" }}
      />
    </Card>
  );
}
