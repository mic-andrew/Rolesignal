import { useSettings } from "../hooks/useSettings";
import { useConfirmModal } from "../hooks/useConfirmModal";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import { GeneralTab } from "../components/shared/settings/GeneralTab";
import { TeamTab } from "../components/shared/settings/TeamTab";
import { TemplatesTab } from "../components/shared/settings/TemplatesTab";
import { AIConfigTab } from "../components/shared/settings/AIConfigTab";
import { BrandingTab } from "../components/shared/settings/BrandingTab";
import { GovernanceTab } from "../components/shared/settings/GovernanceTab";
import { IntegrationsTab } from "../components/shared/settings/IntegrationsTab";
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

  const renderTab = () => {
    switch (activeTab) {
      case "general":      return <GeneralTab />;
      case "team":         return <TeamTab team={team} onInvite={inviteMember} onRemove={handleRemoveMember} />;
      case "templates":    return <TemplatesTab templates={templates} onDelete={handleDeleteTemplate} />;
      case "ai":           return <AIConfigTab aiConfig={aiConfig} tones={TONES} onSetTone={setTone} onSetSlider={setSlider} />;
      case "brand":        return <BrandingTab />;
      case "governance":   return <GovernanceTab />;
      case "integrations": return <IntegrationsTab integrations={integrations} onToggle={toggleIntegration} />;
    }
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
          {renderTab()}
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
