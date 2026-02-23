import { RiSearchLine, RiNotification3Line } from "react-icons/ri";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header
      className="flex items-center justify-between shrink-0"
      style={{ padding: "14px 28px", borderBottom: "1px solid var(--color-edge)", background: "var(--color-canvas)" }}
    >
      <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--color-ink)" }}>{title}</h1>

      <div className="flex items-center gap-3.5">
        <div
          className="flex items-center gap-2 cursor-pointer"
          style={{ padding: "7px 16px", background: "var(--color-layer)", border: "1px solid var(--color-edge)", borderRadius: 8, fontSize: 12, color: "var(--color-ink3)", fontWeight: 500 }}
        >
          <RiSearchLine size={16} />
          <span>Search...</span>
          <span
            style={{ padding: "1px 6px", background: "var(--color-edge)", borderRadius: 4, fontSize: 10, fontWeight: 600, marginLeft: 8 }}
          >
            /
          </span>
        </div>

        <button
          className="relative cursor-pointer bg-transparent border-0 text-ink2"
          aria-label="Notifications"
          style={{ padding: 6 }}
        >
          <RiNotification3Line size={18} />
          <span
            className="absolute flex items-center justify-center text-white"
            style={{
              top: 2, right: 2, width: 14, height: 14, borderRadius: "50%",
              background: "var(--color-danger)", fontSize: 9, fontWeight: 700,
              border: "2px solid var(--color-canvas)",
            }}
          >
            3
          </span>
        </button>
      </div>
    </header>
  );
}
