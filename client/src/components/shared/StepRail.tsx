import { RiCheckLine } from "react-icons/ri";

interface StepRailProps {
  steps: string[];
  current: number;
  onStepClick: (index: number) => void;
}

export function StepRail({ steps, current, onStepClick }: StepRailProps) {
  return (
    <div className="flex items-center animate-fade-in mb-9 px-5">
      {steps.map((label, i) => (
        <div
          key={label}
          className={`flex items-center ${i < steps.length - 1 ? "flex-1" : ""}`}
        >
          <button
            onClick={() => onStepClick(i)}
            className="flex items-center gap-2 cursor-pointer bg-transparent border-0 shrink-0"
          >
            <div
              className={`flex items-center justify-center w-[30px] h-[30px] rounded-full text-xs font-bold transition-all duration-300 ${
                i < current
                  ? "bg-success text-white"
                  : i === current
                    ? "bg-linear-to-br from-brand to-[#6358E0] text-white shadow-[0_0_12px_rgba(124,111,255,0.4)]"
                    : "bg-layer2 text-ink3"
              }`}
            >
              {i < current ? <RiCheckLine size={12} /> : i + 1}
            </div>

            <span
              className={`whitespace-nowrap text-xs transition-all duration-200 ${
                i === current ? "font-bold text-ink" : "font-medium text-ink3"
              }`}
            >
              {label}
            </span>
          </button>

          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-3.5 rounded-sm transition-colors duration-400 ${
                i < current ? "bg-success" : "bg-edge"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
