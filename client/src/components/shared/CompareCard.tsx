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
    <Card padding="p-0" style={{ flex: 1, padding: "16px 18px", minWidth: 0 }}>
      {/* Header */}
      <div className="flex items-center" style={{ gap: 10, marginBottom: 14 }}>
        <Avatar initials={initials} size={36} color={color} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14, fontWeight: 700, color: "var(--color-ink)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}
          >
            {name}
          </div>
        </div>
        <ScoreRing value={score} size={42} strokeWidth={2.5} />
      </div>

      <div style={{ height: 1, background: "var(--color-edge)", marginBottom: 14 }} />

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
