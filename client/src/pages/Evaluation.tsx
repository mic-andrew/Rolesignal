import { useParams, useNavigate } from "react-router-dom";
import { RiCheckLine, RiArrowDownSLine, RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { useEvaluation } from "../hooks/useEvaluation";
import { CriteriaChart } from "../components/shared/CriteriaChart";
import { TranscriptPanel } from "../components/shared/TranscriptPanel";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Avatar } from "../components/ui/Avatar";
import { ScoreRing } from "../components/ui/ScoreRing";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";

export default function Evaluation() {
  const navigate = useNavigate();
  const { candidateId } = useParams<{ candidateId?: string }>();
  const {
    evaluation, isLoading, expandedIndex, toggleExpanded,
    role, prevCandidate, nextCandidate,
  } = useEvaluation(candidateId ?? "1");

  if (isLoading || !evaluation) return <LoadingSkeleton rows={5} />;

  const { candidate, confidence, criterionScores, transcript } = evaluation;

  return (
    <div>
      {/* Breadcrumb */}
      {role && (
        <div className="flex items-center animate-fade-in" style={{ gap: 6, marginBottom: 12 }}>
          <span
            onClick={() => navigate("/candidates")}
            className="cursor-pointer"
            style={{ fontSize: 12, color: "var(--color-ink3)" }}
          >
            Candidates
          </span>
          <span style={{ fontSize: 12, color: "var(--color-ink3)" }}>/</span>
          <span style={{ fontSize: 12, color: "var(--color-brand)", fontWeight: 600 }}>{role.title}</span>
          <span style={{ fontSize: 12, color: "var(--color-ink3)" }}>/</span>
          <span style={{ fontSize: 12, color: "var(--color-ink)" }}>{candidate.name}</span>
        </div>
      )}

      {/* Header card */}
      <Card
        className="flex items-center justify-between animate-fade-in"
        padding="p-0"
        style={{ padding: "18px 22px", marginBottom: 22 }}
      >
        <div className="flex items-center" style={{ gap: 14 }}>
          <Avatar initials={candidate.initials} size={46} color={candidate.color} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--color-ink)" }}>{candidate.name}</div>
            <div className="flex items-center" style={{ gap: 8, marginTop: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-brand2)" }}>{candidate.role}</span>
              <span style={{ fontSize: 12, color: "var(--color-ink3)" }}>&middot; {candidate.date} &middot; {candidate.duration} min</span>
            </div>
          </div>
        </div>
        <div className="flex items-center" style={{ gap: 16 }}>
          <ScoreRing value={candidate.score} size={52} strokeWidth={3} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--color-ink3)", textTransform: "uppercase" }}>Confidence</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "var(--color-success)", fontFamily: "var(--font-family-mono)" }}>{confidence}%</div>
          </div>
          <Badge variant={candidate.status} />
          <div className="flex" style={{ gap: 6 }}>
            <Button variant="success" size="sm"><RiCheckLine size={14} />Approve</Button>
            <Button variant="danger" size="sm">Reject</Button>
          </div>
          <div style={{ width: 1, height: 28, background: "var(--color-edge)", margin: "0 2px" }} />
          <div className="flex" style={{ gap: 4 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => prevCandidate && navigate(`/evaluation/${prevCandidate.id}`)}
              style={{ opacity: prevCandidate ? 1 : 0.3 }}
            >
              <RiArrowLeftSLine size={16} />Prev
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => nextCandidate && navigate(`/evaluation/${nextCandidate.id}`)}
              style={{ opacity: nextCandidate ? 1 : 0.3 }}
            >
              Next<RiArrowRightSLine size={16} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Main content */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>
        <div>
          {/* Criteria chart */}
          <Card padding="p-0" className="animate-fade-in delay-1" style={{ padding: 18, marginBottom: 14 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink2)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Criteria Profile
            </h3>
            <CriteriaChart
              criteria={criterionScores.map((s) => ({ name: s.name, score: s.score }))}
            />
          </Card>

          {/* Score cards */}
          {criterionScores.map((s, i) => (
            <Card
              key={s.name}
              glow
              padding="p-0"
              onClick={() => toggleExpanded(i)}
              className={`animate-fade-in delay-${Math.min(i + 2, 5) as 1|2|3|4|5}`}
              style={{ padding: "14px 18px", marginBottom: 8 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center" style={{ gap: 14 }}>
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 44, height: 44, borderRadius: 10, fontSize: 14, fontWeight: 800,
                      fontFamily: "var(--font-family-mono)",
                      background: s.score >= 90 ? "var(--grg)" : "var(--acg)",
                      color: s.score >= 90 ? "var(--color-success)" : "var(--color-brand)",
                    }}
                  >
                    {s.score}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "var(--color-ink3)" }}>Score: {s.score}/100</div>
                  </div>
                </div>
                <RiArrowDownSLine
                  size={18}
                  className="text-ink3 transition-transform duration-200"
                  style={{ transform: expandedIndex === i ? "rotate(180deg)" : "none" }}
                />
              </div>

              {expandedIndex === i && (
                <div className="animate-fade-in" style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--color-edge)" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-brand)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                    AI Rationale
                  </div>
                  <p style={{ fontSize: 13, color: "var(--color-ink2)", lineHeight: 1.65, marginBottom: 10 }}>{s.rationale}</p>
                  <div className="flex flex-wrap gap-2">
                    <span style={{ padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, color: "var(--color-brand)", background: "var(--acg)", cursor: "pointer" }}>
                      View transcript evidence
                    </span>
                    {s.riskFlags.length === 0 && (
                      <span style={{ padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, color: "var(--color-success)", background: "var(--grg)" }}>
                        No risk flags
                      </span>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Transcript panel */}
        <Card
          padding="p-0"
          className="animate-fade-in delay-3 flex flex-col"
          style={{ position: "sticky", top: 20, maxHeight: "calc(100vh - 180px)", alignSelf: "flex-start" }}
        >
          <div
            className="flex items-center justify-between shrink-0"
            style={{ padding: "12px 18px", borderBottom: "1px solid var(--color-edge)" }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>Transcript</span>
            <span
              style={{ fontFamily: "var(--font-family-mono)", fontSize: 11, fontWeight: 600, color: "var(--color-ink3)", padding: "2px 8px", borderRadius: 4, background: "var(--color-layer2)" }}
            >
              {candidate.duration}:14
            </span>
          </div>
          <TranscriptPanel messages={transcript} candidateName={candidate.name.split(" ")[0]} />
        </Card>
      </div>
    </div>
  );
}
