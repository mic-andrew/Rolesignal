import { useNavigate } from "react-router-dom";

interface SidebarLogoProps {
  collapsed: boolean;
}

export function SidebarLogo({ collapsed }: SidebarLogoProps) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/dashboard")}
      className={`flex items-center gap-2.5 cursor-pointer bg-transparent border-none overflow-hidden ${
        collapsed ? "p-0 justify-center w-full" : "py-0 px-3"
      }`}
    >
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="shrink-0">
        <defs>
          <linearGradient id="sidebar-lg" x1="0" y1="0" x2="32" y2="32">
            <stop stopColor="#7C6FFF" />
            <stop offset="1" stopColor="#5046E5" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="url(#sidebar-lg)" />
        <path d="M8 16L16 8L24 16L16 24Z" fill="white" opacity="0.85" />
        <path d="M12 16L16 12L20 16L16 20Z" fill="url(#sidebar-lg)" />
      </svg>
      {!collapsed && (
        <span className="text-[17px] font-extrabold tracking-[-0.03em] whitespace-nowrap bg-linear-to-br from-ink to-ink2 bg-clip-text text-transparent">
          RoleSignal
        </span>
      )}
    </button>
  );
}
