import {
  RiArrowLeftLine,
  RiFileCopyLine,
  RiDeleteBinLine,
  RiAddLine,
  RiTimeLine,
  RiGroupLine,
} from "react-icons/ri";
import { useInterviewDetail } from "../hooks/useInterviewDetail";
import { useConfirmModal } from "../hooks/useConfirmModal";
import type { InterviewResponse } from "../api/interviews";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import { AddInterviewCandidateModal } from "../components/shared/AddInterviewCandidateModal";
import { useUIStore } from "../stores/uiStore";

function makeInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function deriveEffectiveStatus(interview: InterviewResponse): "pending" | "in_progress" | "completed" {
  if (interview.completedAt) return "completed";
  if (interview.startedAt) return "in_progress";
  return "pending";
}

interface CandidateRowProps {
  interview: InterviewResponse;
  onCopyLink: (link: string) => void;
  onDelete: (id: string) => void;
}

function CandidateRow({ interview, onCopyLink, onDelete }: CandidateRowProps) {
  const effectiveStatus = deriveEffectiveStatus(interview);
  const statusLabel =
    effectiveStatus === "in_progress" ? "In progress"
    : effectiveStatus === "completed" ? `Completed ${new Date(interview.completedAt!).toLocaleDateString()}`
    : "Pending";

  return (
    <div className="flex items-center gap-4 px-5 py-3.5 border-b border-edge last:border-b-0 transition-colors hover:bg-(--acg2)">
      <Avatar initials={makeInitials(interview.candidateName)} size={36} color="#7C6FFF" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-ink">
          {interview.candidateName}
        </div>
        {interview.candidateEmail && (
          <div className="text-[11px] text-ink3 mt-0.5 truncate">
            {interview.candidateEmail}
          </div>
        )}
        <div className="text-xs text-ink3 mt-0.5">
          {statusLabel}
        </div>
      </div>
      <Badge variant={effectiveStatus} />
      <div className="flex items-center gap-1">
        <button
          onClick={() => onCopyLink(interview.link)}
          title="Copy interview link"
          className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent border-none cursor-pointer text-ink3 transition-colors hover:text-brand hover:bg-(--acg)"
        >
          <RiFileCopyLine size={15} />
        </button>
        <button
          onClick={() => onDelete(interview.id)}
          title="Delete interview"
          className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent border-none cursor-pointer text-ink3 transition-colors hover:text-danger hover:bg-(--acg)"
        >
          <RiDeleteBinLine size={15} />
        </button>
      </div>
    </div>
  );
}

export default function InterviewDetail() {
  const hook = useInterviewDetail();
  const modal = useConfirmModal();
  const showToast = useUIStore((s) => s.showToast);

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    showToast("Interview link copied", "success");
  };

  const handleDelete = async (id: string) => {
    const confirmed = await modal.confirm({
      title: "Delete interview",
      message: "This will remove the candidate's interview. This action cannot be undone.",
      confirmLabel: "Delete",
      variant: "danger",
    });
    if (confirmed) hook.deleteInterview(id);
  };

  if (hook.isLoading) return <LoadingSkeleton rows={6} />;

  return (
    <div className="space-y-6 max-w-[900px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 animate-fade-in">
        <Button variant="ghost" size="sm" onClick={hook.goBack}>
          <RiArrowLeftLine size={16} />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-ink">
            {hook.role?.title ?? "Interview"}
          </h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-ink3">
            <span>{hook.role?.department}</span>
            <span>&middot;</span>
            <span>{hook.role?.seniority}</span>
            {hook.role?.status && (
              <>
                <span>&middot;</span>
                <Badge variant={hook.role.status === "live" ? "live" : "pending"} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 animate-fade-in delay-1">
        <Card padding="p-0" className="px-4 py-3 text-center">
          <div className="text-[10px] font-bold uppercase tracking-widest text-ink3 mb-1">Total</div>
          <div className="text-xl font-extrabold text-ink">{hook.stats.total}</div>
        </Card>
        <Card padding="p-0" className="px-4 py-3 text-center">
          <div className="text-[10px] font-bold uppercase tracking-widest text-ink3 mb-1">Pending</div>
          <div className="text-xl font-extrabold text-warn">{hook.stats.pending}</div>
        </Card>
        <Card padding="p-0" className="px-4 py-3 text-center">
          <div className="text-[10px] font-bold uppercase tracking-widest text-ink3 mb-1">In Progress</div>
          <div className="text-xl font-extrabold text-brand">{hook.stats.inProgress}</div>
        </Card>
        <Card padding="p-0" className="px-4 py-3 text-center">
          <div className="text-[10px] font-bold uppercase tracking-widest text-ink3 mb-1">Completed</div>
          <div className="text-xl font-extrabold text-success">{hook.stats.completed}</div>
        </Card>
      </div>

      {/* Interview config */}
      {hook.interviews.length > 0 && (
        <Card padding="p-0" className="px-5 py-4 animate-fade-in delay-2">
          <div className="text-xs font-bold uppercase tracking-widest text-ink3 mb-3">
            Interview Configuration
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-ink2">
              <RiTimeLine size={15} className="text-ink3" />
              <span className="text-sm font-medium">
                {hook.interviews[0].configDuration} minutes
              </span>
            </div>
            <div className="flex items-center gap-2 text-ink2">
              <RiGroupLine size={15} className="text-ink3" />
              <span className="text-sm font-medium">
                {hook.interviews[0].configTone} tone
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Candidates list */}
      <div className="animate-fade-in delay-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-ink">
            Candidates ({hook.stats.total})
          </h2>
          <Button size="sm" onClick={hook.openAddModal}>
            <RiAddLine size={14} />
            Add Candidate
          </Button>
        </div>

        <Card padding="p-0">
          {hook.interviews.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-ink3">No candidates yet. Click "Add Candidate" to get started.</p>
            </div>
          ) : (
            hook.interviews.map((iv) => (
              <CandidateRow
                key={iv.id}
                interview={iv}
                onCopyLink={handleCopyLink}
                onDelete={handleDelete}
              />
            ))
          )}
        </Card>
      </div>

      {/* Add Candidate Modal */}
      {hook.isAddModalOpen && (
        <AddInterviewCandidateModal
          name={hook.newName}
          email={hook.newEmail}
          isEmailValid={hook.isEmailValid}
          isPending={hook.isAddingCandidate}
          onNameChange={hook.setNewName}
          onEmailChange={hook.setNewEmail}
          onSubmit={hook.addCandidate}
          onClose={hook.closeAddModal}
        />
      )}

      <ConfirmModal
        isOpen={modal.isOpen}
        title={modal.config.title}
        message={modal.config.message}
        confirmLabel={modal.config.confirmLabel}
        variant={modal.config.variant}
        onConfirm={modal.handleConfirm}
        onCancel={modal.handleCancel}
      />
    </div>
  );
}
