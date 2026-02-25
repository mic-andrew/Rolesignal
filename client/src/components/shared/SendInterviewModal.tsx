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

const FIELD_CLASS = "w-full px-3.5 py-[11px] bg-layer border border-edge rounded-lg text-ink text-[13px] outline-none";

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
      className="fixed inset-0 flex items-center justify-center bg-black/60 z-100"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <Card className="animate-fade-in w-full max-w-[480px] p-0!">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-[18px] border-b border-edge">
          <h3 className="text-base font-bold text-ink">Send Interview</h3>
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer text-ink3 flex"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center px-6 pt-3.5 gap-2">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-[22px] h-[22px] rounded-full text-[11px] font-bold flex items-center justify-center ${
                  i <= hook.step
                    ? "bg-brand text-white"
                    : "bg-layer2 text-ink3"
                }`}
              >
                {i < hook.step ? <RiCheckLine size={12} /> : i + 1}
              </div>
              <span className={`text-xs ${i === hook.step ? "font-semibold text-ink" : "font-normal text-ink3"}`}>
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && (
                <div className="w-5 h-px bg-edge" />
              )}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {hook.step === 0 && <StepCandidate hook={hook} />}
          {hook.step === 1 && <StepConfig hook={hook} />}
          {hook.step === 2 && <StepShare link={hook.interviewLink} copied={copied} onCopy={handleCopy} />}
        </div>

        {/* Footer */}
        <div className="flex justify-between px-6 pb-5">
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
            <div className="flex gap-2">
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
    <div className="flex flex-col gap-3.5">
      <div>
        <label className="block text-xs font-semibold mb-1.5 text-ink2">Role</label>
        <select
          className={`${FIELD_CLASS} appearance-none`}
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
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hook.useExisting}
            onChange={(e) => { hook.setUseExisting(e.target.checked); hook.setExistingCandidateId(""); }}
            className="accent-brand"
          />
          <span className="text-xs text-ink2 font-medium">Select existing candidate</span>
        </label>
      )}

      {hook.useExisting ? (
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-ink2">Candidate</label>
          <select
            className={`${FIELD_CLASS} appearance-none`}
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
            <label className="block text-xs font-semibold mb-1.5 text-ink2">Candidate Name</label>
            <input className={FIELD_CLASS} placeholder="Jane Smith" value={hook.candidateName} onChange={(e) => hook.setCandidateName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-ink2">Candidate Email</label>
            <input type="email" className={FIELD_CLASS} placeholder="jane@example.com" value={hook.candidateEmail} onChange={(e) => hook.setCandidateEmail(e.target.value)} />
          </div>
        </>
      )}
    </div>
  );
}

function StepConfig({ hook }: { hook: ReturnType<typeof useSendInterview> }) {
  return (
    <div className="flex flex-col gap-3.5">
      <div>
        <label className="block text-xs font-semibold mb-1.5 text-ink2">Duration</label>
        <select
          className={`${FIELD_CLASS} appearance-none`}
          value={hook.duration}
          onChange={(e) => hook.setDuration(Number(e.target.value))}
        >
          {[15, 30, 45, 60].map((d) => (
            <option key={d} value={d}>{d} minutes</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1.5 text-ink2">Interview Tone</label>
        <select
          className={`${FIELD_CLASS} appearance-none`}
          value={hook.tone}
          onChange={(e) => hook.setTone(e.target.value as AITone)}
        >
          {(["Professional", "Conversational", "Challenging"] as const).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={hook.adaptive}
          onChange={(e) => hook.setAdaptive(e.target.checked)}
          className="accent-brand"
        />
        <span className="text-xs text-ink2 font-medium">Adaptive difficulty</span>
      </label>
    </div>
  );
}

function StepShare({ link, copied, onCopy }: { link: string; copied: boolean; onCopy: () => void }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-2">
      <div className="text-sm font-semibold text-ink">
        Interview link ready
      </div>
      <p className="text-[13px] text-ink3">
        Share this link with the candidate to start their interview.
      </p>
      <div className="flex items-center w-full gap-2 px-3.5 py-2.5 rounded-lg bg-layer border border-edge">
        <input
          readOnly
          value={link}
          className="flex-1 text-xs font-(--font-family-mono) text-ink2 bg-transparent border-none outline-none"
        />
        <button
          onClick={onCopy}
          className={`bg-transparent border-none cursor-pointer flex p-1 ${
            copied ? "text-success" : "text-brand"
          }`}
        >
          {copied ? <RiCheckLine size={16} /> : <RiFileCopyLine size={16} />}
        </button>
      </div>
    </div>
  );
}
