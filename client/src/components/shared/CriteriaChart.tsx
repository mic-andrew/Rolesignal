interface CriterionBar {
  name: string;
  score: number;
}

interface CriteriaChartProps {
  criteria: CriterionBar[];
}

function barBgClass(v: number): string {
  if (v >= 90) return "bg-success";
  if (v >= 80) return "bg-brand";
  return "bg-warn";
}

function barTextClass(v: number): string {
  if (v >= 90) return "text-success";
  if (v >= 80) return "text-brand";
  return "text-warn";
}

function barShadowClass(v: number): string {
  if (v >= 90) return "shadow-[0_0_8px_rgba(34,201,151,0.3)]";
  return "shadow-[0_0_8px_rgba(124,111,255,0.3)]";
}

export function CriteriaChart({ criteria }: CriteriaChartProps) {
  return (
    <div className="flex justify-between gap-3">
      {criteria.map((c, i) => (
        <div key={c.name} className="flex-1 text-center">
          <div className="flex items-end justify-center h-[70px] mb-1.5">
            <div
              className={`animate-bar-fill w-6 rounded-t ${barBgClass(c.score)} ${barShadowClass(c.score)}`}
              style={{
                height: `${c.score * 0.7}px`,
                animationDelay: `${i * 0.08}s`,
              }}
            />
          </div>
          <div className={`text-[15px] font-extrabold font-mono ${barTextClass(c.score)}`}>{c.score}</div>
          <div className="text-[10px] text-ink3 font-medium mt-0.5">
            {c.name.split(" ")[0]}
          </div>
        </div>
      ))}
    </div>
  );
}
