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
    <Card padding="p-0" className="p-8">
      <h3 className="text-[17px] font-bold text-ink mb-6">
        Interview Configuration
      </h3>

      {/* Duration */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-ink2 mb-2.5">
          Duration
        </label>
        <div className="flex gap-2.5">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => onConfigChange({ ...config, duration: d })}
              className={`flex-1 cursor-pointer transition-all py-4 text-center rounded-xl ${
                config.duration === d
                  ? "border-2 border-brand bg-(--acg)"
                  : "border border-edge bg-layer"
              }`}
            >
              <div
                className={`text-[22px] font-extrabold tracking-tight ${
                  config.duration === d
                    ? "text-brand"
                    : "text-ink"
                }`}
              >
                {d}
              </div>
              <div className="text-[11px] text-ink3 font-medium">
                minutes
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* AI Tone */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-ink2 mb-2.5">
          AI Tone
        </label>
        <div className="flex gap-2.5">
          {TONES.map(({ label, desc }) => (
            <button
              key={label}
              onClick={() => onConfigChange({ ...config, tone: label })}
              className={`flex-1 cursor-pointer text-center transition-all p-4 rounded-xl ${
                config.tone === label
                  ? "border-2 border-brand bg-(--acg)"
                  : "border border-edge bg-layer"
              }`}
            >
              <div
                className={`text-[13px] font-bold mb-0.5 ${
                  config.tone === label
                    ? "text-brand"
                    : "text-ink"
                }`}
              >
                {label}
              </div>
              <div className="text-[11px] text-ink3">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Adaptive Difficulty toggle */}
      <div className="flex items-center justify-between p-4 bg-canvas2 rounded-xl border border-edge">
        <div>
          <div className="text-sm font-semibold text-ink">
            Adaptive Difficulty
          </div>
          <div className="text-xs text-ink3 mt-0.5">
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
              ? "bg-brand shadow-[0_0_10px_rgba(124,111,255,0.3)]"
              : "bg-edge2"
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
