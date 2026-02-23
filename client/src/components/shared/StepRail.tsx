import { RiCheckLine } from "react-icons/ri";

interface StepRailProps {
  steps: string[];
  current: number;
  onStepClick: (index: number) => void;
}

export function StepRail({ steps, current, onStepClick }: StepRailProps) {
  return (
    <div className="flex items-center animate-fade-in" style={{ marginBottom: 36, padding: "0 20px" }}>
      {steps.map((label, i) => (
        <div key={label} className="flex items-center" style={{ flex: i < steps.length - 1 ? 1 : undefined }}>
          <button
            onClick={() => onStepClick(i)}
            className="flex items-center cursor-pointer bg-transparent border-0 shrink-0"
            style={{ gap: 8 }}
          >
            {/* Circle */}
            <div
              className="flex items-center justify-center transition-all duration-300"
              style={{
                width: 30, height: 30, borderRadius: "50%", fontSize: 12, fontWeight: 700,
                background: i < current
                  ? "var(--color-success)"
                  : i === current
                  ? "linear-gradient(135deg, var(--color-brand), #6358E0)"
                  : "var(--color-layer2)",
                color: i <= current ? "#fff" : "var(--color-ink3)",
                boxShadow: i === current ? "0 0 12px rgba(124,111,255,0.4)" : "none",
              }}
            >
              {i < current ? <RiCheckLine size={12} /> : i + 1}
            </div>

            {/* Label */}
            <span
              className="whitespace-nowrap transition-all duration-200"
              style={{
                fontSize: 12,
                fontWeight: i === current ? 700 : 500,
                color: i === current ? "var(--color-ink)" : "var(--color-ink3)",
              }}
            >
              {label}
            </span>
          </button>

          {/* Connector */}
          {i < steps.length - 1 && (
            <div
              className="transition-colors duration-400"
              style={{ flex: 1, height: 2, margin: "0 14px", borderRadius: 1, background: i < current ? "var(--color-success)" : "var(--color-edge)" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
