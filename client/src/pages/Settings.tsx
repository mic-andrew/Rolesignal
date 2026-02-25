import { useSettings } from "../hooks/useSettings";
import { useConfirmModal } from "../hooks/useConfirmModal";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Avatar } from "../components/ui/Avatar";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import type { SettingsTab, AITone } from "../types";

const TABS: Array<{ id: SettingsTab; label: string }> = [
  { id: "general",      label: "General"      },
  { id: "team",         label: "Team"         },
  { id: "templates",    label: "Templates"    },
  { id: "ai",           label: "AI Config"    },
  { id: "brand",        label: "Branding"     },
  { id: "governance",   label: "Governance"   },
  { id: "integrations", label: "Integrations" },
];

const TONES: AITone[] = ["Professional", "Conversational", "Challenging"];

const INPUT_CLS = "w-full px-3.5 py-[11px] bg-canvas2 border border-edge rounded-lg text-ink text-[13px] outline-none";

export default function Settings() {
  const {
    activeTab, setActiveTab, aiConfig, setTone, setSlider,
    team, integrations, templates,
    inviteMember, removeMember, deleteTemplate, toggleIntegration,
  } = useSettings();
  const modal = useConfirmModal();

  const handleRemoveMember = async (id: string, name: string) => {
    const confirmed = await modal.confirm({
      title: "Remove Team Member",
      message: `Are you sure you want to remove ${name} from the team? They will lose access immediately.`,
      confirmLabel: "Remove",
      variant: "danger",
    });
    if (confirmed) removeMember(id);
  };

  const handleDeleteTemplate = async (id: string, name: string) => {
    const confirmed = await modal.confirm({
      title: "Delete Template",
      message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      confirmLabel: "Delete",
      variant: "danger",
    });
    if (confirmed) deleteTemplate(id);
  };

  return (
    <>
      <div className="flex gap-7">
        <div className="shrink-0 animate-fade-in w-[180px]">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full rounded-lg text-left border-0 cursor-pointer transition-all px-3.5 py-2 text-[13px] mb-0.5 ${
                activeTab === id
                  ? "bg-(--acg) text-brand2 font-bold"
                  : "bg-transparent text-ink3 font-medium hover:text-ink2 hover:bg-(--acg2)"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 animate-fade-in-scale" key={activeTab}>
          {activeTab === "general" && (
            <div>
              <h2 className="text-[17px] font-bold mb-5 text-ink">Organization</h2>
              <Card padding="p-0" className="p-6">
                <div className="text-[11px] font-bold uppercase tracking-wide mb-4 text-ink3">Company Details</div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { l: "Company Name", v: "Acme Corp"  },
                    { l: "Industry",     v: "Technology" },
                    { l: "Company Size", v: "201\u2013500"    },
                    { l: "Website",      v: "acme.com"   },
                  ].map(({ l, v }) => (
                    <div key={l}>
                      <label className="block text-xs font-semibold mb-1.5 text-ink2">{l}</label>
                      <input className={INPUT_CLS} defaultValue={v} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-5">
                  <Button size="sm">Save Changes</Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "team" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[17px] font-bold text-ink">Team Members</h2>
                <Button size="sm" onClick={() => inviteMember("new@example.com")}>Invite Member</Button>
              </div>
              <Card padding="p-0" className="overflow-hidden">
                {team.map((member, i) => (
                  <div
                    key={member.id}
                    className={`flex items-center gap-3.5 px-5 py-4 ${
                      i < team.length - 1 ? "border-b border-edge" : ""
                    }`}
                  >
                    <Avatar initials={member.initials} size={36} color={member.status === "active" ? "#7C6FFF" : "#6B6B8A"} />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-ink">{member.name}</div>
                      <div className="text-xs text-ink3">{member.email}</div>
                    </div>
                    <span className="text-xs font-medium rounded-md text-ink2 px-2.5 py-1 bg-layer2">
                      {member.role}
                    </span>
                    <Badge variant={member.status === "active" ? "active" : "invited"} />
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(member.id, member.name)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {activeTab === "templates" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[17px] font-bold text-ink">Interview Templates</h2>
                <Button size="sm">New Template</Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {templates.map((t) => (
                  <Card key={t.id} glow padding="p-0" className="p-5">
                    <div className="text-sm font-bold mb-1 text-ink">{t.name}</div>
                    <div className="text-xs mb-4 text-ink3">{t.role}</div>
                    <div className="flex gap-2 mb-4">
                      {[{ l: "Duration", v: `${t.duration}m` }, { l: "Criteria", v: t.criteriaCount }, { l: "Used", v: t.usedCount }].map(({ l, v }) => (
                        <div key={l} className="flex-1 text-center rounded-lg px-2.5 py-2 bg-canvas2 border border-edge">
                          <div className="text-sm font-bold font-mono text-brand">{v}</div>
                          <div className="text-[10px] mt-0.5 text-ink3">{l}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="flex-1 justify-center">Use Template</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteTemplate(t.id, t.name)}>Delete</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "ai" && (
            <div>
              <h2 className="text-[17px] font-bold mb-5 text-ink">AI Configuration</h2>
              <Card padding="p-0" className="p-6">
                <div className="text-[11px] font-bold uppercase tracking-wide mb-4 text-ink3">Interview Tone</div>
                <div className="flex gap-2.5 mb-7">
                  {TONES.map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setTone(tone)}
                      className={`flex-1 cursor-pointer text-center transition-all p-4 rounded-xl ${
                        aiConfig.tone === tone
                          ? "border-2 border-brand bg-(--acg)"
                          : "border border-edge bg-layer"
                      }`}
                    >
                      <div className={`text-[13px] font-bold mb-1 ${
                        aiConfig.tone === tone ? "text-brand" : "text-ink"
                      }`}>{tone}</div>
                      <div className="text-[11px] text-ink3">{tone === "Professional" ? "Formal" : tone === "Conversational" ? "Warm & natural" : "Rigorous"}</div>
                    </button>
                  ))}
                </div>

                <div className="text-[11px] font-bold uppercase tracking-wide mb-4 text-ink3">Behavior Sliders</div>
                {([
                  { key: "formality",    label: "Formality"     },
                  { key: "probingDepth", label: "Probing Depth" },
                  { key: "warmth",       label: "Warmth"        },
                  { key: "pace",         label: "Pace"          },
                ] as const).map(({ key, label }) => (
                  <div key={key} className="mb-4">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs font-medium text-ink2">{label}</span>
                      <span className="text-xs font-bold font-mono text-brand">{aiConfig[key]}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={aiConfig[key]}
                      onChange={(e) => setSlider(key, Number(e.target.value))}
                      className="w-full"
                      style={{
                        background: `linear-gradient(90deg, var(--color-brand) ${aiConfig[key]}%, var(--color-edge) ${aiConfig[key]}%)`,
                      }}
                    />
                  </div>
                ))}
              </Card>
            </div>
          )}

          {activeTab === "brand" && (
            <div>
              <h2 className="text-[17px] font-bold mb-5 text-ink">Branding</h2>
              <Card padding="p-0" className="p-6">
                <div className="text-[11px] font-bold uppercase tracking-wide mb-4 text-ink3">Logo</div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center text-xl font-bold rounded-xl w-[72px] h-[72px] text-brand bg-(--acg) border-2 border-dashed border-edge2">S</div>
                  <Button variant="ghost" size="sm">Upload Logo</Button>
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wide mb-4 text-ink3">Brand Color</div>
                <div className="flex gap-2.5">
                  {["#7C6FFF", "#22C997", "#FFAD33", "#EC4899", "#3B82F6"].map((c) => (
                    <button
                      key={c}
                      className={`w-11 h-11 rounded-[10px] cursor-pointer transition-all border-0 ${
                        c === "#7C6FFF" ? "ring-2 ring-white" : ""
                      }`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === "governance" && (
            <div>
              <h2 className="text-[17px] font-bold mb-5 text-ink">Governance & Compliance</h2>
              <Card padding="p-0" className="p-6">
                <div className="text-[11px] font-bold uppercase tracking-wide mb-4 text-ink3">Audit & Controls</div>
                {[
                  { l: "Require human approval before rejection", on: true  },
                  { l: "Log all AI decisions",                   on: true  },
                  { l: "Enable bias detection alerts",           on: true  },
                  { l: "Mandatory re-review for borderline scores", on: false },
                ].map(({ l, on }) => (
                  <div key={l} className="flex items-center justify-between py-3.5 border-b border-edge">
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
          )}

          {activeTab === "integrations" && (
            <div>
              <h2 className="text-[17px] font-bold mb-5 text-ink">Integrations</h2>
              <div className="grid grid-cols-2 gap-4">
                {integrations.map((int) => (
                  <Card key={int.id} glow padding="p-0" className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[22px]">{int.emoji}</span>
                      <div>
                        <div className="text-sm font-semibold text-ink">{int.name}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Badge variant={int.connected ? "live" : "pending"} />
                          <span className="text-xs text-ink3">{int.description}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={int.connected ? "ghost" : "primary"}
                      size="sm"
                      onClick={() => toggleIntegration(int.id)}
                    >
                      {int.connected ? "Configure" : "Connect"}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={modal.isOpen}
        title={modal.config.title}
        message={modal.config.message}
        confirmLabel={modal.config.confirmLabel}
        variant={modal.config.variant}
        onConfirm={modal.handleConfirm}
        onCancel={modal.handleCancel}
      />
    </>
  );
}
