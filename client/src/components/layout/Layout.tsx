import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":  "Dashboard",
  "/interviews": "Interviews",
  "/setup":      "Create Interview",
  "/candidates": "Candidates",
  "/evaluation": "Evaluation",
  "/rankings":   "Candidate Rankings",
  "/settings":   "Settings",
  "/audit":      "Audit & Governance",
};

export function Layout() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? "RoleSignal";

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-screen min-w-0">
        <Header title={title} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
