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

const INPUT_CLS =
  "w-full px-3.5 py-[11px] bg-[var(--color-layer)] border border-[var(--color-edge)] rounded-lg text-[var(--color-ink)] text-[13px] outline-none";

export default function Onboarding() {
  const hook = useOnboarding();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-canvas)]">
      <div className="animate-fade-in w-full max-w-[600px] p-8">
        <h1 className="text-center text-[28px] font-extrabold tracking-tight mb-1.5 text-[var(--color-ink)]">
          Set up your workspace
        </h1>
        <p className="text-center text-sm mb-8 text-[var(--color-ink3)]">
          {SUBTITLES[hook.step]}
        </p>

        <StepRail steps={STEPS} current={hook.step} onStepClick={() => {}} />

        <Card padding="p-0" className="mt-6 p-6">
          {/* Step 0: Interview Role */}
          {hook.step === 0 && (
            <div className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[var(--color-ink2)]">Role Title</label>
                <input className={INPUT_CLS} placeholder="Senior Frontend Engineer" value={hook.roleTitle} onChange={(e) => hook.setRoleTitle(e.target.value)} />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold mb-1.5 text-[var(--color-ink2)]">Department</label>
                  <input className={INPUT_CLS} value={hook.department} onChange={(e) => hook.setDepartment(e.target.value)} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold mb-1.5 text-[var(--color-ink2)]">Seniority</label>
                  <select
                    className={`${INPUT_CLS} appearance-none`}
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
                <label className="block text-xs font-semibold mb-1.5 text-[var(--color-ink2)]">Location</label>
                <input className={INPUT_CLS} value={hook.location} onChange={(e) => hook.setLocation(e.target.value)} />
              </div>
            </div>
          )}

          {/* Step 1: Criteria */}
          {hook.step === 1 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-semibold text-[var(--color-ink2)]">
                  Total weight: <span className={`font-mono ${hook.totalWeight === 100 ? "text-[var(--color-success)]" : "text-[var(--color-warn)]"}`}>{hook.totalWeight}%</span>
                </span>
                <Button variant="ghost" size="sm" onClick={hook.addCriterion} type="button">
                  <RiAddLine size={14} /> Add
                </Button>
              </div>

              {/* Weight bar */}
              <div className="rounded-md mb-3.5 h-1.5 bg-[var(--color-edge)] overflow-hidden">
                <div
                  className={`h-full rounded-md transition-all duration-300 ${hook.totalWeight === 100 ? "bg-[var(--color-success)]" : "bg-[var(--color-brand)]"}`}
                  style={{ width: `${Math.min(hook.totalWeight, 100)}%` }}
                />
              </div>

              {hook.criteria.map((c) => (
                <CriteriaCard
                  key={c.id}
                  criterion={c}
                  onWeightChange={hook.updateWeight}
                  onNameChange={hook.updateCriterionName}
                  onDescriptionChange={hook.updateCriterionDescription}
                  onRemove={hook.removeCriterion}
                  onAddSub={() => {}}
                  onUpdateSub={() => {}}
                  onRemoveSub={() => {}}
                />
              ))}
            </div>
          )}

          {/* Step 2: First Candidate */}
          {hook.step === 2 && (
            <div className="flex flex-col gap-3.5">
              <p className="text-[13px] text-[var(--color-ink3)] mb-1">
                Add a candidate to send the first interview. You can skip this and add candidates later.
              </p>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[var(--color-ink2)]">Candidate Name</label>
                <input className={INPUT_CLS} placeholder="Jane Smith" value={hook.candidateName} onChange={(e) => hook.setCandidateName(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[var(--color-ink2)]">Candidate Email</label>
                <input type="email" className={INPUT_CLS} placeholder="jane@example.com" value={hook.candidateEmail} onChange={(e) => hook.setCandidateEmail(e.target.value)} />
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
