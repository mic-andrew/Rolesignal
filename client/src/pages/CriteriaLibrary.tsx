import { RiAddLine, RiUploadLine } from "react-icons/ri";
import { useCriteriaLibrary } from "../hooks/useCriteriaLibrary";
import { Button } from "../components/ui/Button";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import { CriteriaTemplateCard } from "../components/shared/CriteriaTemplateCard";

export default function CriteriaLibrary() {
  const {
    templates,
    isLoading,
    editingId,
    setEditingId,
    createTemplate,
    isCreating,
    updateTemplate,
    isUpdating,
    handleDelete,
    handleImport,
    isImporting,
    fileInputRef,
    modal,
  } = useCriteriaLibrary();

  if (isLoading) return <LoadingSkeleton />;

  return (
    <>
      <div className="max-w-[960px] space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-ink">
              Criteria Library
            </h1>
            <p className="text-xs text-ink3 mt-1">
              Reusable evaluation templates for your interviews
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
            >
              <RiUploadLine size={14} />
              {isImporting ? "Importing..." : "Import Document"}
            </Button>
            <Button
              size="sm"
              onClick={() =>
                createTemplate({
                  name: "New Template",
                  description: "",
                  criteria: [
                    {
                      name: "Example Criterion",
                      description: "What this evaluates",
                      weight: 100,
                      sub_criteria: [
                        { name: "Sub-criterion 1", description: "", weight: 50 },
                        { name: "Sub-criterion 2", description: "", weight: 50 },
                      ],
                    },
                  ],
                })
              }
              disabled={isCreating}
            >
              <RiAddLine size={14} />
              New Template
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImport(file);
            e.target.value = "";
          }}
        />

        {templates.length === 0 ? (
          <EmptyState
            title="No criteria templates yet"
            description="Create a template from scratch or import from a criteria document."
          />
        ) : (
          <div className="space-y-3">
            {templates.map((t) => (
              <CriteriaTemplateCard
                key={t.id}
                template={t}
                isEditing={editingId === t.id}
                onEdit={() => setEditingId(t.id)}
                onCancel={() => setEditingId(null)}
                onSave={(payload) =>
                  updateTemplate({ id: t.id, payload })
                }
                isSaving={isUpdating}
                onDelete={() => handleDelete(t)}
              />
            ))}
          </div>
        )}
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
