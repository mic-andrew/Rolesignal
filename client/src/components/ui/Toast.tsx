import { useEffect } from "react";
import { RiCheckLine, RiAlertLine, RiCloseLine, RiErrorWarningLine } from "react-icons/ri";
import { useUIStore } from "../../stores/uiStore";

const ICON_MAP = {
  success: RiCheckLine,
  warning: RiAlertLine,
  error: RiErrorWarningLine,
};

const COLOR_MAP = {
  success: "var(--color-success)",
  warning: "var(--color-warn)",
  error: "#EF4444",
};

export function Toast() {
  const toast = useUIStore((s) => s.toast);
  const dismiss = useUIStore((s) => s.dismissToast);

  useEffect(() => {
    if (!toast.visible) return;
    const timer = setTimeout(dismiss, 4000);
    return () => clearTimeout(timer);
  }, [toast.visible, dismiss]);

  if (!toast.visible) return null;

  const Icon = ICON_MAP[toast.variant];
  const color = COLOR_MAP[toast.variant];

  return (
    <div
      className="animate-fade-in"
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        background: "var(--color-layer)",
        border: `1px solid ${color}`,
        borderRadius: 10,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        minWidth: 280,
        maxWidth: 420,
      }}
    >
      <Icon size={18} style={{ color, flexShrink: 0 }} />
      <span className="flex-1" style={{ fontSize: 13, fontWeight: 500, color: "var(--color-ink)" }}>
        {toast.message}
      </span>
      <button
        onClick={dismiss}
        className="shrink-0 cursor-pointer"
        style={{
          background: "transparent",
          border: "none",
          color: "var(--color-ink3)",
          padding: 2,
          display: "flex",
        }}
      >
        <RiCloseLine size={16} />
      </button>
    </div>
  );
}
