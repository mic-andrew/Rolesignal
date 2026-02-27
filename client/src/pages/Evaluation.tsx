import { useParams, useNavigate } from "react-router-dom";
import {
  RiArrowLeftLine,
  RiCheckLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import { useEvaluation } from "../hooks/useEvaluation";
import { formatDate } from "../utils/formatDate";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Avatar } from "../components/ui/Avatar";
import { ScoreRing } from "../components/ui/ScoreRing";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { VerdictBadge } from "../components/shared/VerdictBadge";
import { PerformanceBar } from "../components/shared/PerformanceBar";
import { InsightCard } from "../components/shared/InsightCard";
import { TranscriptSlidePanel } from "../components/shared/TranscriptSlidePanel";

export default function Evaluation() {
  const navigate = useNavigate();
  const { candidateId } = useParams<{ candidateId?: string }>();
  const {
    evaluation,
    isLoading,
    error,
    role,
    prevCandidate,
    nextCandidate,
    insights,
    summary,
    selectedInsightIndex,
    selectInsight,
    isTranscriptOpen,
    highlightedTranscriptId,
  } = useEvaluation(candidateId ?? "1");

  if (isLoading) return <LoadingSkeleton rows={5} />;

  if (error || !evaluation) {
    return (
      <EmptyState
        title="No evaluation available"
        description="This candidate hasn't completed their interview yet. Evaluations are generated after the interview is finished."
        action={{ label: "Back to Scorecard", onClick: () => navigate("/scorecard") }}
      />
    );
  }

  const { candidate, confidence, criterionScores, transcript } = evaluation;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Back + breadcrumb */}
      <div className="flex items-center gap-3 animate-fade-in">
        <button
          onClick={() => navigate("/scorecard")}
          className="flex items-center gap-1.5 text-xs font-medium text-ink3 bg-transparent border-none cursor-pointer hover:text-ink transition-colors"
        >
          <RiArrowLeftLine size={14} />
          All candidates
        </button>
        {role && (
          <>
            <span className="text-[10px] text-edge3">/</span>
            <span className="text-xs font-semibold text-brand">{role.title}</span>
            <span className="text-[10px] text-edge3">/</span>
            <span className="text-xs text-ink">{candidate.name}</span>
          </>
        )}
      </div>

      {/* Header card */}
      <Card className="animate-fade-in px-6 py-5" padding="p-0">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Avatar initials={candidate.initials} size={50} color={candidate.color} />
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-ink">{candidate.name}</h1>
              <p className="text-[13px] text-ink3 mt-0.5">
                <span className="font-semibold text-brand2">{candidate.role}</span>
                &nbsp;&middot;&nbsp;Sophie&nbsp;&middot;&nbsp;{formatDate(candidate.date)}&nbsp;&middot;&nbsp;{candidate.duration} min
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ScoreRing value={candidate.score} size={52} strokeWidth={3} />
            <div className="text-center">
              <div className="text-[10px] font-semibold text-ink3 uppercase">Confidence</div>
              <div className="text-[17px] font-extrabold text-success font-mono">{confidence}%</div>
            </div>
            <VerdictBadge score={candidate.score} />
            <div className="w-px h-7 bg-edge" />
            <div className="flex gap-1.5">
              <Button variant="success" size="sm">
                <RiCheckLine size={14} />
                Approve
              </Button>
              <Button variant="danger" size="sm">Reject</Button>
            </div>
            <div className="w-px h-7 bg-edge" />
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => prevCandidate && navigate(`/evaluation/${prevCandidate.id}`)}
                className={prevCandidate ? "opacity-100" : "opacity-30 pointer-events-none"}
              >
                <RiArrowLeftSLine size={16} />
                Prev
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => nextCandidate && navigate(`/evaluation/${nextCandidate.id}`)}
                className={nextCandidate ? "opacity-100" : "opacity-30 pointer-events-none"}
              >
                Next
                <RiArrowRightSLine size={16} />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Overview */}
      <Card padding="p-0" className="px-6 py-5 animate-fade-in delay-1">
        <h3 className="text-[11px] font-bold text-ink3 mb-5 uppercase tracking-widest">
          Performance Overview
        </h3>
        <div className="space-y-3.5">
          {criterionScores.map((cs, i) => (
            <PerformanceBar key={cs.name} name={cs.name} score={cs.score} index={i} />
          ))}
        </div>
      </Card>

      {/* Evaluation Summary */}
      {summary && (
        <Card className="animate-fade-in delay-2">
          <h3 className="text-[11px] font-bold text-ink3 mb-3 uppercase tracking-widest">
            Evaluation Summary
          </h3>
          <p className="text-sm text-ink2 leading-[1.8]">{summary}</p>
        </Card>
      )}

      {/* Evidence-Based Insights */}
      <div className="animate-fade-in delay-3">
        <h3 className="text-[11px] font-bold text-ink3 mb-2 uppercase tracking-widest">
          Evidence-Based Insights
        </h3>
        <p className="text-[12px] text-ink3 mb-4">
          Select an insight to view the supporting transcript segment.
        </p>
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <InsightCard
              key={insight.criterionName}
              insight={insight}
              isSelected={selectedInsightIndex === i}
              onViewTranscript={() => selectInsight(i)}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Transcript slide panel */}
      <TranscriptSlidePanel
        isOpen={isTranscriptOpen}
        onClose={() => selectInsight(null)}
        messages={transcript}
        candidateName={candidate.name}
        candidateInitials={candidate.initials}
        candidateColor={candidate.color}
        highlightedMessageId={highlightedTranscriptId}
        selectedInsight={selectedInsightIndex !== null ? insights[selectedInsightIndex] ?? null : null}
      />
    </div>
  );
}
