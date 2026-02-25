import { Avatar } from "../ui/Avatar";

interface LiveIndicatorProps {
  count: number;
  collapsed: boolean;
}

export function LiveIndicator({ count, collapsed }: LiveIndicatorProps) {
  if (count === 0) return null;
  return (
    <button
      title={collapsed ? `${count} Live Interview${count !== 1 ? "s" : ""}` : undefined}
      className={`flex items-center gap-2.5 cursor-pointer bg-transparent border-none rounded-lg overflow-hidden w-full ${
        collapsed ? "py-1.5 px-0 justify-center" : "py-1.5 px-3"
      }`}
    >
      <span className="w-[7px] h-[7px] rounded-full bg-success shadow-[0_0_8px_var(--color-success)] shrink-0 animate-breathe" />
      {!collapsed && (
        <span className="text-xs font-medium text-ink2 whitespace-nowrap">
          {count} Live Interview{count !== 1 ? "s" : ""}
        </span>
      )}
    </button>
  );
}

interface SidebarUserButtonProps {
  name: string;
  initials: string;
  role: string;
  collapsed: boolean;
  onClick: () => void;
}

export function SidebarUserButton({ name, initials, role, collapsed, onClick }: SidebarUserButtonProps) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? name : undefined}
      className={`flex items-center gap-2.5 cursor-pointer bg-transparent border-none rounded-lg transition-colors duration-150 overflow-hidden w-full hover:bg-(--acg2) ${
        collapsed ? "py-1.5 px-0 justify-center" : "py-1.5 px-3"
      }`}
    >
      <Avatar initials={initials} size={26} color="#7C6FFF" />
      {!collapsed && (
        <div className="text-left whitespace-nowrap">
          <div className="text-xs font-semibold text-ink">{name}</div>
          <div className="text-[10px] text-ink3">{role}</div>
        </div>
      )}
    </button>
  );
}
