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
      className="animate-fade-in"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "var(--color-layer)",
          borderRadius: 14,
          padding: 24,
          width: 400,
          maxWidth: "90vw",
          boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
          border: "1px solid var(--color-edge)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-ink)", margin: "0 0 8px" }}>
          {title}
        </h3>
        <p style={{ fontSize: 13, color: "var(--color-ink2)", margin: "0 0 20px", lineHeight: 1.5 }}>
          {message}
        </p>
        <div className="flex justify-end" style={{ gap: 8 }}>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant={variant === "danger" ? "primary" : "primary"}
            size="sm"
            onClick={onConfirm}
            style={variant === "danger" ? { background: "#EF4444" } : undefined}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
