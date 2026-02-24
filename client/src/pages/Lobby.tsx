import { useNavigate } from "react-router-dom";
import { RiMicLine, RiMicOffLine, RiCameraLine, RiCameraOffLine, RiArrowRightLine } from "react-icons/ri";
import { useLobby } from "../hooks/useLobby";
import { AIAvatar } from "../components/shared/AIAvatar";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";

export default function Lobby() {
  const navigate = useNavigate();
  const { token, interview, isLoading, countdown, canJoin, micOn, camOn, toggleMic, toggleCam } = useLobby();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: "100vh", background: "var(--color-canvas)" }}>
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
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-canvas)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 28,
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          maxWidth: 880,
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 28,
        }}
      >
        {/* Left — Camera preview */}
        <div>
          <div
            style={{
              aspectRatio: "16/9",
              borderRadius: 20,
              background: "linear-gradient(160deg, var(--color-layer), var(--color-canvas2))",
              position: "relative",
              overflow: "hidden",
              marginBottom: 20,
              border: "1px solid var(--color-edge)",
              boxShadow: "var(--sh3)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "var(--color-layer2)",
                  color: "var(--color-ink3)",
                }}
              >
                <RiCameraLine size={28} />
              </div>
              <span className="text-[13px] font-medium" style={{ color: "var(--color-ink3)" }}>Camera Preview</span>
            </div>

            {/* Controls overlay */}
            <div
              className="flex justify-center"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: 14,
                background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                gap: 10,
              }}
            >
              {[
                { on: micOn, onIcon: RiMicLine, offIcon: RiMicOffLine, toggle: toggleMic },
                { on: camOn, onIcon: RiCameraLine, offIcon: RiCameraOffLine, toggle: toggleCam },
              ].map(({ on, onIcon: On, offIcon: Off, toggle }, idx) => (
                <button
                  key={idx}
                  onClick={toggle}
                  className="flex items-center justify-center cursor-pointer transition-all"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: on ? "rgba(255,255,255,0.12)" : "rgba(255,90,90,0.3)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {on ? <On size={20} color="#fff" /> : <Off size={20} color="var(--color-danger)" />}
                </button>
              ))}
            </div>
          </div>

          {/* Connection indicator */}
          <div
            className="flex items-center gap-2 w-fit"
            style={{
              padding: "8px 14px",
              background: "var(--grg)",
              borderRadius: 8,
              border: "1px solid rgba(34,201,151,0.15)",
            }}
          >
            <div className="flex gap-0.5">
              {[10, 14, 18].map((h) => (
                <div
                  key={h}
                  style={{ width: 3, height: h, borderRadius: 2, background: "var(--color-success)" }}
                />
              ))}
            </div>
            <span className="text-xs font-semibold" style={{ color: "var(--color-success)" }}>
              Excellent Connection
            </span>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          {/* Aria card */}
          <Card padding="p-0" style={{ textAlign: "center", padding: 24 }}>
            <AIAvatar size={68} />
            <h3 className="text-base font-bold mt-3.5 mb-1" style={{ color: "var(--color-ink)" }}>
              Aria
            </h3>
            <p className="text-[11px] font-medium mb-3.5" style={{ color: "var(--color-ink3)" }}>
              Your AI Interviewer
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-ink2)" }}>
              Hi {candidateName.split(" ")[0]}, I'll be conducting your interview for{" "}
              <strong style={{ color: "var(--color-ink)", fontWeight: 600 }}>{roleTitle}</strong> at {orgName}.
            </p>
          </Card>

          {/* Details card */}
          <Card padding="p-0" style={{ padding: 16 }}>
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-2.5" style={{ color: "var(--color-ink3)" }}>
              Interview Details
            </div>
            {[
              { l: "Role", v: roleTitle },
              { l: "Company", v: orgName },
              { l: "Duration", v: `${duration} minutes` },
              { l: "Sections", v: "5 sections" },
            ].map(({ l, v }) => (
              <div
                key={l}
                className="flex justify-between"
                style={{ padding: "7px 0", borderBottom: "1px solid var(--color-edge)" }}
              >
                <span className="text-xs" style={{ color: "var(--color-ink3)" }}>{l}</span>
                <span className="text-xs font-semibold" style={{ color: "var(--color-ink)" }}>{v}</span>
              </div>
            ))}
          </Card>

          {/* Countdown / Join */}
          <div className="text-center mt-1">
            {!canJoin ? (
              <>
                <div className="text-[11px] font-medium mb-1.5" style={{ color: "var(--color-ink3)" }}>
                  Interview starts in
                </div>
                <div
                  className="text-[40px] font-extrabold font-mono"
                  style={{ color: brandColor, letterSpacing: "-0.02em" }}
                >
                  {countdown}s
                </div>
              </>
            ) : (
              <Button full size="lg" onClick={() => navigate(`/i/${token}/interview`)}>
                Join Interview<RiArrowRightLine size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Powered by footer */}
      <div className="mt-8 text-[11px] font-medium" style={{ color: "var(--color-ink3)", opacity: 0.6 }}>
        Powered by RoleSignal
      </div>
    </div>
  );
}
