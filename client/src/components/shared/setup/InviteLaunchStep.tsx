import { useState } from "react";
import { RiAddLine, RiDeleteBinLine, RiGroupLine, RiRocketLine } from "react-icons/ri";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import type { InterviewConfig } from "../../../types";

interface CandidateEntry {
  name: string;
  email: string;
}

interface InviteLaunchStepProps {
  candidates: CandidateEntry[];
  roleTitle: string;
  config: InterviewConfig;
  criteriaCount: number;
  launchPending: boolean;
  onAddCandidate: (name: string, email: string) => void;
  onRemoveCandidate: (email: string) => void;
  onLaunch: () => void;
}

const INPUT_CLS =
  "w-full px-3.5 py-[11px] bg-[var(--color-canvas2)] border border-[var(--color-edge)] rounded-lg text-[var(--color-ink)] text-[13px] outline-none flex-1";

export function InviteLaunchStep({
  candidates,
  roleTitle,
  config,
  criteriaCount,
  launchPending,
  onAddCandidate,
  onRemoveCandidate,
  onLaunch,
}: InviteLaunchStepProps) {
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");

  const handleAdd = () => {
    onAddCandidate(candidateName, candidateEmail);
    setCandidateName("");
    setCandidateEmail("");
  };

  return (
    <div>
      <Card padding="p-0" className="p-[30px] mb-5">
        <h3 className="text-[17px] font-bold text-[var(--color-ink)] mb-1.5">
          Invite Candidates
        </h3>
        <p className="text-[13px] text-[var(--color-ink3)] mb-5">
          Add candidates who will each receive a unique interview link via email.
        </p>
        <div className="flex gap-2.5 mb-4">
          <input
            className={INPUT_CLS}
            placeholder="Candidate name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && candidateEmail) handleAdd(); }}
          />
          <input
            className={INPUT_CLS}
            placeholder="Email address"
            type="email"
            value={candidateEmail}
            onChange={(e) => setCandidateEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && candidateName) handleAdd(); }}
          />
          <Button onClick={handleAdd} className="shrink-0">
            <RiAddLine size={14} />Add
          </Button>
        </div>
        {candidates.length > 0 && (
          <CandidateList candidates={candidates} onRemove={onRemoveCandidate} />
        )}
        {candidates.length > 0 && (
          <div className="flex items-center gap-2.5 mt-3.5 px-4 py-3 bg-[var(--acg)] rounded-[10px]">
            <RiGroupLine size={16} className="text-[var(--color-brand)]" />
            <span className="text-[13px] font-semibold text-[var(--color-brand)]">
              {candidates.length} candidate{candidates.length !== 1 ? "s" : ""} ready
            </span>
          </div>
        )}
      </Card>
      <LaunchSummary
        roleTitle={roleTitle}
        config={config}
        criteriaCount={criteriaCount}
        candidateCount={candidates.length}
        launchPending={launchPending}
        onLaunch={onLaunch}
      />
    </div>
  );
}

/* ── Sub-components ────────────────────────────────────────────────── */

function CandidateList({ candidates, onRemove }: { candidates: CandidateEntry[]; onRemove: (email: string) => void }) {
  return (
    <div className="rounded-lg border border-[var(--color-edge)] overflow-hidden">
      {candidates.map((c, i) => (
        <div
          key={c.email}
          className={`flex items-center justify-between px-3.5 py-2.5 ${
            i % 2 === 0 ? "bg-[var(--color-canvas2)]" : "bg-transparent"
          } ${i < candidates.length - 1 ? "border-b border-[var(--color-edge)]" : ""}`}
        >
          <div>
            <span className="text-[13px] font-semibold text-[var(--color-ink)]">{c.name}</span>
            <span className="text-xs text-[var(--color-ink3)] ml-2.5">{c.email}</span>
          </div>
          <button
            onClick={() => onRemove(c.email)}
            className="cursor-pointer border-0 bg-transparent text-[var(--color-ink3)] p-1"
          >
            <RiDeleteBinLine size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

interface LaunchSummaryProps {
  roleTitle: string;
  config: InterviewConfig;
  criteriaCount: number;
  candidateCount: number;
  launchPending: boolean;
  onLaunch: () => void;
}

function LaunchSummary({ roleTitle, config, criteriaCount, candidateCount, launchPending, onLaunch }: LaunchSummaryProps) {
  const stats = [
    { label: "Criteria", value: criteriaCount },
    { label: "Duration", value: `${config.duration}m` },
    ...(candidateCount > 0 ? [{ label: "Candidates", value: candidateCount }] : []),
  ];

  return (
    <Card padding="p-0" className="p-7 text-center">
      <h3 className="text-lg font-extrabold text-[var(--color-ink)] mb-1.5">Ready to Launch</h3>
      <p className="text-[13px] text-[var(--color-ink3)] mb-5">
        {roleTitle || "Untitled Role"} &mdash; {config.duration}min{" "}
        {config.tone.toLowerCase()} interview
        {candidateCount > 0 && ` for ${candidateCount} candidate${candidateCount !== 1 ? "s" : ""}`}.
      </p>
      <div className="flex justify-center gap-2.5 mb-[22px]">
        {stats.map((s) => (
          <div
            key={s.label}
            className="px-[18px] py-3 bg-[var(--color-canvas2)] rounded-[10px] border border-[var(--color-edge)] min-w-[70px]"
          >
            <div className="text-lg font-extrabold font-mono text-[var(--color-brand)]">{s.value}</div>
            <div className="text-[11px] text-[var(--color-ink3)] font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
      <Button size="lg" onClick={onLaunch} className={launchPending ? "opacity-70" : ""}>
        <RiRocketLine size={16} />
        {launchPending ? "Launching..." : "Launch Interviews"}
      </Button>
    </Card>
  );
}
