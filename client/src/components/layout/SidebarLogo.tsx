import { useNavigate } from "react-router-dom";
import logoSrc from "../../assets/logo.png";

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
      <img src={logoSrc} alt="RoleSignal" width={28} height={28} className="rounded-lg shrink-0" />
      {!collapsed && (
        <span className="text-[17px] font-extrabold tracking-[-0.03em] whitespace-nowrap bg-linear-to-br from-ink to-ink2 bg-clip-text text-transparent">
          RoleSignal
        </span>
      )}
    </button>
  );
}
