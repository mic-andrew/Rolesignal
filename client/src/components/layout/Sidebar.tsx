import { NavLink, useNavigate } from "react-router-dom";
import {
  RiDashboardLine, RiBriefcaseLine, RiGroupLine, RiVideoOnLine,
  RiBarChartLine, RiFileTextLine, RiSettings3Line, RiMenuFoldLine, RiMenuUnfoldLine,
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
        style={{
          width: collapsed ? 64 : 220,
          background: "var(--color-canvas2)",
          borderRight: "1px solid var(--color-edge)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          height: "100vh",
          position: "sticky",
          top: 0,
          transition: "width 0.25s cubic-bezier(0.16,1,0.3,1)",
          overflow: "hidden",
        }}
      >
        {/* Logo row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            padding: collapsed ? "20px 0 0" : "20px 10px 0",
          }}
        >
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              background: "transparent",
              border: "none",
              padding: collapsed ? "0" : "0 12px",
              justifyContent: collapsed ? "center" : undefined,
              width: collapsed ? "100%" : undefined,
              overflow: "hidden",
            }}
          >
            <Logo />
            {!collapsed && (
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  whiteSpace: "nowrap",
                  background: "linear-gradient(135deg, var(--color-ink), var(--color-ink2))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                RoleSignal
              </span>
            )}
          </button>
          {!collapsed && (
            <button
              onClick={toggle}
              style={{
                width: 28, height: 28, borderRadius: 6,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", background: "transparent", border: "none",
                color: "var(--color-ink3)", flexShrink: 0,
                transition: "color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-ink2)"; e.currentTarget.style.background = "var(--acg2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-ink3)"; e.currentTarget.style.background = "transparent"; }}
            >
              <RiMenuFoldLine size={16} />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            onClick={toggle}
            style={{
              width: 32, height: 32, borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", background: "transparent", border: "none",
              color: "var(--color-ink3)", margin: "10px auto 0",
              transition: "color 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-ink2)"; e.currentTarget.style.background = "var(--acg2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-ink3)"; e.currentTarget.style.background = "transparent"; }}
          >
            <RiMenuUnfoldLine size={16} />
          </button>
        )}

        {/* Nav */}
        <nav
          style={{
            flex: 1, display: "flex", flexDirection: "column", gap: 2,
            padding: collapsed ? "0 8px" : "0 10px",
            marginTop: collapsed ? 20 : 36, overflow: "hidden",
          }}
        >
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} title={collapsed ? label : undefined} style={{ textDecoration: "none" }}>
              {({ isActive }) => (
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: 11,
                    padding: collapsed ? "10px 0" : "9px 12px", borderRadius: 8,
                    cursor: "pointer",
                    background: isActive ? "var(--acg)" : "transparent",
                    color: isActive ? "var(--color-brand2)" : "var(--color-ink3)",
                    fontWeight: isActive ? 600 : 500, fontSize: 13,
                    transition: "all 0.15s ease", letterSpacing: "-0.01em",
                    justifyContent: collapsed ? "center" : undefined,
                    whiteSpace: "nowrap", overflow: "hidden",
                  }}
                >
                  <Icon size={18} style={{ opacity: isActive ? 1 : 0.6, flexShrink: 0 }} />
                  {!collapsed && label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid var(--color-edge)",
            padding: collapsed ? "14px 8px" : "14px 10px",
            display: "flex", flexDirection: "column", gap: 8, flexShrink: 0,
          }}
        >
          {liveCount > 0 && (
            <button
              title={collapsed ? `${liveCount} Live Interview${liveCount !== 1 ? "s" : ""}` : undefined}
              style={{
                display: "flex", alignItems: "center", gap: 9,
                padding: collapsed ? "6px 0" : "6px 12px",
                cursor: "pointer", background: "transparent", border: "none",
                borderRadius: 8, justifyContent: collapsed ? "center" : undefined,
                overflow: "hidden", width: "100%",
              }}
            >
              <span
                style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "var(--color-success)",
                  boxShadow: "0 0 8px var(--color-success)", flexShrink: 0,
                }}
                className="animate-breathe"
              />
              {!collapsed && (
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-ink2)", whiteSpace: "nowrap" }}>
                  {liveCount} Live Interview{liveCount !== 1 ? "s" : ""}
                </span>
              )}
            </button>
          )}
          <button
            onClick={handleLogout}
            title={collapsed ? (user?.name ?? "User") : undefined}
            style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: collapsed ? "6px 0" : "6px 12px",
              cursor: "pointer", background: "transparent", border: "none",
              borderRadius: 8, justifyContent: collapsed ? "center" : undefined,
              transition: "background 0.15s", overflow: "hidden", width: "100%",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--acg2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <Avatar initials={user?.initials ?? "??"} size={26} color="#7C6FFF" />
            {!collapsed && (
              <div style={{ textAlign: "left", whiteSpace: "nowrap" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink)" }}>{user?.name ?? "User"}</div>
                <div style={{ fontSize: 10, color: "var(--color-ink3)" }}>{user?.role ?? "Admin"}</div>
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
