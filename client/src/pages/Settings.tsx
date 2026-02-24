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

const inputCls: React.CSSProperties = {
  width: "100%", padding: "11px 14px",
  background: "var(--color-canvas2)", border: "1px solid var(--color-edge)",
  borderRadius: 8, color: "var(--color-ink)", fontSize: 13,
};

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
      <div className="flex" style={{ gap: 28 }}>
        {/* Tab sidebar */}
        <div className="shrink-0 animate-fade-in" style={{ width: 180 }}>
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="w-full rounded-lg text-left border-0 cursor-pointer transition-all"
              style={{
                padding: "9px 14px",
                fontSize: 13,
                marginBottom: 2,
                background: activeTab === id ? "var(--acg)" : "transparent",
                color: activeTab === id ? "var(--color-brand2)" : "var(--color-ink3)",
                fontWeight: activeTab === id ? 700 : 500,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 animate-fade-in-scale" key={activeTab}>
          {/* General */}
          {activeTab === "general" && (
            <div>
              <h2 className="text-[17px] font-bold mb-4" style={{ color: "var(--color-ink)" }}>Organization</h2>
              <Card padding="p-0" style={{ padding: 24 }}>
                <div className="text-[11px] font-bold uppercase tracking-wide mb-4" style={{ color: "var(--color-ink3)" }}>Company Details</div>
                <div className="grid grid-cols-2 gap-3.5">
                  {[
                    { l: "Company Name", v: "Acme Corp"  },
                    { l: "Industry",     v: "Technology" },
                    { l: "Company Size", v: "201\u2013500"    },
                    { l: "Website",      v: "acme.com"   },
                  ].map(({ l, v }) => (
                    <div key={l}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-ink2)" }}>{l}</label>
                      <input style={inputCls} defaultValue={v} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <Button size="sm">Save Changes</Button>
                </div>
              </Card>
            </div>
          )}

          {/* Team */}
          {activeTab === "team" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[17px] font-bold" style={{ color: "var(--color-ink)" }}>Team Members</h2>
                <Button size="sm" onClick={() => inviteMember("new@example.com")}>Invite Member</Button>
              </div>
              <Card padding="p-0" className="overflow-hidden">
                {team.map((member, i) => (
                  <div
                    key={member.id}
                    className="flex items-center"
                    style={{ gap: 14, padding: "14px 20px", borderBottom: i < team.length - 1 ? "1px solid var(--color-edge)" : "none" }}
                  >
                    <Avatar initials={member.initials} size={36} color={member.status === "active" ? "#7C6FFF" : "#6B6B8A"} />
                    <div className="flex-1">
                      <div className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>{member.name}</div>
                      <div className="text-xs" style={{ color: "var(--color-ink3)" }}>{member.email}</div>
                    </div>
                    <span className="text-xs font-medium rounded-md" style={{ color: "var(--color-ink2)", padding: "4px 10px", background: "var(--color-layer2)" }}>
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

          {/* Templates */}
          {activeTab === "templates" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[17px] font-bold" style={{ color: "var(--color-ink)" }}>Interview Templates</h2>
                <Button size="sm">New Template</Button>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                {templates.map((t) => (
                  <Card key={t.id} glow padding="p-0" style={{ padding: 20 }}>
                    <div className="text-sm font-bold mb-1" style={{ color: "var(--color-ink)" }}>{t.name}</div>
                    <div className="text-xs mb-3.5" style={{ color: "var(--color-ink3)" }}>{t.role}</div>
                    <div className="flex gap-2 mb-4">
                      {[{ l: "Duration", v: `${t.duration}m` }, { l: "Criteria", v: t.criteriaCount }, { l: "Used", v: t.usedCount }].map(({ l, v }) => (
                        <div key={l} className="flex-1 text-center rounded-lg" style={{ padding: "8px 10px", background: "var(--color-canvas2)", border: "1px solid var(--color-edge)" }}>
                          <div className="text-sm font-bold font-mono" style={{ color: "var(--color-brand)" }}>{v}</div>
                          <div className="text-[10px] mt-0.5" style={{ color: "var(--color-ink3)" }}>{l}</div>
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

          {/* AI Config */}
          {activeTab === "ai" && (
            <div>
              <h2 className="text-[17px] font-bold mb-4" style={{ color: "var(--color-ink)" }}>AI Configuration</h2>
              <Card padding="p-0" style={{ padding: 24 }}>
                <div className="text-[11px] font-bold uppercase tracking-wide mb-3.5" style={{ color: "var(--color-ink3)" }}>Interview Tone</div>
                <div className="flex gap-2.5 mb-7">
                  {TONES.map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setTone(tone)}
                      className="flex-1 cursor-pointer border-0 text-center transition-all rounded-xl"
                      style={{
                        padding: 16,
                        border: aiConfig.tone === tone ? "2px solid var(--color-brand)" : "1px solid var(--color-edge)",
                        background: aiConfig.tone === tone ? "var(--acg)" : "var(--color-layer)",
                      }}
                    >
                      <div className="text-[13px] font-bold mb-1" style={{ color: aiConfig.tone === tone ? "var(--color-brand)" : "var(--color-ink)" }}>{tone}</div>
                      <div className="text-[11px]" style={{ color: "var(--color-ink3)" }}>{tone === "Professional" ? "Formal" : tone === "Conversational" ? "Warm & natural" : "Rigorous"}</div>
                    </button>
                  ))}
                </div>

                <div className="text-[11px] font-bold uppercase tracking-wide mb-3.5" style={{ color: "var(--color-ink3)" }}>Behavior Sliders</div>
                {([
                  { key: "formality",    label: "Formality"     },
                  { key: "probingDepth", label: "Probing Depth" },
                  { key: "warmth",       label: "Warmth"        },
                  { key: "pace",         label: "Pace"          },
                ] as const).map(({ key, label }) => (
                  <div key={key} className="mb-4">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs font-medium" style={{ color: "var(--color-ink2)" }}>{label}</span>
                      <span className="text-xs font-bold font-mono" style={{ color: "var(--color-brand)" }}>{aiConfig[key]}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={aiConfig[key]}
                      onChange={(e) => setSlider(key, Number(e.target.value))}
                      style={{
                        width: "100%",
                        background: `linear-gradient(90deg, var(--color-brand) ${aiConfig[key]}%, var(--color-edge) ${aiConfig[key]}%)`,
                      }}
                    />
                  </div>
                ))}
              </Card>
            </div>
          )}

          {/* Branding */}
          {activeTab === "brand" && (
            <div>
              <h2 className="text-[17px] font-bold mb-4" style={{ color: "var(--color-ink)" }}>Branding</h2>
              <Card padding="p-0" style={{ padding: 24 }}>
                <div className="text-[11px] font-bold uppercase tracking-wide mb-3.5" style={{ color: "var(--color-ink3)" }}>Logo</div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center text-xl font-bold rounded-xl" style={{ width: 72, height: 72, color: "var(--color-brand)", background: "var(--acg)", border: "2px dashed var(--color-edge2)" }}>S</div>
                  <Button variant="ghost" size="sm">Upload Logo</Button>
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wide mb-3.5" style={{ color: "var(--color-ink3)" }}>Brand Color</div>
                <div className="flex gap-2.5">
                  {["#7C6FFF", "#22C997", "#FFAD33", "#EC4899", "#3B82F6"].map((c) => (
                    <button
                      key={c}
                      className="cursor-pointer transition-all"
                      style={{ width: 44, height: 44, borderRadius: 10, background: c, border: c === "#7C6FFF" ? "2px solid #fff" : "2px solid transparent" }}
                    />
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Governance */}
          {activeTab === "governance" && (
            <div>
              <h2 className="text-[17px] font-bold mb-4" style={{ color: "var(--color-ink)" }}>Governance & Compliance</h2>
              <Card padding="p-0" style={{ padding: 24 }}>
                <div className="text-[11px] font-bold uppercase tracking-wide mb-3.5" style={{ color: "var(--color-ink3)" }}>Audit & Controls</div>
                {[
                  { l: "Require human approval before rejection", on: true  },
                  { l: "Log all AI decisions",                   on: true  },
                  { l: "Enable bias detection alerts",           on: true  },
                  { l: "Mandatory re-review for borderline scores", on: false },
                ].map(({ l, on }) => (
                  <div key={l} className="flex items-center justify-between" style={{ padding: "12px 0", borderBottom: "1px solid var(--color-edge)" }}>
                    <span className="text-[13px]" style={{ color: "var(--color-ink)" }}>{l}</span>
                    <div
                      className="cursor-pointer"
                      style={{ width: 44, height: 24, borderRadius: 12, padding: 2, background: on ? "var(--color-brand)" : "var(--color-edge2)", boxShadow: on ? "0 0 10px rgba(124,111,255,0.3)" : "none", transition: "all 0.2s" }}
                    >
                      <div style={{ width: 20, height: 20, borderRadius: 10, background: "#fff", marginLeft: on ? 20 : 0, transition: "margin 0.2s" }} />
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {/* Integrations */}
          {activeTab === "integrations" && (
            <div>
              <h2 className="text-[17px] font-bold mb-4" style={{ color: "var(--color-ink)" }}>Integrations</h2>
              <div className="grid grid-cols-2 gap-3.5">
                {integrations.map((int) => (
                  <Card key={int.id} glow padding="p-0" className="flex items-center justify-between" style={{ padding: "16px 20px" }}>
                    <div className="flex items-center gap-3">
                      <span className="text-[22px]">{int.emoji}</span>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>{int.name}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Badge variant={int.connected ? "live" : "pending"} />
                          <span className="text-xs" style={{ color: "var(--color-ink3)" }}>{int.description}</span>
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
