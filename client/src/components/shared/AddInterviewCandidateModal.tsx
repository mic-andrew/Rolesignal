import {
  RiCloseLine,
  RiLoader4Line,
  RiUserAddLine,
  RiUserLine,
  RiMailLine,
  RiCheckLine,
} from "react-icons/ri";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface AddInterviewCandidateModalProps {
  name: string;
  email: string;
  isEmailValid: boolean;
  isPending: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function AddInterviewCandidateModal({
  name,
  email,
  isEmailValid,
  isPending,
  onNameChange,
  onEmailChange,
  onSubmit,
  onClose,
}: AddInterviewCandidateModalProps) {
  const canSubmit = name.trim().length > 0 && isEmailValid && !isPending;
  const showEmailError = email.length > 0 && !isEmailValid;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs z-100"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <Card className="animate-fade-in-scale w-full max-w-[440px] p-0! overflow-hidden">
        {/* Accent bar */}
        <div className="h-[3px] bg-linear-to-r from-brand to-[#6358E0]" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-edge">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-(--acg) flex items-center justify-center">
              <RiUserAddLine size={16} className="text-brand" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-ink">Add Candidate</h3>
              <p className="text-[11px] text-ink3">Add a new candidate to this interview</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-transparent border border-edge text-ink3 cursor-pointer hover:bg-layer2 transition-colors"
          >
            <RiCloseLine size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
          className="px-6 py-5"
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold mb-2 text-ink2">
                <RiUserLine size={13} className="text-ink3" />
                Full Name
              </label>
              <input
                className="input-field"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                autoFocus
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold mb-2 text-ink2">
                <RiMailLine size={13} className="text-ink3" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  className={`input-field ${showEmailError ? "border-danger!" : ""}`}
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                />
                {isEmailValid && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <RiCheckLine size={14} className="text-success" />
                  </div>
                )}
              </div>
              {showEmailError && (
                <p className="text-[11px] text-danger mt-1">Please enter a valid email address</p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-2.5">
            <Button variant="ghost" size="sm" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button size="sm" type="submit" disabled={!canSubmit}>
              {isPending ? (
                <RiLoader4Line size={14} className="animate-spin-slow" />
              ) : (
                <>
                  <RiUserAddLine size={14} />
                  Add Candidate
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
