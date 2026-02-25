import { useNavigate } from "react-router-dom";
import {
  RiMicLine,
  RiMicOffLine,
  RiArrowRightLine,
  RiErrorWarningLine,
} from "react-icons/ri";
import { useLobby } from "../hooks/useLobby";
import { AIAvatar } from "../components/shared/AIAvatar";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex justify-between py-[7px] border-b border-[var(--color-edge)]">
      <span className="text-xs text-[var(--color-ink3)]">{label}</span>
      <span className="text-xs font-semibold text-[var(--color-ink)]">{value}</span>
    </div>
  );
}

function MicDeniedBanner() {
  return (
    <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-[rgba(234,67,53,0.08)] border border-[rgba(234,67,53,0.2)]">
      <RiErrorWarningLine size={16} className="text-[var(--color-danger)] shrink-0" />
      <span className="text-[11px] text-[var(--color-danger)]">
        Microphone access is required for voice interviews.
        Please allow access in your browser settings.
      </span>
    </div>
  );
}

function SignalBars() {
  return (
    <div className="flex gap-0.5">
      <div className="w-[3px] h-2.5 rounded-sm bg-[var(--color-success)]" />
      <div className="w-[3px] h-3.5 rounded-sm bg-[var(--color-success)]" />
      <div className="w-[3px] h-[18px] rounded-sm bg-[var(--color-success)]" />
    </div>
  );
}

export default function Lobby() {
  const navigate = useNavigate();
  const {
    token,
    interview,
    isLoading,
    countdown,
    micOn,
    micPermission,
    toggleMic,
  } = useLobby();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-canvas)]">
        <LoadingSkeleton rows={4} />
      </div>
    );
  }

  const roleTitle = interview?.roleTitle ?? "Interview";
  const orgName = interview?.orgName ?? "Company";
  const candidateName = interview?.candidateName ?? "Candidate";
  const brandColor = interview?.orgBrandColor ?? "var(--color-brand)";
  const duration = interview?.configDuration ?? 30;

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] flex flex-col items-center justify-center p-7">
      <div className="animate-fade-in max-w-[480px] w-full flex flex-col gap-5">
        {/* Aria card */}
        <Card padding="p-0" className="text-center p-7">
          <AIAvatar size={72} />
          <h3 className="text-base font-bold mt-4 mb-1 text-[var(--color-ink)]">
            Aria
          </h3>
          <p className="text-[11px] font-medium mb-4 text-[var(--color-ink3)]">
            Your AI Interviewer
          </p>
          <p className="text-[13px] leading-relaxed text-[var(--color-ink2)]">
            Hi {candidateName.split(" ")[0]}, I&apos;ll be conducting your
            voice interview for{" "}
            <strong className="text-[var(--color-ink)] font-semibold">
              {roleTitle}
            </strong>{" "}
            at {orgName}. This is a conversational interview — just
            speak naturally.
          </p>
        </Card>

        {/* Details card */}
        <Card padding="p-0" className="p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wide mb-2.5 text-[var(--color-ink3)]">
            Interview Details
          </div>
          <DetailRow label="Role" value={roleTitle} />
          <DetailRow label="Company" value={orgName} />
          <DetailRow label="Duration" value={`${duration} minutes`} />
          <DetailRow label="Format" value="Voice conversation" />
        </Card>

        {/* Mic control */}
        <Card padding="p-0" className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMic}
                className={`flex items-center justify-center w-11 h-11 rounded-full border border-[var(--color-edge)] cursor-pointer transition-all ${
                  micOn ? "bg-[var(--acg)]" : "bg-[rgba(234,67,53,0.1)]"
                }`}
              >
                {micOn ? (
                  <RiMicLine size={20} className="text-[var(--color-brand)]" />
                ) : (
                  <RiMicOffLine size={20} className="text-[var(--color-danger)]" />
                )}
              </button>
              <div>
                <div className="text-xs font-semibold text-[var(--color-ink)]">
                  Microphone
                </div>
                <div className="text-[11px] text-[var(--color-ink3)]">
                  {micPermission === "granted"
                    ? micOn
                      ? "Ready"
                      : "Muted"
                    : "Permission needed"}
                </div>
              </div>
            </div>
            {micPermission === "granted" && <SignalBars />}
          </div>
          {micPermission === "denied" && <MicDeniedBanner />}
        </Card>

        {/* Countdown / Join */}
        <div className="text-center mt-1">
          {countdown > 0 ? (
            <>
              <div className="text-[11px] font-medium mb-1.5 text-[var(--color-ink3)]">
                Interview starts in
              </div>
              <div
                className="text-[40px] font-extrabold font-mono tracking-tight"
                style={{ color: brandColor }}
              >
                {countdown}s
              </div>
            </>
          ) : (
            <Button
              full
              size="lg"
              onClick={() => navigate(`/i/${token}/interview`)}
              className={micPermission !== "granted" ? "opacity-50 pointer-events-none" : ""}
            >
              Join Interview
              <RiArrowRightLine size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Powered by footer */}
      <div className="mt-8 text-[11px] font-medium text-[var(--color-ink3)] opacity-60">
        Powered by RoleSignal
      </div>
    </div>
  );
}
