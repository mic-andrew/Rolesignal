import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";

import Auth           from "./pages/Auth";
import Dashboard      from "./pages/Dashboard";
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
        <Route path="/auth"        element={<Auth />}         />
        <Route path="/lobby"       element={<Lobby />}        />
        <Route path="/interview"   element={<InterviewRoom />}/>
        <Route path="/processing"  element={<Processing />}   />

        {/* App shell (sidebar + header) */}
        <Route element={<Layout />}>
          <Route path="/dashboard"  element={<Dashboard />}      />
          <Route path="/setup"      element={<SetupInterview />} />
          <Route path="/candidates" element={<Candidates />}     />
          <Route path="/evaluation/:candidateId?" element={<Evaluation />} />
          <Route path="/rankings"   element={<Rankings />}       />
          <Route path="/settings"   element={<Settings />}       />
          <Route path="/audit"      element={<Audit />}          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
