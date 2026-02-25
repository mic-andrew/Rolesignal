import { Card } from "../../ui/Card";
import type { InterviewConfig } from "../../../types";

const DURATIONS = [15, 30, 45, 60] as const;

const TONES = [
  { label: "Professional" as const, desc: "Formal and structured" },
  { label: "Conversational" as const, desc: "Warm and natural" },
  { label: "Challenging" as const, desc: "Probing and rigorous" },
];

interface ConfigureStepProps {
  config: InterviewConfig;
  onConfigChange: (config: InterviewConfig) => void;
}

export function ConfigureStep({ config, onConfigChange }: ConfigureStepProps) {
  return (
    <Card padding="p-0" className="p-[30px]">
      <h3 className="text-[17px] font-bold text-[var(--color-ink)] mb-[22px]">
        Interview Configuration
      </h3>

      {/* Duration */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-[var(--color-ink2)] mb-2.5">
          Duration
        </label>
        <div className="flex gap-2.5">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => onConfigChange({ ...config, duration: d })}
              className={`flex-1 cursor-pointer transition-all py-4 text-center rounded-xl ${
                config.duration === d
                  ? "border-2 border-[var(--color-brand)] bg-[var(--acg)]"
                  : "border border-[var(--color-edge)] bg-[var(--color-layer)]"
              }`}
            >
              <div
                className={`text-[22px] font-extrabold tracking-tight ${
                  config.duration === d
                    ? "text-[var(--color-brand)]"
                    : "text-[var(--color-ink)]"
                }`}
              >
                {d}
              </div>
              <div className="text-[11px] text-[var(--color-ink3)] font-medium">
                minutes
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* AI Tone */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-[var(--color-ink2)] mb-2.5">
          AI Tone
        </label>
        <div className="flex gap-2.5">
          {TONES.map(({ label, desc }) => (
            <button
              key={label}
              onClick={() => onConfigChange({ ...config, tone: label })}
              className={`flex-1 cursor-pointer text-center transition-all p-4 rounded-xl ${
                config.tone === label
                  ? "border-2 border-[var(--color-brand)] bg-[var(--acg)]"
                  : "border border-[var(--color-edge)] bg-[var(--color-layer)]"
              }`}
            >
              <div
                className={`text-[13px] font-bold mb-0.5 ${
                  config.tone === label
                    ? "text-[var(--color-brand)]"
                    : "text-[var(--color-ink)]"
                }`}
              >
                {label}
              </div>
              <div className="text-[11px] text-[var(--color-ink3)]">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Adaptive Difficulty toggle */}
      <div className="flex items-center justify-between p-4 bg-[var(--color-canvas2)] rounded-xl border border-[var(--color-edge)]">
        <div>
          <div className="text-sm font-semibold text-[var(--color-ink)]">
            Adaptive Difficulty
          </div>
          <div className="text-xs text-[var(--color-ink3)] mt-0.5">
            AI adjusts question depth based on candidate responses
          </div>
        </div>
        <button
          onClick={() =>
            onConfigChange({
              ...config,
              adaptiveDifficulty: !config.adaptiveDifficulty,
            })
          }
          className={`border-0 cursor-pointer shrink-0 w-11 h-6 rounded-xl p-0.5 transition-colors duration-200 ${
            config.adaptiveDifficulty
              ? "bg-[var(--color-brand)] shadow-[0_0_10px_rgba(124,111,255,0.3)]"
              : "bg-[var(--color-edge2)]"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-all duration-200 ${
              config.adaptiveDifficulty ? "ml-5" : "ml-0"
            }`}
          />
        </button>
      </div>
    </Card>
  );
}
