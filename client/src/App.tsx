import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Toast } from "./components/ui/Toast";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import TopicExplorer from "./pages/TopicExplorer";
import Progress from "./pages/Progress";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default → Auth */}
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* Full-bleed (no sidebar) */}
        <Route path="/auth" element={<Auth />} />

        {/* App shell (sidebar + header) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:slug" element={<ProblemDetail />} />
          <Route path="/topics" element={<TopicExplorer />} />
          <Route path="/progress" element={<Progress />} />
        </Route>
      </Routes>
      <Toast />
    </BrowserRouter>
  );
}
