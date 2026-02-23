import { RiInboxLine } from "react-icons/ri";

interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center" style={{ padding: "48px 0" }}>
      <RiInboxLine size={40} style={{ color: "var(--color-ink3)", marginBottom: 14 }} />
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--color-ink2)" }}>{title}</h3>
      {description && <p style={{ marginTop: 6, fontSize: 13, color: "var(--color-ink3)" }}>{description}</p>}
    </div>
  );
}
