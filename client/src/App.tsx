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
import Evaluation     from "./pages/Evaluation";
import Scorecard      from "./pages/Scorecard";
import Candidates     from "./pages/Candidates";
import Settings       from "./pages/Settings";
import Audit          from "./pages/Audit";
import InterviewDetail from "./pages/InterviewDetail";
import CriteriaLibrary from "./pages/CriteriaLibrary";
import ThankYou        from "./pages/ThankYou";

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
        <Route path="/i/:token/complete"   element={<ThankYou />}      />

        {/* App shell (sidebar + header) */}
        <Route element={<Layout />}>
          <Route path="/dashboard"  element={<Dashboard />}      />
          <Route path="/interviews" element={<Interviews />}     />
          <Route path="/interviews/:roleId" element={<InterviewDetail />} />
          <Route path="/setup"      element={<SetupInterview />} />
          <Route path="/candidates" element={<Candidates />}     />
          <Route path="/evaluation/:candidateId?" element={<Evaluation />} />
          <Route path="/scorecard"  element={<Scorecard />}       />
          <Route path="/criteria"   element={<CriteriaLibrary />} />
          <Route path="/settings"   element={<Settings />}       />
          <Route path="/audit"      element={<Audit />}          />
        </Route>
      </Routes>
      <Toast />
    </BrowserRouter>
  );
}
