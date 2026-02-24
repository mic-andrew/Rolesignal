import { RiInboxLine } from "react-icons/ri";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center" style={{ padding: "48px 0" }}>
      <RiInboxLine size={40} style={{ color: "var(--color-ink3)", marginBottom: 14 }} />
      <h3 className="text-sm font-semibold" style={{ color: "var(--color-ink2)" }}>{title}</h3>
      {description && <p className="text-[13px] mt-1.5" style={{ color: "var(--color-ink3)" }}>{description}</p>}
      {action && (
        <Button size="sm" onClick={action.onClick} style={{ marginTop: 16 }}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
