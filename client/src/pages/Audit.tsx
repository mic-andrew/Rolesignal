import { useAudit } from "../hooks/useAudit";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { RiDownloadLine } from "react-icons/ri";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import type { AuditEventType } from "../types";

const FILTER_OPTS: Array<{ label: string; value: AuditEventType | "all" }> = [
  { label: "All Events",     value: "all"    },
  { label: "AI Decisions",   value: "ai"     },
  { label: "Human Actions",  value: "human"  },
  { label: "System",         value: "system" },
];

const TYPE_CONFIG = {
  ai:     { bg: "var(--acg)",  color: "var(--color-brand2)", label: "AI Decision"   },
  human:  { bg: "var(--grg)",  color: "var(--color-success)", label: "Human Action" },
  system: { bg: "var(--amg)",  color: "var(--color-warn)",   label: "System"        },
};

export default function Audit() {
  const { events, isLoading, filter, setFilter, selectedEvent, setSelectedEventId, reasoningSteps } = useAudit();

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center animate-fade-in" style={{ gap: 8, marginBottom: 20 }}>
        {FILTER_OPTS.map(({ label, value }) => (
          <Button
            key={value}
            variant={filter === value ? "primary" : "ghost"}
            size="sm"
            onClick={() => setFilter(value)}
          >
            {label}
          </Button>
        ))}
        <div style={{ flex: 1 }} />
        <Button variant="ghost" size="sm">
          <RiDownloadLine size={14} />Export Report
        </Button>
      </div>

      {/* Content */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
        {/* Event timeline */}
        <div>
          {isLoading ? (
            <LoadingSkeleton rows={5} />
          ) : (
            events.map((ev, i) => {
              const cfg = TYPE_CONFIG[ev.type];
              const isSelected = selectedEvent?.id === ev.id;
              return (
                <Card
                  key={ev.id}
                  glow
                  padding="p-0"
                  onClick={() => setSelectedEventId(ev.id)}
                  className={`animate-fade-in delay-${Math.min(i + 1, 5) as 1|2|3|4|5}`}
                  style={{
                    padding: "16px 20px",
                    marginBottom: 8,
                    border: isSelected ? "1px solid rgba(124,111,255,0.3)" : undefined,
                    boxShadow: isSelected ? "var(--shac)" : undefined,
                  }}
                >
                  <div className="flex" style={{ gap: 12 }}>
                    <span style={{ fontSize: 18, lineHeight: "20px", flexShrink: 0 }}>{ev.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div className="flex items-start justify-between" style={{ gap: 10 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-ink)" }}>{ev.action}</div>
                        <span style={{ fontSize: 11, fontFamily: "var(--font-family-mono)", color: "var(--color-ink3)", fontWeight: 500, flexShrink: 0 }}>{ev.time}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--color-ink3)", marginTop: 4 }}>{ev.detail}</div>
                      <div style={{ marginTop: 8 }}>
                        <span
                          style={{ display: "inline-flex", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: cfg.bg, color: cfg.color }}
                        >
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* AI reasoning trace */}
        <Card padding="p-0" className="animate-fade-in delay-4" style={{ alignSelf: "flex-start", position: "sticky", top: 20 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--color-edge)" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>AI Reasoning Trace</span>
          </div>
          <div style={{ padding: 20 }}>
            {selectedEvent?.type === "ai" ? (
              <>
                <p style={{ fontSize: 12, color: "var(--color-ink3)", marginBottom: 16 }}>
                  Reasoning chain for: <span style={{ fontWeight: 600, color: "var(--color-ink2)" }}>{selectedEvent.action}</span>
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {reasoningSteps.map((step, i) => (
                    <div key={step.label} className="flex" style={{ gap: 12 }}>
                      <div className="flex flex-col items-center">
                        <div
                          className="flex items-center justify-center shrink-0"
                          style={{ width: 26, height: 26, borderRadius: "50%", fontSize: 11, fontWeight: 800, color: "var(--color-brand)", background: "var(--acg)" }}
                        >
                          {i + 1}
                        </div>
                        {i < reasoningSteps.length - 1 && (
                          <div style={{ width: 1, flex: 1, marginTop: 4, background: "var(--color-edge)" }} />
                        )}
                      </div>
                      <div style={{ paddingBottom: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)", marginBottom: 3 }}>{step.label}</div>
                        <div style={{ fontSize: 12, color: "var(--color-ink3)", lineHeight: 1.6 }}>{step.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p style={{ fontSize: 12, color: "var(--color-ink3)" }}>Select an AI Decision event to view its reasoning chain.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
