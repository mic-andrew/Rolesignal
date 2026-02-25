import { Button } from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-9998 flex items-center justify-center bg-black/50 backdrop-blur-xs"
      onClick={onCancel}
    >
      <div
        className="bg-layer rounded-2xl p-6 w-[400px] max-w-[90vw] shadow-[0_16px_48px_rgba(0,0,0,0.2)] border border-edge"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-bold text-ink mb-2">
          {title}
        </h3>
        <p className="text-[13px] text-ink2 mb-5 leading-normal">
          {message}
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            className={variant === "danger" ? "bg-[#EF4444]!" : ""}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
