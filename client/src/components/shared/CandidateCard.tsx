import { useNavigate } from "react-router-dom";
import type { Candidate } from "../../types";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { ScoreRing } from "../ui/ScoreRing";
import { SkillBar } from "../ui/SkillBar";

interface CandidateCardProps {
  candidate: Candidate;
  index: number;
}

export function CandidateCard({ candidate, index }: CandidateCardProps) {
  const navigate = useNavigate();
  const { name, initials, score, status, date, role, color, skills } = candidate;

  return (
    <Card
      glow
      padding="p-0"
      onClick={() => navigate(`/evaluation/${candidate.id}`)}
      className={`animate-fade-in delay-${Math.min(index + 1, 5) as 1 | 2 | 3 | 4 | 5}`}
      style={{ padding: "16px 18px" }}
    >
      {/* Header */}
      <div className="flex items-center" style={{ gap: 12, marginBottom: 14 }}>
        <Avatar initials={initials} size={38} color={color} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
          <div style={{ fontSize: 12, color: "var(--color-ink3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{role}</div>
        </div>
        <ScoreRing value={score} size={42} strokeWidth={2.5} />
      </div>

      {/* Status + Date */}
      <div className="flex items-center" style={{ gap: 8, marginBottom: 14 }}>
        <Badge variant={status} />
        <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 500, fontFamily: "var(--font-family-mono)", background: "var(--color-layer2)", color: "var(--color-ink3)" }}>
          {date}
        </span>
      </div>

      {/* Skills */}
      <SkillBar label="Technical"     value={skills.tech}          delay={0} />
      <SkillBar label="Behavioral"    value={skills.behavioral}    delay={1} />
      <SkillBar label="Communication" value={skills.communication} delay={2} />
    </Card>
  );
}
