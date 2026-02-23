import { useSettings } from "../hooks/useSettings";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Avatar } from "../components/ui/Avatar";
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
  const { activeTab, setActiveTab, aiConfig, setTone, setSlider, team, integrations, templates } = useSettings();

  return (
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
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--color-ink)", marginBottom: 18 }}>Organization</h2>
            <Card padding="p-0" style={{ padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-ink3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>Company Details</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { l: "Company Name", v: "Acme Corp"  },
                  { l: "Industry",     v: "Technology" },
                  { l: "Company Size", v: "201\u2013500"    },
                  { l: "Website",      v: "acme.com"   },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-ink2)", marginBottom: 6 }}>{l}</label>
                    <input style={inputCls} defaultValue={v} />
                  </div>
                ))}
              </div>
              <div className="flex justify-end" style={{ marginTop: 18 }}>
                <Button size="sm">Save Changes</Button>
              </div>
            </Card>
          </div>
        )}

        {/* Team */}
        {activeTab === "team" && (
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--color-ink)" }}>Team Members</h2>
              <Button size="sm">Invite Member</Button>
            </div>
            <Card padding="p-0" className="overflow-hidden">
              {team.map((member, i) => (
                <div
                  key={member.id}
                  className="flex items-center"
                  style={{ gap: 14, padding: "14px 20px", borderBottom: i < team.length - 1 ? "1px solid var(--color-edge)" : "none" }}
                >
                  <Avatar initials={member.initials} size={36} color={member.status === "active" ? "#7C6FFF" : "#6B6B8A"} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-ink)" }}>{member.name}</div>
                    <div style={{ fontSize: 12, color: "var(--color-ink3)" }}>{member.email}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-ink2)", padding: "4px 10px", borderRadius: 6, background: "var(--color-layer2)" }}>
                    {member.role}
                  </span>
                  <Badge variant={member.status === "active" ? "active" : "invited"} />
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* Templates */}
        {activeTab === "templates" && (
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--color-ink)" }}>Interview Templates</h2>
              <Button size="sm">New Template</Button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {templates.map((t) => (
                <Card key={t.id} glow padding="p-0" style={{ padding: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)", marginBottom: 3 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "var(--color-ink3)", marginBottom: 14 }}>{t.role}</div>
                  <div className="flex" style={{ gap: 8, marginBottom: 16 }}>
                    {[{ l: "Duration", v: `${t.duration}m` }, { l: "Criteria", v: t.criteriaCount }, { l: "Used", v: t.usedCount }].map(({ l, v }) => (
                      <div key={l} style={{ flex: 1, padding: "8px 10px", borderRadius: 8, textAlign: "center", background: "var(--color-canvas2)", border: "1px solid var(--color-edge)" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-family-mono)", color: "var(--color-brand)" }}>{v}</div>
                        <div style={{ fontSize: 10, color: "var(--color-ink3)", marginTop: 2 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="w-full justify-center">Use Template</Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* AI Config */}
        {activeTab === "ai" && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--color-ink)", marginBottom: 18 }}>AI Configuration</h2>
            <Card padding="p-0" style={{ padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-ink3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Interview Tone</div>
              <div className="flex" style={{ gap: 10, marginBottom: 28 }}>
                {TONES.map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setTone(tone)}
                    className="flex-1 cursor-pointer border-0 text-center transition-all"
                    style={{
                      padding: 16, borderRadius: 12,
                      border: aiConfig.tone === tone ? "2px solid var(--color-brand)" : "1px solid var(--color-edge)",
                      background: aiConfig.tone === tone ? "var(--acg)" : "var(--color-layer)",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3, color: aiConfig.tone === tone ? "var(--color-brand)" : "var(--color-ink)" }}>{tone}</div>
                    <div style={{ fontSize: 11, color: "var(--color-ink3)" }}>{tone === "Professional" ? "Formal" : tone === "Conversational" ? "Warm & natural" : "Rigorous"}</div>
                  </button>
                ))}
              </div>

              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-ink3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Behavior Sliders</div>
              {([
                { key: "formality",    label: "Formality"     },
                { key: "probingDepth", label: "Probing Depth" },
                { key: "warmth",       label: "Warmth"        },
                { key: "pace",         label: "Pace"          },
              ] as const).map(({ key, label }) => (
                <div key={key} style={{ marginBottom: 18 }}>
                  <div className="flex justify-between" style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-ink2)" }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "var(--font-family-mono)", color: "var(--color-brand)" }}>{aiConfig[key]}%</span>
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
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--color-ink)", marginBottom: 18 }}>Branding</h2>
            <Card padding="p-0" style={{ padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-ink3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Logo</div>
              <div className="flex items-center" style={{ gap: 16, marginBottom: 24 }}>
                <div className="flex items-center justify-center" style={{ width: 72, height: 72, borderRadius: 12, fontSize: 20, fontWeight: 700, color: "var(--color-brand)", background: "var(--acg)", border: "2px dashed var(--color-edge2)" }}>S</div>
                <Button variant="ghost" size="sm">Upload Logo</Button>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-ink3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Brand Color</div>
              <div className="flex" style={{ gap: 10 }}>
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
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--color-ink)", marginBottom: 18 }}>Governance & Compliance</h2>
            <Card padding="p-0" style={{ padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-ink3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Audit & Controls</div>
              {[
                { l: "Require human approval before rejection", on: true  },
                { l: "Log all AI decisions",                   on: true  },
                { l: "Enable bias detection alerts",           on: true  },
                { l: "Mandatory re-review for borderline scores", on: false },
              ].map(({ l, on }) => (
                <div key={l} className="flex items-center justify-between" style={{ padding: "12px 0", borderBottom: "1px solid var(--color-edge)" }}>
                  <span style={{ fontSize: 13, color: "var(--color-ink)" }}>{l}</span>
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
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--color-ink)", marginBottom: 18 }}>Integrations</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {integrations.map((int) => (
                <Card key={int.id} glow padding="p-0" className="flex items-center justify-between" style={{ padding: "16px 20px" }}>
                  <div className="flex items-center" style={{ gap: 12 }}>
                    <span style={{ fontSize: 22 }}>{int.emoji}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-ink)" }}>{int.name}</div>
                      <div className="flex items-center" style={{ gap: 6, marginTop: 3 }}>
                        <Badge variant={int.connected ? "live" : "pending"} />
                        <span style={{ fontSize: 12, color: "var(--color-ink3)" }}>{int.description}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant={int.connected ? "ghost" : "primary"} size="sm">
                    {int.connected ? "Configure" : "Connect"}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
