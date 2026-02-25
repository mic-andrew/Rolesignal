import { Card } from "../../ui/Card";

const AUDIT_TOGGLES = [
  { l: "Require human approval before rejection", on: true },
  { l: "Log all AI decisions", on: true },
  { l: "Enable bias detection alerts", on: true },
  { l: "Mandatory re-review for borderline scores", on: false },
];

export function GovernanceTab() {
  return (
    <div>
      <h2 className="text-[17px] font-bold mb-5 text-ink">
        Governance & Compliance
      </h2>
      <Card padding="p-0" className="p-6">
        <div className="text-[11px] font-bold uppercase tracking-wide mb-4 text-ink3">
          Audit & Controls
        </div>
        {AUDIT_TOGGLES.map(({ l, on }) => (
          <div
            key={l}
            className="flex items-center justify-between py-3.5 border-b border-edge"
          >
            <span className="text-[13px] text-ink">{l}</span>
            <button
              className={`border-0 cursor-pointer shrink-0 w-11 h-6 rounded-xl p-0.5 transition-colors duration-200 ${
                on
                  ? "bg-brand shadow-[0_0_10px_rgba(124,111,255,0.3)]"
                  : "bg-edge2"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-all duration-200 ${
                  on ? "ml-5" : "ml-0"
                }`}
              />
            </button>
          </div>
        ))}
      </Card>
    </div>
  );
}
