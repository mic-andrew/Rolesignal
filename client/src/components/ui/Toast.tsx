import { useEffect } from "react";
import { RiCheckLine, RiAlertLine, RiCloseLine, RiErrorWarningLine } from "react-icons/ri";
import { useUIStore } from "../../stores/uiStore";

const ICON_MAP = {
  success: RiCheckLine,
  warning: RiAlertLine,
  error: RiErrorWarningLine,
};

const BORDER_CLASSES = {
  success: "border-success",
  warning: "border-warn",
  error: "border-danger",
};

const ICON_CLASSES = {
  success: "text-success",
  warning: "text-warn",
  error: "text-danger",
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

  return (
    <div
      className={`animate-fade-in fixed top-5 right-5 z-9999 flex items-center gap-2.5 px-4 py-3 bg-layer border rounded-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.15)] min-w-[280px] max-w-[420px] ${BORDER_CLASSES[toast.variant]}`}
    >
      <Icon size={18} className={`shrink-0 ${ICON_CLASSES[toast.variant]}`} />
      <span className="flex-1 text-[13px] font-medium text-ink">
        {toast.message}
      </span>
      <button
        onClick={dismiss}
        className="shrink-0 cursor-pointer bg-transparent border-none text-ink3 p-0.5 flex"
      >
        <RiCloseLine size={16} />
      </button>
    </div>
  );
}
