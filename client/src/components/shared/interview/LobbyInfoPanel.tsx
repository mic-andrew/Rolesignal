import { RiFileTextLine } from "react-icons/ri";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { PreInterviewChecklist } from "./PreInterviewChecklist";
import avatarSrc from "../../../assets/sofia-gutierrez.webp";

interface LobbyInfoPanelProps {
  roleTitle: string;
  orgName: string;
  duration: number;
  candidateName: string;
  micOn: boolean;
  micPermission: "granted" | "denied" | "prompt";
  countdown: number;
  canJoin: boolean;
  onJoin: () => void;
  brandColor: string;
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex justify-between py-[7px] border-b border-[var(--color-edge)]">
      <span className="text-xs text-[var(--color-ink3)]">{label}</span>
      <span className="text-xs font-semibold text-[var(--color-ink)]">
        {value}
      </span>
    </div>
  );
}

export function LobbyInfoPanel({
  roleTitle,
  orgName,
  duration,
  candidateName,
  micOn,
  micPermission,
  countdown,
  canJoin,
  onJoin,
  brandColor,
}: LobbyInfoPanelProps) {
  const firstName = candidateName.split(" ")[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Interview header card */}
      <Card padding="p-0" className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={avatarSrc}
            alt="Sophie"
            className="w-9 h-9 rounded-full object-cover shadow-[0_0_12px_rgba(124,111,255,0.25)]"
          />
          <div>
            <h2 className="text-base font-bold text-[var(--color-ink)]">
              {roleTitle}
            </h2>
            <p className="text-[11px] text-[var(--color-ink3)]">at {orgName}</p>
          </div>
        </div>
        <p className="text-[13px] leading-relaxed text-[var(--color-ink2)] mb-5">
          Ready to start your interview, {firstName}? Make sure your audio is
          working properly. This is a conversational voice interview — just speak
          naturally.
        </p>

        {countdown > 0 ? (
          <div className="text-center py-2">
            <div className="text-[11px] font-medium mb-1.5 text-[var(--color-ink3)]">
              Interview starts in
            </div>
            <div
              className="text-[36px] font-extrabold font-mono tracking-tight"
              style={{ color: brandColor }}
            >
              {countdown}s
            </div>
          </div>
        ) : (
          <Button
            full
            size="lg"
            onClick={onJoin}
            className={!canJoin ? "opacity-50 pointer-events-none" : ""}
          >
            Join Interview
          </Button>
        )}
      </Card>

      {/* Checklist card */}
      <Card padding="p-0" className="p-4">
        <PreInterviewChecklist micPermission={micPermission} micOn={micOn} />
      </Card>

      {/* Interview details card */}
      <Card padding="p-0" className="p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wide mb-2.5 text-[var(--color-ink3)]">
          Interview Details
        </div>
        <DetailRow label="Type" value="Voice Conversation" />
        <DetailRow label="Duration" value={`${duration} minutes`} />
        <DetailRow label="Format" value="AI-Powered" />
        <div className="flex items-center gap-2 mt-3 pt-2">
          <RiFileTextLine size={14} className="text-[var(--color-ink3)]" />
          <span className="text-[12px] text-[var(--color-ink3)]">
            Job description attached
          </span>
        </div>
      </Card>
    </div>
  );
}
