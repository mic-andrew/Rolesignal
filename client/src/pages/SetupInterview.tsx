import { RiArrowLeftLine, RiArrowRightLine, RiAddLine, RiUpload2Line, RiGroupLine } from "react-icons/ri";
import { useSetupInterview } from "../hooks/useSetupInterview";
import { StepRail } from "../components/shared/StepRail";
import { CriteriaCard } from "../components/shared/CriteriaCard";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const STEPS = ["Create Role", "Job Description", "Criteria", "Configure", "Invite", "Review & Preview"];
const DURATIONS = [15, 30, 45, 60] as const;
const TONES = [
  { label: "Professional",    desc: "Formal and structured"   },
  { label: "Conversational",  desc: "Warm and natural"        },
  { label: "Challenging",     desc: "Probing and rigorous"    },
] as const;

const inputCls: React.CSSProperties = {
  width: "100%", padding: "11px 14px",
  background: "var(--color-canvas2)", border: "1px solid var(--color-edge)",
  borderRadius: 8, color: "var(--color-ink)", fontSize: 13, outline: "none",
};

export default function SetupInterview() {
  const hook = useSetupInterview();

  return (
    <div>
      <StepRail steps={STEPS} current={hook.step} onStepClick={hook.goToStep} />

      <div style={{ maxWidth: 700, margin: "0 auto" }} key={hook.step} className="animate-fade-in-scale">
        {/* Step 0 – Create Role */}
        {hook.step === 0 && (
          <Card padding="p-0" style={{ padding: 30 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--color-ink)", marginBottom: 22 }}>Create Role</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-ink2)", marginBottom: 6 }}>Role Title</label>
                <input style={inputCls} value={hook.roleData.roleTitle} onChange={(e) => hook.setRoleTitle(e.target.value)} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-ink2)", marginBottom: 6 }}>Department</label>
                <input style={inputCls} value={hook.roleData.department} onChange={(e) => hook.setDepartment(e.target.value)} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-ink2)", marginBottom: 6 }}>Seniority</label>
                <div className="flex" style={{ borderRadius: 8, overflow: "hidden", border: "1px solid var(--color-edge)" }}>
                  {(["Junior","Mid","Senior","Lead"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => hook.setSeniority(s)}
                      className="flex-1 cursor-pointer border-0 transition-all"
                      style={{
                        padding: "10px 0", textAlign: "center", fontSize: 12, fontWeight: 600,
                        background: hook.roleData.seniority === s ? "var(--color-brand)" : "var(--color-layer)",
                        color: hook.roleData.seniority === s ? "#fff" : "var(--color-ink3)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-ink2)", marginBottom: 6 }}>Location</label>
                <input style={inputCls} value={hook.roleData.location} onChange={(e) => hook.setLocation(e.target.value)} />
              </div>
            </div>
          </Card>
        )}

        {/* Step 1 – Job Description */}
        {hook.step === 1 && (
          <Card padding="p-0" style={{ padding: 30 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--color-ink)", marginBottom: 6 }}>Job Description</h3>
            <p style={{ fontSize: 13, color: "var(--color-ink3)", marginBottom: 22 }}>Paste or upload your JD. AI will extract criteria automatically.</p>
            <div
              className="text-center cursor-pointer transition-all"
              style={{ border: "2px dashed var(--color-edge2)", borderRadius: 16, padding: 36, background: "var(--color-canvas2)", marginBottom: 20 }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-brand)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-edge2)")}
            >
              <RiUpload2Line size={20} style={{ color: "var(--color-brand)", opacity: 0.8, marginBottom: 10 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-ink)" }}>Drop file here or click to upload</div>
              <div style={{ fontSize: 12, color: "var(--color-ink3)", marginTop: 4 }}>PDF, DOCX, or TXT</div>
            </div>
            <div className="flex items-center" style={{ gap: 14, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: "var(--color-edge)" }} />
              <span style={{ fontSize: 11, color: "var(--color-ink3)", fontWeight: 500 }}>or paste text</span>
              <div style={{ flex: 1, height: 1, background: "var(--color-edge)" }} />
            </div>
            <textarea
              style={{ ...inputCls, resize: "vertical", minHeight: 120 }}
              placeholder="Paste job description here..."
              value={hook.jobDescription}
              onChange={(e) => hook.setJobDescription(e.target.value)}
            />
          </Card>
        )}

        {/* Step 2 – Criteria */}
        {hook.step === 2 && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--color-ink)" }}>Evaluation Criteria</h3>
              <p style={{ fontSize: 13, color: "var(--color-ink3)", marginTop: 4 }}>Paste criteria text or upload a document, then adjust weights.</p>
            </div>

            {/* Input section */}
            <Card padding="p-0" style={{ padding: 20, marginBottom: 18 }}>
              <textarea
                style={{ ...inputCls, resize: "vertical", minHeight: 80 }}
                placeholder="Paste evaluation criteria here..."
                value={hook.criteriaInputText}
                onChange={(e) => hook.setCriteriaInputText(e.target.value)}
              />
              <div className="flex items-center" style={{ gap: 14, margin: "14px 0" }}>
                <div style={{ flex: 1, height: 1, background: "var(--color-edge)" }} />
                <span style={{ fontSize: 11, color: "var(--color-ink3)", fontWeight: 500 }}>or</span>
                <div style={{ flex: 1, height: 1, background: "var(--color-edge)" }} />
              </div>
              <div
                className="text-center cursor-pointer transition-all"
                style={{ border: "2px dashed var(--color-edge2)", borderRadius: 12, padding: 24, background: "var(--color-canvas2)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-brand)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-edge2)")}
              >
                <RiUpload2Line size={18} style={{ color: "var(--color-brand)", opacity: 0.8, marginBottom: 6 }} />
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ink)" }}>Drop file here or click to upload</div>
                <div style={{ fontSize: 11, color: "var(--color-ink3)", marginTop: 3 }}>PDF, DOCX, or TXT</div>
              </div>
              <div style={{ marginTop: 14, textAlign: "right" }}>
                <Button onClick={hook.parseCriteria} style={{ opacity: hook.isParsing ? 0.7 : 1 }}>
                  {hook.isParsing ? "Extracting..." : "Extract Criteria"}
                </Button>
              </div>
            </Card>

            {/* Weight bar */}
            <div style={{ borderRadius: 6, marginBottom: 14, height: 6, background: "var(--color-edge)", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(hook.totalWeight, 100)}%`,
                  background: hook.totalWeight === 100 ? "var(--color-success)" : "var(--color-brand)",
                  borderRadius: 6,
                  transition: "width 0.3s, background 0.3s",
                }}
              />
            </div>

            {/* Criteria cards */}
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

            <div className="flex items-center justify-between" style={{ marginTop: 10 }}>
              <Button variant="ghost" size="sm" onClick={hook.addCriterion}>
                <RiAddLine size={14} />Add Criterion
              </Button>
              <p style={{ fontSize: 12, color: "var(--color-ink3)" }}>
                Total weight: <span style={{ fontFamily: "var(--font-family-mono)", fontWeight: 700, color: hook.totalWeight === 100 ? "var(--color-success)" : "var(--color-warn)" }}>{hook.totalWeight}%</span>
              </p>
            </div>
          </div>
        )}

        {/* Step 3 – Configure */}
        {hook.step === 3 && (
          <Card padding="p-0" style={{ padding: 30 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--color-ink)", marginBottom: 22 }}>Interview Configuration</h3>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-ink2)", marginBottom: 10 }}>Duration</label>
              <div className="flex" style={{ gap: 10 }}>
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => hook.setConfig({ ...hook.config, duration: d })}
                    className="flex-1 cursor-pointer transition-all"
                    style={{
                      padding: "16px 0", textAlign: "center", borderRadius: 12,
                      border: hook.config.duration === d ? "2px solid var(--color-brand)" : "1px solid var(--color-edge)",
                      background: hook.config.duration === d ? "var(--acg)" : "var(--color-layer)",
                    }}
                  >
                    <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: hook.config.duration === d ? "var(--color-brand)" : "var(--color-ink)" }}>{d}</div>
                    <div style={{ fontSize: 11, color: "var(--color-ink3)", fontWeight: 500 }}>minutes</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-ink2)", marginBottom: 10 }}>AI Tone</label>
              <div className="flex" style={{ gap: 10 }}>
                {TONES.map(({ label, desc }) => (
                  <button
                    key={label}
                    onClick={() => hook.setConfig({ ...hook.config, tone: label })}
                    className="flex-1 cursor-pointer text-center transition-all"
                    style={{
                      padding: 16, borderRadius: 12,
                      border: hook.config.tone === label ? "2px solid var(--color-brand)" : "1px solid var(--color-edge)",
                      background: hook.config.tone === label ? "var(--acg)" : "var(--color-layer)",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3, color: hook.config.tone === label ? "var(--color-brand)" : "var(--color-ink)" }}>{label}</div>
                    <div style={{ fontSize: 11, color: "var(--color-ink3)" }}>{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between" style={{ padding: 16, background: "var(--color-canvas2)", borderRadius: 12, border: "1px solid var(--color-edge)" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-ink)" }}>Adaptive Difficulty</div>
                <div style={{ fontSize: 12, color: "var(--color-ink3)", marginTop: 2 }}>AI adjusts question depth based on candidate responses</div>
              </div>
              <button
                onClick={() => hook.setConfig({ ...hook.config, adaptiveDifficulty: !hook.config.adaptiveDifficulty })}
                className="border-0 cursor-pointer shrink-0"
                style={{
                  width: 44, height: 24, borderRadius: 12, padding: 2, transition: "background 0.2s",
                  background: hook.config.adaptiveDifficulty ? "var(--color-brand)" : "var(--color-edge2)",
                  boxShadow: hook.config.adaptiveDifficulty ? "0 0 10px rgba(124,111,255,0.3)" : "none",
                }}
              >
                <div style={{ width: 20, height: 20, borderRadius: 10, background: "#fff", marginLeft: hook.config.adaptiveDifficulty ? 20 : 0, transition: "margin 0.2s" }} />
              </button>
            </div>
          </Card>
        )}

        {/* Step 4 – Invite */}
        {hook.step === 4 && (
          <Card padding="p-0" style={{ padding: 30 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--color-ink)", marginBottom: 6 }}>Invite Candidates</h3>
            <p style={{ fontSize: 13, color: "var(--color-ink3)", marginBottom: 20 }}>Add candidate emails. Each receives a unique interview link.</p>

            <div className="flex flex-wrap" style={{ gap: 8, padding: 12, background: "var(--color-canvas2)", border: "1px solid var(--color-edge)", borderRadius: 8, marginBottom: 20, minHeight: 48 }}>
              {hook.emails.map((email) => (
                <span key={email} className="inline-flex items-center" style={{ gap: 6, padding: "5px 10px", background: "var(--color-layer2)", borderRadius: 6, fontSize: 12, fontWeight: 500, color: "var(--color-ink)" }}>
                  {email}
                  <button onClick={() => hook.removeEmail(email)} className="cursor-pointer border-0 bg-transparent leading-none" style={{ color: "var(--color-ink3)", fontSize: 14 }}>&times;</button>
                </span>
              ))}
              <input
                style={{ flex: 1, minWidth: 180, border: "none", background: "transparent", color: "var(--color-ink)", fontSize: 13, outline: "none" }}
                placeholder="Add email..."
                onKeyDown={(e) => { if (e.key === "Enter") { hook.addEmail(e.currentTarget.value); e.currentTarget.value = ""; } }}
              />
            </div>

            <div className="glass flex items-center" style={{ gap: 12, padding: 16, borderRadius: 12 }}>
              <RiGroupLine size={18} style={{ color: "var(--color-brand)" }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ink)" }}>{hook.emails.length} candidates ready to invite</div>
                <div style={{ fontSize: 12, color: "var(--color-ink3)" }}>Each receives a personalized interview link</div>
              </div>
            </div>
          </Card>
        )}

        {/* Step 5 – Review & Preview */}
        {hook.step === 5 && (
          <Card padding="p-0" style={{ padding: 36, textAlign: "center" }}>
            <div className="flex items-center justify-center animate-glow" style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, var(--acg), var(--acg2))", border: "2px solid rgba(124,111,255,0.2)", margin: "0 auto 20px" }}>
              <span style={{ fontSize: 30 }}>&#10022;</span>
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--color-ink)", marginBottom: 8 }}>Ready to Launch</h3>
            <p style={{ fontSize: 14, color: "var(--color-ink2)", maxWidth: 380, margin: "0 auto 24px" }}>
              {hook.roleData.roleTitle || "Untitled Role"} &mdash; {hook.config.duration}-minute {hook.config.tone.toLowerCase()} AI interview{hook.emails.length > 0 ? ` with ${hook.emails.length} candidate${hook.emails.length !== 1 ? "s" : ""}` : ""}.
            </p>

            <div className="flex justify-center" style={{ gap: 10, marginBottom: 28 }}>
              {[
                { l: "Criteria", v: hook.criteria.length },
                { l: "Duration",     v: `${hook.config.duration}m` },
                { l: "Candidates",   v: hook.emails.length },
                { l: "Questions",    v: `~${hook.criteria.reduce((s, c) => s + c.questionCount, 0)}` },
              ].filter((s) => !(s.l === "Candidates" && s.v === 0)).map((s) => (
                <div key={s.l} style={{ padding: "14px 20px", background: "var(--color-canvas2)", borderRadius: 12, border: "1px solid var(--color-edge)", minWidth: 80 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-family-mono)", color: "var(--color-brand)" }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: "var(--color-ink3)", fontWeight: 500, marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-center" style={{ gap: 12 }}>
              <Button size="lg" onClick={() => hook.submitRole()} style={{ opacity: hook.submitPending ? 0.7 : 1 }}>
                {hook.submitPending ? "Creating..." : "Create Role"}<RiArrowRightLine size={14} />
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Nav buttons */}
      <div className="flex justify-between" style={{ maxWidth: 700, margin: "22px auto 0" }}>
        <Button variant="ghost" onClick={hook.prevStep} style={{ opacity: hook.step === 0 ? 0.3 : 1 }}>
          <RiArrowLeftLine size={14} />Back
        </Button>
        {hook.step < 5 && (
          <Button onClick={hook.nextStep}>
            Continue<RiArrowRightLine size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
