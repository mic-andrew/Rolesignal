import { useNavigate } from "react-router-dom";
import type { Candidate } from "../../types";
import { formatDate } from "../../utils/formatDate";
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
      className={`animate-fade-in delay-${Math.min(index + 1, 10)} px-6 py-5`}
    >
      <div className="flex items-center gap-3.5 mb-4">
        <Avatar initials={initials} size={42} color={color} />
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-bold text-ink overflow-hidden text-ellipsis whitespace-nowrap">{name}</div>
          <div className="text-[13px] text-ink3 mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">{role}</div>
        </div>
        <ScoreRing value={score} size={46} strokeWidth={2.5} />
      </div>

      <div className="flex items-center gap-2.5 mb-4 pb-4 border-b border-edge">
        <Badge variant={status} />
        <span className="px-2.5 py-0.5 rounded text-[11px] font-medium font-mono bg-layer2 text-ink3">
          {formatDate(date)}
        </span>
      </div>

      <SkillBar label="Technical"     value={skills.tech}          delay={0} />
      <SkillBar label="Behavioral"    value={skills.behavioral}    delay={1} />
      <SkillBar label="Communication" value={skills.communication} delay={2} />
    </Card>
  );
}
