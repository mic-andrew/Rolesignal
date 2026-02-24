import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Toast } from "./components/ui/Toast";

import Auth           from "./pages/Auth";
import Onboarding     from "./pages/Onboarding";
import Dashboard      from "./pages/Dashboard";
import Interviews     from "./pages/Interviews";
import SetupInterview from "./pages/SetupInterview";
import Lobby          from "./pages/Lobby";
import InterviewRoom  from "./pages/InterviewRoom";
import Processing     from "./pages/Processing";
import Evaluation     from "./pages/Evaluation";
import Rankings       from "./pages/Rankings";
import Candidates     from "./pages/Candidates";
import Settings       from "./pages/Settings";
import Audit          from "./pages/Audit";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default → Auth */}
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* Full-bleed (no sidebar) */}
        <Route path="/auth"        element={<Auth />}          />
        <Route path="/onboarding"  element={<Onboarding />}    />

        {/* Candidate-facing interview (whitelabel, no auth) */}
        <Route path="/i/:token"            element={<Lobby />}         />
        <Route path="/i/:token/interview"  element={<InterviewRoom />} />
        <Route path="/i/:token/complete"   element={<Processing />}    />

        {/* App shell (sidebar + header) */}
        <Route element={<Layout />}>
          <Route path="/dashboard"  element={<Dashboard />}      />
          <Route path="/interviews" element={<Interviews />}     />
          <Route path="/setup"      element={<SetupInterview />} />
          <Route path="/candidates" element={<Candidates />}     />
          <Route path="/evaluation/:candidateId?" element={<Evaluation />} />
          <Route path="/rankings"   element={<Rankings />}       />
          <Route path="/settings"   element={<Settings />}       />
          <Route path="/audit"      element={<Audit />}          />
        </Route>
      </Routes>
      <Toast />
    </BrowserRouter>
  );
}
