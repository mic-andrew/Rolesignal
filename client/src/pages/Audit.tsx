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
  ai:     { bgClass: "bg-(--acg)",  textClass: "text-brand2", label: "AI Decision"   },
  human:  { bgClass: "bg-(--grg)",  textClass: "text-success", label: "Human Action" },
  system: { bgClass: "bg-(--amg)",  textClass: "text-warn",   label: "System"        },
};

export default function Audit() {
  const { events, isLoading, filter, setFilter, selectedEvent, setSelectedEventId, reasoningSteps } = useAudit();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 animate-fade-in">
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
        <div className="flex-1" />
        <Button variant="ghost" size="sm">
          <RiDownloadLine size={14} />Export Report
        </Button>
      </div>

      <div className="grid grid-cols-[1fr_380px] gap-8">
        <div className="space-y-2.5">
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
                  className={`px-5 py-4 animate-fade-in delay-${Math.min(i + 1, 10)} ${isSelected ? "border-[rgba(124,111,255,0.3)] shadow-(--shac)" : ""}`}
                >
                  <div className="flex gap-3">
                    <span className="text-lg leading-5 shrink-0">{ev.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="text-sm font-semibold text-ink">{ev.action}</div>
                        <span className="text-[11px] font-mono text-ink3 font-medium shrink-0">{ev.time}</span>
                      </div>
                      <div className="text-xs text-ink3 mt-1">{ev.detail}</div>
                      <div className="mt-2">
                        <span
                          className={`inline-flex px-2.5 py-[3px] rounded-full text-[11px] font-semibold ${cfg.bgClass} ${cfg.textClass}`}
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

        <Card padding="p-0" className="self-start sticky top-5 animate-fade-in delay-4">
          <div className="px-5 py-4 border-b border-edge">
            <span className="text-sm font-bold text-ink">AI Reasoning Trace</span>
          </div>
          <div className="p-5">
            {selectedEvent?.type === "ai" ? (
              <>
                <p className="text-xs text-ink3 mb-4">
                  Reasoning chain for: <span className="font-semibold text-ink2">{selectedEvent.action}</span>
                </p>
                <div className="flex flex-col gap-3.5">
                  {reasoningSteps.map((step, i) => (
                    <div key={step.label} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center shrink-0 w-[26px] h-[26px] rounded-full text-[11px] font-extrabold text-brand bg-(--acg)">
                          {i + 1}
                        </div>
                        {i < reasoningSteps.length - 1 && (
                          <div className="w-px flex-1 mt-1 bg-edge" />
                        )}
                      </div>
                      <div className="pb-2">
                        <div className="text-[13px] font-bold text-ink mb-[3px]">{step.label}</div>
                        <div className="text-xs text-ink3 leading-[1.6]">{step.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs text-ink3">Select an AI Decision event to view its reasoning chain.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
