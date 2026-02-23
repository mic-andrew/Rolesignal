import { useNavigate } from "react-router-dom";
import { RiMicLine, RiMicOffLine, RiCameraLine, RiCameraOffLine, RiArrowRightLine } from "react-icons/ri";
import { useLobby } from "../hooks/useLobby";
import { AIAvatar } from "../components/shared/AIAvatar";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export default function Lobby() {
  const navigate = useNavigate();
  const { countdown, canJoin, micOn, camOn, toggleMic, toggleCam } = useLobby();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-canvas)",
        display: "flex",
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
            {/* Placeholder */}
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
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "var(--color-layer2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-ink3)",
                }}
              >
                <RiCameraLine size={28} />
              </div>
              <span style={{ fontSize: 13, color: "var(--color-ink3)", fontWeight: 500 }}>Camera Preview</span>
            </div>

            {/* Controls overlay */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: 14,
                background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                display: "flex",
                justifyContent: "center",
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
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: on ? "rgba(255,255,255,0.12)" : "rgba(255,90,90,0.3)",
                    backdropFilter: "blur(12px)",
                    transition: "all 0.2s",
                  }}
                >
                  {on ? <On size={20} color="#fff" /> : <Off size={20} color="var(--color-danger)" />}
                </button>
              ))}
            </div>
          </div>

          {/* Connection indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              background: "var(--grg)",
              borderRadius: 8,
              width: "fit-content",
              border: "1px solid rgba(34,201,151,0.15)",
            }}
          >
            <div style={{ display: "flex", gap: 2 }}>
              {[10, 14, 18].map((h) => (
                <div
                  key={h}
                  style={{ width: 3, height: h, borderRadius: 2, background: "var(--color-success)" }}
                />
              ))}
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-success)" }}>
              Excellent Connection
            </span>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Aria card */}
          <Card padding="p-0" style={{ textAlign: "center", padding: 24 }}>
            <AIAvatar size={68} />
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 3, marginTop: 14, color: "var(--color-ink)" }}>
              Aria
            </h3>
            <p style={{ fontSize: 11, color: "var(--color-ink3)", marginBottom: 14, fontWeight: 500 }}>
              Your AI Interviewer
            </p>
            <p style={{ fontSize: 13, color: "var(--color-ink2)", lineHeight: 1.65 }}>
              Hi Sarah, I'll be conducting your interview for{" "}
              <strong style={{ color: "var(--color-ink)", fontWeight: 600 }}>Senior Frontend Engineer</strong> at Acme Corp.
            </p>
          </Card>

          {/* Details card */}
          <Card padding="p-0" style={{ padding: 16 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--color-ink3)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 10,
              }}
            >
              Interview Details
            </div>
            {[
              { l: "Role", v: "Senior Frontend Engineer" },
              { l: "Company", v: "Acme Corp" },
              { l: "Duration", v: "30 minutes" },
              { l: "Sections", v: "5 sections" },
            ].map(({ l, v }) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "7px 0",
                  borderBottom: "1px solid var(--color-edge)",
                }}
              >
                <span style={{ fontSize: 12, color: "var(--color-ink3)" }}>{l}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink)" }}>{v}</span>
              </div>
            ))}
          </Card>

          {/* Countdown / Join */}
          <div style={{ textAlign: "center", marginTop: 4 }}>
            {!canJoin ? (
              <>
                <div style={{ fontSize: 11, color: "var(--color-ink3)", fontWeight: 500, marginBottom: 6 }}>
                  Interview starts in
                </div>
                <div
                  style={{
                    fontSize: 40,
                    fontWeight: 800,
                    color: "var(--color-brand)",
                    fontFamily: "var(--font-family-mono)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {countdown}s
                </div>
              </>
            ) : (
              <Button full size="lg" onClick={() => navigate("/interview")}>
                Join Interview<RiArrowRightLine size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
