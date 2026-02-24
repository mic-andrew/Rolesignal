import { RiArrowRightLine, RiArrowLeftLine, RiLoader4Line, RiAddLine } from "react-icons/ri";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { StepRail } from "../components/shared/StepRail";
import { CriteriaCard } from "../components/shared/CriteriaCard";
import { useOnboarding } from "../hooks/useOnboarding";
import type { RoleSeniority } from "../types";

const STEPS = ["Interview Role", "Criteria", "First Candidate"];

const SUBTITLES = [
  "Define the role you're hiring for",
  "Set evaluation criteria and weights",
  "Add a candidate to interview",
];

const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  background: "var(--color-layer)",
  border: "1px solid var(--color-edge)",
  borderRadius: 8,
  color: "var(--color-ink)",
  fontSize: 13,
  outline: "none",
};

export default function Onboarding() {
  const hook = useOnboarding();

  return (
    <div className="flex items-center justify-center" style={{ minHeight: "100vh", background: "var(--color-canvas)" }}>
      <div className="animate-fade-in" style={{ width: "100%", maxWidth: 600, padding: 32 }}>
        <h1 className="text-center" style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6, color: "var(--color-ink)" }}>
          Set up your workspace
        </h1>
        <p className="text-center text-sm mb-8" style={{ color: "var(--color-ink3)" }}>
          {SUBTITLES[hook.step]}
        </p>

        <StepRail steps={STEPS} current={hook.step} onStepClick={() => {}} />

        <Card style={{ marginTop: 24, padding: 24 }}>
          {/* Step 0: Interview Role */}
          {hook.step === 0 && (
            <div className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-ink2)" }}>Role Title</label>
                <input style={fieldStyle} placeholder="Senior Frontend Engineer" value={hook.roleTitle} onChange={(e) => hook.setRoleTitle(e.target.value)} />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-ink2)" }}>Department</label>
                  <input style={fieldStyle} value={hook.department} onChange={(e) => hook.setDepartment(e.target.value)} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-ink2)" }}>Seniority</label>
                  <select
                    style={{ ...fieldStyle, appearance: "none" }}
                    value={hook.seniority}
                    onChange={(e) => hook.setSeniority(e.target.value as RoleSeniority)}
                  >
                    {(["Junior", "Mid", "Senior", "Lead"] as const).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-ink2)" }}>Location</label>
                <input style={fieldStyle} value={hook.location} onChange={(e) => hook.setLocation(e.target.value)} />
              </div>
            </div>
          )}

          {/* Step 1: Criteria */}
          {hook.step === 1 && (
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ink2)" }}>
                  Total weight: <span style={{ color: hook.totalWeight === 100 ? "var(--color-success)" : "var(--color-warn)", fontFamily: "var(--font-family-mono)" }}>{hook.totalWeight}%</span>
                </span>
                <Button variant="ghost" size="sm" onClick={hook.addCriterion} type="button">
                  <RiAddLine size={14} /> Add
                </Button>
              </div>

              {/* Weight bar */}
              <div style={{ borderRadius: 6, marginBottom: 14, height: 6, background: "var(--color-edge)", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${Math.min(hook.totalWeight, 100)}%`,
                  background: hook.totalWeight === 100 ? "var(--color-success)" : "var(--color-brand)",
                  borderRadius: 6,
                  transition: "width 0.3s, background 0.3s",
                }} />
              </div>

              {hook.criteria.map((c) => (
                <CriteriaCard
                  key={c.id}
                  criterion={c}
                  onWeightChange={hook.updateWeight}
                  onNameChange={hook.updateCriterionName}
                  onDescriptionChange={hook.updateCriterionDescription}
                  onRemove={hook.removeCriterion}
                />
              ))}
            </div>
          )}

          {/* Step 2: First Candidate */}
          {hook.step === 2 && (
            <div className="flex flex-col gap-3.5">
              <p style={{ fontSize: 13, color: "var(--color-ink3)", marginBottom: 4 }}>
                Add a candidate to send the first interview. You can skip this and add candidates later.
              </p>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-ink2)" }}>Candidate Name</label>
                <input style={fieldStyle} placeholder="Jane Smith" value={hook.candidateName} onChange={(e) => hook.setCandidateName(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-ink2)" }}>Candidate Email</label>
                <input type="email" style={fieldStyle} placeholder="jane@example.com" value={hook.candidateEmail} onChange={(e) => hook.setCandidateEmail(e.target.value)} />
              </div>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-5">
          <div>
            {hook.step > 0 && (
              <Button variant="ghost" onClick={hook.prevStep} type="button">
                <RiArrowLeftLine size={14} />
                Back
              </Button>
            )}
          </div>
          <Button onClick={hook.submitStep} disabled={hook.isPending}>
            {hook.isPending ? (
              <RiLoader4Line size={16} className="animate-spin" />
            ) : hook.step === 2 ? (
              <>Complete Setup <RiArrowRightLine size={14} /></>
            ) : (
              <>Continue <RiArrowRightLine size={14} /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
