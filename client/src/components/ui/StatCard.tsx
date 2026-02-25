import { Card } from "./Card";

interface StatCardProps {
  label: string;
  value: number | string;
  accentColor: string;
  animationDelay?: number;
}

export function StatCard({ label, value, accentColor, animationDelay = 0 }: StatCardProps) {
  return (
    <Card
      padding="p-0"
      className={`animate-fade-in delay-${animationDelay} px-6 py-5 border-l-[3px]`}
      style={{ borderLeftColor: accentColor }}
    >
      <div className="text-[11px] font-semibold uppercase tracking-widest mb-2 text-ink3">
        {label}
      </div>
      <div
        className="text-3xl font-extrabold tracking-tight font-mono"
        style={{ color: accentColor }}
      >
        {value}
      </div>
    </Card>
  );
}
