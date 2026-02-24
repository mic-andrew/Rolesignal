import {
  RiArrowRightLine, RiArrowLeftLine, RiCloseLine,
  RiLoader4Line, RiFileCopyLine, RiCheckLine,
} from "react-icons/ri";
import { useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useSendInterview } from "../../hooks/useSendInterview";
import { useUIStore } from "../../stores/uiStore";
import type { AITone } from "../../types";

interface SendInterviewModalProps {
  onClose: () => void;
}

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

const STEP_LABELS = ["Candidate", "Interview Config", "Share Link"];

export function SendInterviewModal({ onClose }: SendInterviewModalProps) {
  const hook = useSendInterview();
  const showToast = useUIStore((s) => s.showToast);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hook.interviewLink);
    setCopied(true);
    showToast("Link copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendAnother = () => {
    hook.reset();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)", zIndex: 100 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <Card style={{ width: "100%", maxWidth: 480, padding: 0 }} className="animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between" style={{ padding: "18px 24px", borderBottom: "1px solid var(--color-edge)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-ink)" }}>Send Interview</h3>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-ink3)", display: "flex" }}
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center" style={{ padding: "14px 24px 0", gap: 8 }}>
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center" style={{ gap: 8 }}>
              <div
                style={{
                  width: 22, height: 22, borderRadius: "50%", fontSize: 11, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: i <= hook.step ? "var(--color-brand)" : "var(--color-layer2)",
                  color: i <= hook.step ? "#fff" : "var(--color-ink3)",
                }}
              >
                {i < hook.step ? <RiCheckLine size={12} /> : i + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: i === hook.step ? 600 : 400, color: i === hook.step ? "var(--color-ink)" : "var(--color-ink3)" }}>
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && (
                <div style={{ width: 20, height: 1, background: "var(--color-edge)" }} />
              )}
            </div>
          ))}
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px" }}>
          {hook.step === 0 && <StepCandidate hook={hook} />}
          {hook.step === 1 && <StepConfig hook={hook} />}
          {hook.step === 2 && <StepShare link={hook.interviewLink} copied={copied} onCopy={handleCopy} />}
        </div>

        {/* Footer */}
        <div className="flex justify-between" style={{ padding: "0 24px 20px" }}>
          <div>
            {hook.step === 1 && (
              <Button variant="ghost" size="sm" onClick={hook.prevStep}>
                <RiArrowLeftLine size={14} /> Back
              </Button>
            )}
          </div>
          {hook.step < 2 ? (
            <Button
              size="sm"
              onClick={hook.nextStep}
              disabled={hook.step === 0 ? !hook.canAdvanceStep0 : hook.isPending}
            >
              {hook.isPending ? (
                <RiLoader4Line size={14} className="animate-spin" />
              ) : hook.step === 1 ? (
                <>Create & Get Link <RiArrowRightLine size={14} /></>
              ) : (
                <>Next <RiArrowRightLine size={14} /></>
              )}
            </Button>
          ) : (
            <div className="flex" style={{ gap: 8 }}>
              <Button variant="ghost" size="sm" onClick={handleSendAnother}>
                Send Another
              </Button>
              <Button size="sm" onClick={onClose}>
                Done
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function StepCandidate({ hook }: { hook: ReturnType<typeof useSendInterview> }) {
  return (
    <div className="flex flex-col" style={{ gap: 14 }}>
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-ink2)" }}>Role</label>
        <select
          style={{ ...fieldStyle, appearance: "none" }}
          value={hook.roleId}
          onChange={(e) => { hook.setRoleId(e.target.value); hook.setExistingCandidateId(""); }}
        >
          <option value="">Select a role...</option>
          {hook.roles.map((r) => (
            <option key={r.id} value={r.id}>{r.title}</option>
          ))}
        </select>
      </div>

      {hook.roleId && (
        <label className="flex items-center" style={{ gap: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={hook.useExisting}
            onChange={(e) => { hook.setUseExisting(e.target.checked); hook.setExistingCandidateId(""); }}
            style={{ accentColor: "var(--color-brand)" }}
          />
          <span style={{ fontSize: 12, color: "var(--color-ink2)", fontWeight: 500 }}>Select existing candidate</span>
        </label>
      )}

      {hook.useExisting ? (
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-ink2)" }}>Candidate</label>
          <select
            style={{ ...fieldStyle, appearance: "none" }}
            value={hook.existingCandidateId}
            onChange={(e) => hook.setExistingCandidateId(e.target.value)}
          >
            <option value="">Select a candidate...</option>
            {hook.existingCandidates.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
            ))}
          </select>
        </div>
      ) : (
        <>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-ink2)" }}>Candidate Name</label>
            <input style={fieldStyle} placeholder="Jane Smith" value={hook.candidateName} onChange={(e) => hook.setCandidateName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-ink2)" }}>Candidate Email</label>
            <input type="email" style={fieldStyle} placeholder="jane@example.com" value={hook.candidateEmail} onChange={(e) => hook.setCandidateEmail(e.target.value)} />
          </div>
        </>
      )}
    </div>
  );
}

function StepConfig({ hook }: { hook: ReturnType<typeof useSendInterview> }) {
  return (
    <div className="flex flex-col" style={{ gap: 14 }}>
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-ink2)" }}>Duration</label>
        <select
          style={{ ...fieldStyle, appearance: "none" }}
          value={hook.duration}
          onChange={(e) => hook.setDuration(Number(e.target.value))}
        >
          {[15, 30, 45, 60].map((d) => (
            <option key={d} value={d}>{d} minutes</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-ink2)" }}>Interview Tone</label>
        <select
          style={{ ...fieldStyle, appearance: "none" }}
          value={hook.tone}
          onChange={(e) => hook.setTone(e.target.value as AITone)}
        >
          {(["Professional", "Conversational", "Challenging"] as const).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <label className="flex items-center" style={{ gap: 8, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={hook.adaptive}
          onChange={(e) => hook.setAdaptive(e.target.checked)}
          style={{ accentColor: "var(--color-brand)" }}
        />
        <span style={{ fontSize: 12, color: "var(--color-ink2)", fontWeight: 500 }}>Adaptive difficulty</span>
      </label>
    </div>
  );
}

function StepShare({ link, copied, onCopy }: { link: string; copied: boolean; onCopy: () => void }) {
  return (
    <div className="flex flex-col items-center text-center" style={{ gap: 16, padding: "8px 0" }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-ink)" }}>
        Interview link ready
      </div>
      <p style={{ fontSize: 13, color: "var(--color-ink3)" }}>
        Share this link with the candidate to start their interview.
      </p>
      <div
        className="flex items-center w-full"
        style={{
          gap: 8, padding: "10px 14px", borderRadius: 8,
          background: "var(--color-layer)", border: "1px solid var(--color-edge)",
        }}
      >
        <input
          readOnly
          value={link}
          style={{ flex: 1, fontSize: 12, fontFamily: "var(--font-family-mono)", color: "var(--color-ink2)", background: "transparent", border: "none", outline: "none" }}
        />
        <button
          onClick={onCopy}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: copied ? "var(--color-success)" : "var(--color-brand)",
            display: "flex", padding: 4,
          }}
        >
          {copied ? <RiCheckLine size={16} /> : <RiFileCopyLine size={16} />}
        </button>
      </div>
    </div>
  );
}
