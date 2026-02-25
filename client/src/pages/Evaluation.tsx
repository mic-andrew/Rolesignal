import { useParams, useNavigate } from "react-router-dom";
import {
  RiCheckLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import { useEvaluation } from "../hooks/useEvaluation";
import { formatDate } from "../utils/formatDate";
import { CriteriaChart } from "../components/shared/CriteriaChart";
import { EvaluationCriterionCard } from "../components/shared/EvaluationCriterionCard";
import { TranscriptPanel } from "../components/shared/TranscriptPanel";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Avatar } from "../components/ui/Avatar";
import { ScoreRing } from "../components/ui/ScoreRing";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { EmptyState } from "../components/ui/EmptyState";

export default function Evaluation() {
  const navigate = useNavigate();
  const { candidateId } = useParams<{ candidateId?: string }>();
  const {
    evaluation,
    isLoading,
    error,
    expandedIndex,
    toggleExpanded,
    role,
    prevCandidate,
    nextCandidate,
  } = useEvaluation(candidateId ?? "1");

  if (isLoading) return <LoadingSkeleton rows={5} />;

  if (error || !evaluation) {
    return (
      <EmptyState
        title="No evaluation available"
        description="This candidate hasn't completed their interview yet. Evaluations are generated after the interview is finished."
        action={{
          label: "Back to Candidates",
          onClick: () => navigate("/candidates"),
        }}
      />
    );
  }

  const { candidate, confidence, criterionScores, transcript } = evaluation;

  return (
    <div className="space-y-8">
      {role && (
        <div className="flex items-center gap-1.5 animate-fade-in">
          <span
            onClick={() => navigate("/candidates")}
            className="cursor-pointer text-xs text-ink3"
          >
            Candidates
          </span>
          <span className="text-xs text-ink3">/</span>
          <span className="text-xs font-semibold text-brand">
            {role.title}
          </span>
          <span className="text-xs text-ink3">/</span>
          <span className="text-xs text-ink">{candidate.name}</span>
        </div>
      )}

      <Card
        className="flex items-center justify-between animate-fade-in px-6 py-5"
        padding="p-0"
      >
        <div className="flex items-center gap-3.5">
          <Avatar
            initials={candidate.initials}
            size={46}
            color={candidate.color}
          />
          <div>
            <div className="text-lg font-extrabold tracking-tight text-ink">
              {candidate.name}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[13px] font-semibold text-brand2">
                {candidate.role}
              </span>
              <span className="text-xs text-ink3">
                &middot; {formatDate(candidate.date)} &middot; {candidate.duration} min
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ScoreRing value={candidate.score} size={52} strokeWidth={3} />
          <div className="text-center">
            <div className="text-[10px] font-semibold text-ink3 uppercase">
              Confidence
            </div>
            <div className="text-[17px] font-extrabold text-success font-mono">
              {confidence}%
            </div>
          </div>
          <Badge variant={candidate.status} />
          <div className="flex gap-1.5">
            <Button variant="success" size="sm">
              <RiCheckLine size={14} />
              Approve
            </Button>
            <Button variant="danger" size="sm">
              Reject
            </Button>
          </div>
          <div className="w-px h-7 bg-edge mx-0.5" />
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                prevCandidate &&
                navigate(`/evaluation/${prevCandidate.id}`)
              }
              className={prevCandidate ? "opacity-100" : "opacity-30"}
            >
              <RiArrowLeftSLine size={16} />
              Prev
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                nextCandidate &&
                navigate(`/evaluation/${nextCandidate.id}`)
              }
              className={nextCandidate ? "opacity-100" : "opacity-30"}
            >
              Next
              <RiArrowRightSLine size={16} />
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-[1fr_400px] gap-8">
        <div className="space-y-5">
          <Card
            padding="p-0"
            className="animate-fade-in delay-1 p-5"
          >
            <h3 className="text-[13px] font-bold text-ink2 mb-4 uppercase tracking-widest">
              Criteria Profile
            </h3>
            <CriteriaChart
              criteria={criterionScores.map((s) => ({
                name: s.name,
                score: s.score,
              }))}
            />
          </Card>

          {criterionScores.map((s, i) => (
            <EvaluationCriterionCard
              key={s.name}
              criterion={s}
              isExpanded={expandedIndex === i}
              onToggle={() => toggleExpanded(i)}
              index={i}
            />
          ))}
        </div>

        <Card
          padding="p-0"
          className="animate-fade-in delay-3 flex flex-col sticky top-5 self-start max-h-[calc(100vh-180px)]"
        >
          <div className="flex items-center justify-between shrink-0 px-5 py-3.5 border-b border-edge">
            <span className="text-sm font-bold text-ink">Transcript</span>
            <span className="font-mono text-[11px] font-semibold text-ink3 py-0.5 px-2 rounded bg-layer2">
              {candidate.duration}:00
            </span>
          </div>
          <TranscriptPanel
            messages={transcript}
            candidateName={candidate.name.split(" ")[0]}
          />
        </Card>
      </div>
    </div>
  );
}
