import { NavLink, useNavigate } from "react-router-dom";
import {
  RiDashboardLine, RiBriefcaseLine, RiGroupLine, RiVideoOnLine,
  RiBarChartLine, RiFileTextLine, RiSettings3Line, RiMenuFoldLine, RiMenuUnfoldLine,
  RiFileList2Line,
} from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "../ui/Avatar";
import { useUIStore } from "../../stores/uiStore";
import { useAuth } from "../../hooks/useAuth";
import { useConfirmModal } from "../../hooks/useConfirmModal";
import { ConfirmModal } from "../ui/ConfirmModal";
import { interviewsApi } from "../../api/interviews";

const NAV_ITEMS = [
  { to: "/dashboard",  icon: RiDashboardLine, label: "Dashboard"        },
  { to: "/interviews", icon: RiVideoOnLine,   label: "Interviews"       },
  { to: "/candidates", icon: RiGroupLine,     label: "Candidates"       },
  { to: "/setup",      icon: RiBriefcaseLine, label: "Create Interview" },
  { to: "/rankings",   icon: RiBarChartLine,  label: "Rankings"         },
  { to: "/criteria",   icon: RiFileList2Line, label: "Criteria"         },
  { to: "/audit",      icon: RiFileTextLine,  label: "Audit Log"        },
  { to: "/settings",   icon: RiSettings3Line, label: "Settings"         },
];

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#7C6FFF" />
          <stop offset="1" stopColor="#5046E5" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#lg)" />
      <path d="M8 16L16 8L24 16L16 24Z" fill="white" opacity="0.85" />
      <path d="M12 16L16 12L20 16L16 20Z" fill="url(#lg)" />
    </svg>
  );
}

export function Sidebar() {
  const navigate = useNavigate();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggle = useUIStore((s) => s.toggleSidebar);
  const { user, logout } = useAuth();
  const modal = useConfirmModal();

  const liveQuery = useQuery({
    queryKey: ["interviews", "live"],
    queryFn: () => interviewsApi.live(),
    staleTime: 15_000,
    enabled: !!user,
  });

  const liveCount = liveQuery.data ?? 0;

  const handleLogout = async () => {
    const confirmed = await modal.confirm({
      title: "Sign out",
      message: "Are you sure you want to sign out of your account?",
      confirmLabel: "Sign Out",
      variant: "danger",
    });
    if (confirmed) logout();
  };

  return (
    <>
      <aside
        className={`bg-canvas2 border-r border-edge flex flex-col shrink-0 h-screen sticky top-0 transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${collapsed ? "w-16" : "w-[230px]"}`}
      >
        <div
          className={`flex items-center ${collapsed ? "justify-center pt-5 px-0" : "justify-between pt-5 px-3"}`}
        >
          <button
            onClick={() => navigate("/dashboard")}
            className={`flex items-center gap-2.5 cursor-pointer bg-transparent border-none overflow-hidden ${collapsed ? "p-0 justify-center w-full" : "py-0 px-3"}`}
          >
            <Logo />
            {!collapsed && (
              <span
                className="text-[17px] font-extrabold tracking-[-0.03em] whitespace-nowrap bg-linear-to-br from-ink to-ink2 bg-clip-text text-transparent"
              >
                RoleSignal
              </span>
            )}
          </button>
          {!collapsed && (
            <button
              onClick={toggle}
              className="w-7 h-7 rounded-md flex items-center justify-center cursor-pointer bg-transparent border-none text-ink3 shrink-0 transition-all duration-150 hover:text-ink2 hover:bg-(--acg2)"
            >
              <RiMenuFoldLine size={16} />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            onClick={toggle}
            className="w-8 h-8 rounded-md flex items-center justify-center cursor-pointer bg-transparent border-none text-ink3 mx-auto mt-2.5 transition-all duration-150 hover:text-ink2 hover:bg-(--acg2)"
          >
            <RiMenuUnfoldLine size={16} />
          </button>
        )}

        <nav
          className={`flex-1 flex flex-col gap-0.5 overflow-hidden ${collapsed ? "px-2 mt-5" : "px-3 mt-8"}`}
        >
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} title={collapsed ? label : undefined} className="no-underline">
              {({ isActive }) => (
                <div
                  className={`flex items-center gap-[11px] rounded-lg cursor-pointer text-[13px] tracking-[-0.01em] whitespace-nowrap overflow-hidden transition-all duration-150 ease-in-out ${
                    collapsed ? "py-2.5 px-0 justify-center" : "py-[9px] px-3"
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
          ))}
        </nav>

        <div
          className={`border-t border-edge flex flex-col gap-2 shrink-0 ${collapsed ? "py-3.5 px-2" : "py-3.5 px-3"}`}
        >
          {liveCount > 0 && (
            <button
              title={collapsed ? `${liveCount} Live Interview${liveCount !== 1 ? "s" : ""}` : undefined}
              className={`flex items-center gap-[9px] cursor-pointer bg-transparent border-none rounded-lg overflow-hidden w-full ${
                collapsed ? "py-1.5 px-0 justify-center" : "py-1.5 px-3"
              }`}
            >
              <span
                className="w-[7px] h-[7px] rounded-full bg-success shadow-[0_0_8px_var(--color-success)] shrink-0 animate-breathe"
              />
              {!collapsed && (
                <span className="text-xs font-medium text-ink2 whitespace-nowrap">
                  {liveCount} Live Interview{liveCount !== 1 ? "s" : ""}
                </span>
              )}
            </button>
          )}
          <button
            onClick={handleLogout}
            title={collapsed ? (user?.name ?? "User") : undefined}
            className={`flex items-center gap-[9px] cursor-pointer bg-transparent border-none rounded-lg transition-colors duration-150 overflow-hidden w-full hover:bg-(--acg2) ${
              collapsed ? "py-1.5 px-0 justify-center" : "py-1.5 px-3"
            }`}
          >
            <Avatar initials={user?.initials ?? "??"} size={26} color="#7C6FFF" />
            {!collapsed && (
              <div className="text-left whitespace-nowrap">
                <div className="text-xs font-semibold text-ink">{user?.name ?? "User"}</div>
                <div className="text-[10px] text-ink3">{user?.role ?? "Admin"}</div>
              </div>
            )}
          </button>
        </div>
      </aside>
      <ConfirmModal
        isOpen={modal.isOpen}
        title={modal.config.title}
        message={modal.config.message}
        confirmLabel={modal.config.confirmLabel}
        variant={modal.config.variant}
        onConfirm={modal.handleConfirm}
        onCancel={modal.handleCancel}
      />
    </>
  );
}
