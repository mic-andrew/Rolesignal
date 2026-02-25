import { RiInboxLine } from "react-icons/ri";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <RiInboxLine size={40} className="text-ink3 mb-4" />
      <h3 className="text-sm font-semibold text-ink2">{title}</h3>
      {description && <p className="text-[13px] mt-1.5 max-w-[440px] text-ink3">{description}</p>}
      {action && (
        <Button size="sm" onClick={action.onClick} className="mt-5">
          {action.label}
        </Button>
      )}
    </div>
  );
}
