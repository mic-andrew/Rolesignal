import { RiCheckboxCircleFill, RiCheckboxBlankCircleLine } from "react-icons/ri";

interface PreInterviewChecklistProps {
  micPermission: "granted" | "denied" | "prompt";
  micOn: boolean;
}

interface CheckItemProps {
  label: string;
  checked: boolean;
}

function CheckItem({ label, checked }: CheckItemProps) {
  return (
    <div className="flex items-center gap-2.5 py-2">
      {checked ? (
        <RiCheckboxCircleFill size={18} className="text-[var(--color-success)] shrink-0" />
      ) : (
        <RiCheckboxBlankCircleLine size={18} className="text-[var(--color-ink3)] shrink-0" />
      )}
      <span
        className={`text-[13px] ${
          checked ? "text-[var(--color-ink)]" : "text-[var(--color-ink3)]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export function PreInterviewChecklist({
  micPermission,
  micOn,
}: PreInterviewChecklistProps) {
  const micGranted = micPermission === "granted";

  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide mb-1 text-[var(--color-ink3)]">
        Pre-Interview Checklist
      </div>
      <CheckItem label="Check audio and microphone" checked={micGranted} />
      <CheckItem label="Audio working" checked={micGranted && micOn} />
      <CheckItem label="Close distracting applications" checked={false} />
      <CheckItem label="Have water nearby" checked={false} />
    </div>
  );
}
