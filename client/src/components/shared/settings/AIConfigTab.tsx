import { Card } from "../../ui/Card";
import type { AIConfig, AITone } from "../../../types";

const TONE_DESCRIPTIONS: Record<AITone, string> = {
  Professional: "Formal",
  Conversational: "Warm & natural",
  Challenging: "Rigorous",
};

const SLIDERS = [
  { key: "formality", label: "Formality" },
  { key: "probingDepth", label: "Probing Depth" },
  { key: "warmth", label: "Warmth" },
  { key: "pace", label: "Pace" },
] as const;

interface AIConfigTabProps {
  aiConfig: AIConfig;
  tones: AITone[];
  onSetTone: (tone: AITone) => void;
  onSetSlider: (key: keyof Omit<AIConfig, "tone">, value: number) => void;
}

export function AIConfigTab({
  aiConfig,
  tones,
  onSetTone,
  onSetSlider,
}: AIConfigTabProps) {
  return (
    <div>
      <h2 className="text-[17px] font-bold mb-5 text-ink">AI Configuration</h2>
      <Card padding="p-0" className="p-6">
        <div className="text-[11px] font-bold uppercase tracking-wide mb-4 text-ink3">
          Interview Tone
        </div>
        <div className="flex gap-2.5 mb-7">
          {tones.map((tone) => (
            <button
              key={tone}
              onClick={() => onSetTone(tone)}
              className={`flex-1 cursor-pointer text-center transition-all p-4 rounded-xl ${
                aiConfig.tone === tone
                  ? "border-2 border-brand bg-(--acg)"
                  : "border border-edge bg-layer"
              }`}
            >
              <div
                className={`text-[13px] font-bold mb-1 ${
                  aiConfig.tone === tone ? "text-brand" : "text-ink"
                }`}
              >
                {tone}
              </div>
              <div className="text-[11px] text-ink3">
                {TONE_DESCRIPTIONS[tone]}
              </div>
            </button>
          ))}
        </div>

        <div className="text-[11px] font-bold uppercase tracking-wide mb-4 text-ink3">
          Behavior Sliders
        </div>
        {SLIDERS.map(({ key, label }) => (
          <div key={key} className="mb-4">
            <div className="flex justify-between mb-1.5">
              <span className="text-xs font-medium text-ink2">{label}</span>
              <span className="text-xs font-bold font-mono text-brand">
                {aiConfig[key]}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={aiConfig[key]}
              onChange={(e) => onSetSlider(key, Number(e.target.value))}
              className="w-full"
              style={{
                background: `linear-gradient(90deg, var(--color-brand) ${aiConfig[key]}%, var(--color-edge) ${aiConfig[key]}%)`,
              }}
            />
          </div>
        ))}
      </Card>
    </div>
  );
}
