import { useNavigate } from "react-router-dom";
import { RiCloseCircleLine } from "react-icons/ri";
import { useLobby } from "../hooks/useLobby";
import { LobbyPreviewPanel } from "../components/shared/interview/LobbyPreviewPanel";
import { LobbyInfoPanel } from "../components/shared/interview/LobbyInfoPanel";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";

export default function Lobby() {
  const navigate = useNavigate();
  const {
    token,
    interview,
    isLoading,
    error,
    countdown,
    canJoin,
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

  if (error || !interview) {
    return (
      <div className="min-h-screen bg-[var(--color-canvas)] flex flex-col items-center justify-center p-7">
        <div className="animate-fade-in max-w-[420px] w-full text-center">
          <RiCloseCircleLine
            size={48}
            className="text-[var(--color-danger)] mx-auto mb-4"
          />
          <h2 className="text-xl font-bold text-[var(--color-ink)] mb-2">
            Interview Unavailable
          </h2>
          <p className="text-sm text-[var(--color-ink3)] leading-relaxed mb-6">
            This interview link has expired or has already been completed. If you
            believe this is an error, please contact the hiring team for a new
            link.
          </p>
          <p className="text-xs text-[var(--color-ink3)] opacity-60">
            You can safely close this window.
          </p>
        </div>
      </div>
    );
  }

  const roleTitle = interview.roleTitle ?? "Interview";
  const orgName = interview.orgName ?? "Company";
  const candidateName = interview.candidateName ?? "Candidate";
  const brandColor = interview.orgBrandColor ?? "var(--color-brand)";
  const duration = interview.configDuration ?? 30;

  return (
    <div className="h-screen bg-[var(--color-canvas)] flex flex-col">
      <div className="flex-1 flex gap-4 p-4 min-h-0">
        {/* Left panel — audio preview */}
        <div className="flex-[3] min-h-0">
          <LobbyPreviewPanel
            candidateName={candidateName}
            micOn={micOn}
            micPermission={micPermission}
            onToggleMic={toggleMic}
          />
        </div>

        {/* Right panel — info cards */}
        <div className="flex-[2] min-h-0 overflow-auto">
          <LobbyInfoPanel
            roleTitle={roleTitle}
            orgName={orgName}
            duration={duration}
            candidateName={candidateName}
            micOn={micOn}
            micPermission={micPermission}
            countdown={countdown}
            canJoin={canJoin}
            onJoin={() => navigate(`/i/${token}/interview`)}
            brandColor={brandColor}
          />
        </div>
      </div>

      {/* Powered by footer */}
      <div className="text-center py-3 shrink-0">
        <span className="text-[11px] font-medium text-[var(--color-ink3)] opacity-60">
          Powered by RoleSignal
        </span>
      </div>
    </div>
  );
}
