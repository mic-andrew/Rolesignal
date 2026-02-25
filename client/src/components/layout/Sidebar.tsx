import {
  RiDashboardLine, RiBriefcaseLine, RiGroupLine, RiVideoOnLine,
  RiBarChartLine, RiFileTextLine, RiSettings3Line, RiFileList2Line,
} from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { useUIStore } from "../../stores/uiStore";
import { useAuth } from "../../hooks/useAuth";
import { useConfirmModal } from "../../hooks/useConfirmModal";
import { ConfirmModal } from "../ui/ConfirmModal";
import { interviewsApi } from "../../api/interviews";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarNavItem } from "./SidebarNavItem";
import { CollapseToggle } from "./CollapseToggle";
import { LiveIndicator, SidebarUserButton } from "./SidebarFooter";

const NAV_ITEMS = [
  { to: "/dashboard",  icon: RiDashboardLine, label: "Dashboard"        },
  { to: "/interviews", icon: RiVideoOnLine,   label: "Interviews"       },
  { to: "/candidates", icon: RiGroupLine,     label: "Candidates"       },
  { to: "/setup",      icon: RiBriefcaseLine, label: "Create Interview" },
  { to: "/scorecard",   icon: RiBarChartLine,  label: "Scorecard"        },
  { to: "/criteria",   icon: RiFileList2Line, label: "Criteria"         },
  { to: "/audit",      icon: RiFileTextLine,  label: "Audit Log"        },
  { to: "/settings",   icon: RiSettings3Line, label: "Settings"         },
];

export function Sidebar() {
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
        className={`bg-canvas2 border-r border-edge flex flex-col shrink-0 h-screen sticky top-0 transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
          collapsed ? "w-16" : "w-[230px]"
        }`}
      >
        <div className={`flex items-center ${collapsed ? "justify-center pt-5 px-0" : "justify-between pt-5 px-3"}`}>
          <SidebarLogo collapsed={collapsed} />
          {!collapsed && <CollapseToggle collapsed={false} onToggle={toggle} />}
        </div>
        {collapsed && <CollapseToggle collapsed onToggle={toggle} />}

        <nav className={`flex-1 flex flex-col gap-0.5 overflow-hidden ${collapsed ? "px-2 mt-5" : "px-3 mt-8"}`}>
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <SidebarNavItem key={to} to={to} icon={icon} label={label} collapsed={collapsed} />
          ))}
        </nav>

        <div className={`border-t border-edge flex flex-col gap-2 shrink-0 ${collapsed ? "py-3.5 px-2" : "py-3.5 px-3"}`}>
          <LiveIndicator count={liveQuery.data ?? 0} collapsed={collapsed} />
          <SidebarUserButton
            name={user?.name ?? "User"}
            initials={user?.initials ?? "??"}
            role={user?.role ?? "Admin"}
            collapsed={collapsed}
            onClick={handleLogout}
          />
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
