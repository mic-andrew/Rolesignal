import { useState } from "react";
import { RiArrowLeftLine, RiArrowRightLine, RiAddLine, RiUpload2Line, RiGroupLine, RiDeleteBinLine, RiRocketLine } from "react-icons/ri";
import { useSetupInterview } from "../hooks/useSetupInterview";
import { StepRail } from "../components/shared/StepRail";
import { CriteriaCard } from "../components/shared/CriteriaCard";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const STEPS = ["Role Details", "Job Description", "Criteria", "Configure", "Invite & Launch"];
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
  const {
    step, nextStep, prevStep, goToStep,
    roleData, setRoleTitle, setDepartment, setSeniority,
    jobDescription, setJobDescription, handleJdUpload, isUploading, fileInputRef,
    criteria, updateWeight, totalWeight, updateCriterionName, updateCriterionDescription,
    addCriterion, removeCriterion, isParsing, extractCriteria,
    config, setConfig,
    candidates, addCandidate, removeCandidate,
    launch, launchPending,
  } = useSetupInterview();

  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");

  const handleAddCandidate = () => {
    addCandidate(candidateName, candidateEmail);
    setCandidateName("");
    setCandidateEmail("");
  };

  return (
    <div>
      <StepRail steps={STEPS} current={step} onStepClick={goToStep} />

      <div style={{ maxWidth: 700, margin: "0 auto" }} key={step} className="animate-fade-in-scale">
        {/* Step 0 – Role Details */}
        {step === 0 && (
          <Card padding="p-0" style={{ padding: 30 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--color-ink)", marginBottom: 22 }}>Role Details</h3>
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-ink2)", marginBottom: 6 }}>Role Title</label>
                <input style={inputCls} placeholder="e.g. Senior Frontend Engineer" value={roleData.roleTitle} onChange={(e) => setRoleTitle(e.target.value)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-ink2)", marginBottom: 6 }}>Department</label>
                  <input style={inputCls} value={roleData.department} onChange={(e) => setDepartment(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-ink2)", marginBottom: 6 }}>Seniority</label>
                  <div className="flex" style={{ borderRadius: 8, overflow: "hidden", border: "1px solid var(--color-edge)" }}>
                    {(["Junior","Mid","Senior","Lead"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSeniority(s)}
                        className="flex-1 cursor-pointer border-0 transition-all"
                        style={{
                          padding: "10px 0", textAlign: "center", fontSize: 12, fontWeight: 600,
                          background: roleData.seniority === s ? "var(--color-brand)" : "var(--color-layer)",
                          color: roleData.seniority === s ? "#fff" : "var(--color-ink3)",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Step 1 – Job Description */}
        {step === 1 && (
          <Card padding="p-0" style={{ padding: 30 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--color-ink)", marginBottom: 6 }}>Job Description</h3>
            <p style={{ fontSize: 13, color: "var(--color-ink3)", marginBottom: 22 }}>
              {jobDescription ? "Edit the description below, or clear it to upload a new file." : "Upload a file or paste the JD. We'll extract evaluation criteria from it."}
            </p>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleJdUpload(file);
                e.target.value = "";
              }}
            />

            {/* Upload zone — only show when no text yet */}
            {!jobDescription && (
              <>
                <div
                  className="text-center cursor-pointer transition-all"
                  style={{
                    border: "2px dashed var(--color-edge2)", borderRadius: 16, padding: 36,
                    background: "var(--color-canvas2)", marginBottom: 20,
                    opacity: isUploading ? 0.6 : 1,
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--color-brand)"; }}
                  onDragLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-edge2)"; }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = "var(--color-edge2)";
                    const file = e.dataTransfer.files[0];
                    if (file) handleJdUpload(file);
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-brand)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-edge2)")}
                >
                  <RiUpload2Line size={20} style={{ color: "var(--color-brand)", opacity: 0.8, marginBottom: 10 }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-ink)" }}>
                    {isUploading ? "Extracting text..." : "Drop file here or click to upload"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-ink3)", marginTop: 4 }}>PDF, DOCX, or TXT</div>
                </div>

                <div className="flex items-center" style={{ gap: 14, marginBottom: 16 }}>
                  <div style={{ flex: 1, height: 1, background: "var(--color-edge)" }} />
                  <span style={{ fontSize: 11, color: "var(--color-ink3)", fontWeight: 500 }}>or paste text</span>
                  <div style={{ flex: 1, height: 1, background: "var(--color-edge)" }} />
                </div>
              </>
            )}

            <textarea
              style={{ ...inputCls, resize: "vertical", minHeight: jobDescription ? 240 : 140 }}
              placeholder="Paste job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            {jobDescription && (
              <div className="flex items-center justify-between" style={{ marginTop: 12 }}>
                <Button variant="ghost" size="sm" onClick={() => setJobDescription("")}>
                  Clear &amp; Re-upload
                </Button>
                <span style={{ fontSize: 12, color: "var(--color-ink3)" }}>
                  {jobDescription.length.toLocaleString()} characters
                </span>
              </div>
            )}
          </Card>
        )}

        {/* Step 2 – Criteria */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--color-ink)" }}>Evaluation Criteria</h3>
              <p style={{ fontSize: 13, color: "var(--color-ink3)", marginTop: 4 }}>
                {criteria.length === 0
                  ? "Extract criteria from your job description, or add them manually."
                  : "Adjust weights and descriptions. Total must equal 100%."}
              </p>
            </div>

            {criteria.length === 0 && (
              <Card padding="p-0" style={{ padding: 24, marginBottom: 18, textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "var(--color-ink3)", marginBottom: 16 }}>
                  {jobDescription
                    ? "Click below to extract criteria from your job description."
                    : "Go back and add a job description, or add criteria manually."}
                </p>
                <div className="flex justify-center" style={{ gap: 10 }}>
                  {jobDescription && (
                    <Button onClick={extractCriteria} style={{ opacity: isParsing ? 0.7 : 1 }}>
                      {isParsing ? "Extracting..." : "Extract from JD"}
                    </Button>
                  )}
                  <Button variant="ghost" onClick={addCriterion}>
                    <RiAddLine size={14} />Add Manually
                  </Button>
                </div>
              </Card>
            )}

            {criteria.length > 0 && (
              <>
                {jobDescription && (
                  <div style={{ marginBottom: 14, textAlign: "right" }}>
                    <Button variant="ghost" size="sm" onClick={extractCriteria} style={{ opacity: isParsing ? 0.7 : 1 }}>
                      {isParsing ? "Extracting..." : "Re-extract from JD"}
                    </Button>
                  </div>
                )}

                {/* Weight bar */}
                <div style={{ borderRadius: 6, marginBottom: 14, height: 6, background: "var(--color-edge)", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(totalWeight, 100)}%`,
                      background: totalWeight === 100 ? "var(--color-success)" : "var(--color-brand)",
                      borderRadius: 6,
                      transition: "width 0.3s, background 0.3s",
                    }}
                  />
                </div>

                {criteria.map((c) => (
                  <CriteriaCard
                    key={c.id}
                    criterion={c}
                    onWeightChange={updateWeight}
                    onNameChange={updateCriterionName}
                    onDescriptionChange={updateCriterionDescription}
                    onRemove={removeCriterion}
                  />
                ))}

                <div className="flex items-center justify-between" style={{ marginTop: 10 }}>
                  <Button variant="ghost" size="sm" onClick={addCriterion}>
                    <RiAddLine size={14} />Add Criterion
                  </Button>
                  <p style={{ fontSize: 12, color: "var(--color-ink3)" }}>
                    Total weight: <span style={{ fontFamily: "var(--font-family-mono)", fontWeight: 700, color: totalWeight === 100 ? "var(--color-success)" : "var(--color-warn)" }}>{totalWeight}%</span>
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 3 – Configure */}
        {step === 3 && (
          <Card padding="p-0" style={{ padding: 30 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--color-ink)", marginBottom: 22 }}>Interview Configuration</h3>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-ink2)", marginBottom: 10 }}>Duration</label>
              <div className="flex" style={{ gap: 10 }}>
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setConfig({ ...config, duration: d })}
                    className="flex-1 cursor-pointer transition-all"
                    style={{
                      padding: "16px 0", textAlign: "center", borderRadius: 12,
                      border: config.duration === d ? "2px solid var(--color-brand)" : "1px solid var(--color-edge)",
                      background: config.duration === d ? "var(--acg)" : "var(--color-layer)",
                    }}
                  >
                    <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: config.duration === d ? "var(--color-brand)" : "var(--color-ink)" }}>{d}</div>
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
                    onClick={() => setConfig({ ...config, tone: label })}
                    className="flex-1 cursor-pointer text-center transition-all"
                    style={{
                      padding: 16, borderRadius: 12,
                      border: config.tone === label ? "2px solid var(--color-brand)" : "1px solid var(--color-edge)",
                      background: config.tone === label ? "var(--acg)" : "var(--color-layer)",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3, color: config.tone === label ? "var(--color-brand)" : "var(--color-ink)" }}>{label}</div>
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
                onClick={() => setConfig({ ...config, adaptiveDifficulty: !config.adaptiveDifficulty })}
                className="border-0 cursor-pointer shrink-0"
                style={{
                  width: 44, height: 24, borderRadius: 12, padding: 2, transition: "background 0.2s",
                  background: config.adaptiveDifficulty ? "var(--color-brand)" : "var(--color-edge2)",
                  boxShadow: config.adaptiveDifficulty ? "0 0 10px rgba(124,111,255,0.3)" : "none",
                }}
              >
                <div style={{ width: 20, height: 20, borderRadius: 10, background: "#fff", marginLeft: config.adaptiveDifficulty ? 20 : 0, transition: "margin 0.2s" }} />
              </button>
            </div>
          </Card>
        )}

        {/* Step 4 – Invite & Launch */}
        {step === 4 && (
          <div>
            <Card padding="p-0" style={{ padding: 30, marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--color-ink)", marginBottom: 6 }}>Invite Candidates</h3>
              <p style={{ fontSize: 13, color: "var(--color-ink3)", marginBottom: 20 }}>Add candidates who will each receive a unique interview link via email.</p>

              {/* Add candidate form */}
              <div className="flex" style={{ gap: 10, marginBottom: 16 }}>
                <input
                  style={{ ...inputCls, flex: 1 }}
                  placeholder="Candidate name"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && candidateEmail) handleAddCandidate(); }}
                />
                <input
                  style={{ ...inputCls, flex: 1 }}
                  placeholder="Email address"
                  type="email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && candidateName) handleAddCandidate(); }}
                />
                <Button onClick={handleAddCandidate} style={{ flexShrink: 0 }}>
                  <RiAddLine size={14} />Add
                </Button>
              </div>

              {/* Candidate list */}
              {candidates.length > 0 && (
                <div style={{ borderRadius: 8, border: "1px solid var(--color-edge)", overflow: "hidden" }}>
                  {candidates.map((c, i) => (
                    <div
                      key={c.email}
                      className="flex items-center justify-between"
                      style={{
                        padding: "10px 14px",
                        background: i % 2 === 0 ? "var(--color-canvas2)" : "transparent",
                        borderBottom: i < candidates.length - 1 ? "1px solid var(--color-edge)" : "none",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ink)" }}>{c.name}</span>
                        <span style={{ fontSize: 12, color: "var(--color-ink3)", marginLeft: 10 }}>{c.email}</span>
                      </div>
                      <button
                        onClick={() => removeCandidate(c.email)}
                        className="cursor-pointer border-0 bg-transparent"
                        style={{ color: "var(--color-ink3)", padding: 4 }}
                      >
                        <RiDeleteBinLine size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {candidates.length > 0 && (
                <div className="flex items-center" style={{ gap: 10, marginTop: 14, padding: "12px 16px", background: "var(--acg)", borderRadius: 10 }}>
                  <RiGroupLine size={16} style={{ color: "var(--color-brand)" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-brand)" }}>
                    {candidates.length} candidate{candidates.length !== 1 ? "s" : ""} ready
                  </span>
                </div>
              )}
            </Card>

            {/* Summary */}
            <Card padding="p-0" style={{ padding: 28, textAlign: "center" }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--color-ink)", marginBottom: 6 }}>Ready to Launch</h3>
              <p style={{ fontSize: 13, color: "var(--color-ink3)", marginBottom: 20 }}>
                {roleData.roleTitle || "Untitled Role"} &mdash; {config.duration}min {config.tone.toLowerCase()} interview
                {candidates.length > 0 && ` for ${candidates.length} candidate${candidates.length !== 1 ? "s" : ""}`}.
              </p>

              <div className="flex justify-center" style={{ gap: 10, marginBottom: 22 }}>
                {[
                  { l: "Criteria", v: criteria.length },
                  { l: "Duration", v: `${config.duration}m` },
                  { l: "Candidates", v: candidates.length },
                ].filter((s) => !(s.l === "Candidates" && s.v === 0)).map((s) => (
                  <div key={s.l} style={{ padding: "12px 18px", background: "var(--color-canvas2)", borderRadius: 10, border: "1px solid var(--color-edge)", minWidth: 70 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "var(--font-family-mono)", color: "var(--color-brand)" }}>{s.v}</div>
                    <div style={{ fontSize: 11, color: "var(--color-ink3)", fontWeight: 500, marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>

              <Button size="lg" onClick={() => launch()} style={{ opacity: launchPending ? 0.7 : 1 }}>
                <RiRocketLine size={16} />
                {launchPending ? "Launching..." : "Launch Interviews"}
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* Nav buttons */}
      <div className="flex justify-between" style={{ maxWidth: 700, margin: "22px auto 0" }}>
        <Button variant="ghost" onClick={prevStep} style={{ opacity: step === 0 ? 0.3 : 1 }}>
          <RiArrowLeftLine size={14} />Back
        </Button>
        {step < 4 && (
          <Button onClick={nextStep}>
            Continue<RiArrowRightLine size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
