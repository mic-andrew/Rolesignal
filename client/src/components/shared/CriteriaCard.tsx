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
  const { id, name, description, weight, color } = criterion;

  return (
    <Card glow padding="p-0" style={{ marginBottom: 8, padding: "14px 18px" }}>
      <div className="flex items-start justify-between" style={{ gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <input
            value={name}
            onChange={(e) => onNameChange(id, e.target.value)}
            style={{
              fontSize: 14, fontWeight: 700, color: "var(--color-ink)",
              background: "transparent", border: "none",
              borderBottom: "1px solid var(--color-edge)",
              outline: "none", width: "100%", marginBottom: 6, padding: "2px 0",
            }}
          />
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(id, e.target.value)}
            placeholder="Describe this criterion..."
            rows={2}
            style={{
              fontSize: 12, color: "var(--color-ink2)", background: "transparent",
              border: "1px solid var(--color-edge)", borderRadius: 6, resize: "vertical",
              outline: "none", width: "100%", padding: "6px 8px", fontFamily: "inherit",
            }}
          />
        </div>

        <div className="flex items-center shrink-0" style={{ gap: 10, paddingTop: 4 }}>
          <div style={{ width: 80, height: 5, background: "var(--color-edge)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${weight}%`, background: color, borderRadius: 3, transition: "width 0.3s" }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-family-mono)", color: "var(--color-ink2)", minWidth: 36, textAlign: "right" }}>
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

      <div style={{ marginTop: 10 }}>
        <input
          type="range"
          min={5}
          max={50}
          value={weight}
          onChange={(e) => onWeightChange(id, Number(e.target.value))}
          style={{
            width: "100%",
            background: `linear-gradient(90deg, ${color} ${weight * 2}%, var(--color-edge) ${weight * 2}%)`,
          }}
        />
      </div>
    </Card>
  );
}
