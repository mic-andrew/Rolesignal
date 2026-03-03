import { RiFireLine } from "react-icons/ri";

interface StreakDisplayProps {
  current: number;
  longest: number;
}

export function StreakDisplay({ current, longest }: StreakDisplayProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <RiFireLine
          size={28}
          className={current > 0 ? "text-warn" : "text-ink3"}
        />
        <div>
          <div className="text-2xl font-extrabold font-mono text-ink">{current}</div>
          <div className="text-[10px] uppercase tracking-wider text-ink3 font-semibold">Current</div>
        </div>
      </div>
      <div className="w-px h-10 bg-edge" />
      <div>
        <div className="text-2xl font-extrabold font-mono text-ink">{longest}</div>
        <div className="text-[10px] uppercase tracking-wider text-ink3 font-semibold">Longest</div>
      </div>
    </div>
  );
}
