import { NavLink } from "react-router-dom";
import type { IconType } from "react-icons";

interface SidebarNavItemProps {
  to: string;
  icon: IconType;
  label: string;
  collapsed: boolean;
}

export function SidebarNavItem({ to, icon: Icon, label, collapsed }: SidebarNavItemProps) {
  return (
    <NavLink to={to} title={collapsed ? label : undefined} className="no-underline">
      {({ isActive }) => (
        <div
          className={`flex items-center gap-3 rounded-lg cursor-pointer text-[13px] tracking-[-0.01em] whitespace-nowrap overflow-hidden transition-all duration-150 ease-in-out ${
            collapsed ? "py-2.5 px-0 justify-center" : "py-2.5 px-3"
          } ${
            isActive
              ? "bg-(--acg) text-brand2 font-semibold"
              : "bg-transparent text-ink3 font-medium hover:text-ink2 hover:bg-(--acg2)"
          }`}
        >
          <Icon size={18} className={`shrink-0 ${isActive ? "opacity-100" : "opacity-60"}`} />
          {!collapsed && label}
        </div>
      )}
    </NavLink>
  );
}
