import type { Candidate } from "../../types";
import { Avatar } from "../ui/Avatar";
import { ScoreRing } from "../ui/ScoreRing";
import { SkillBar } from "../ui/SkillBar";
import { Card } from "../ui/Card";

interface CompareCardProps {
  candidate: Candidate;
}

const SKILL_LABELS: Record<string, string> = {
  tech: "Technical",
  behavioral: "Behavioral",
  communication: "Communication",
  problemSolving: "Problem Solving",
  culture: "Culture Fit",
};

export function CompareCard({ candidate }: CompareCardProps) {
  const { name, initials, score, color, skills } = candidate;

  return (
    <Card padding="p-0" className="flex-1 px-5 py-4 min-w-0">
      <div className="flex items-center gap-2.5 mb-4">
        <Avatar initials={initials} size={36} color={color} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-ink overflow-hidden text-ellipsis whitespace-nowrap">
            {name}
          </div>
        </div>
        <ScoreRing value={score} size={42} strokeWidth={2.5} />
      </div>

      <div className="h-px bg-edge mb-4" />

      {Object.entries(skills).map(([key, val], j) => (
        <SkillBar
          key={key}
          label={SKILL_LABELS[key] ?? key}
          value={val}
          delay={j}
        />
      ))}
    </Card>
  );
}
