import type {
  Candidate, Role, PipelineColumn, ActivityItem, DashboardMetrics,
  AuditEvent, ReasoningStep, CandidateEvaluation, TranscriptMessage,
  Integration, TeamMember, InterviewTemplate,
} from "../types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Static mock data ──────────────────────────────────────────────────────────

export const CANDIDATES: Candidate[] = [
  // ── Senior Frontend Engineer (r1) — 3 candidates ──
  {
    id: "1", name: "Sarah Chen", initials: "SC", score: 92,
    status: "shortlisted", date: "Feb 20", color: "#7C6FFF",
    role: "Senior Frontend Engineer", roleId: "r1", duration: 28,
    skills: { tech: 95, behavioral: 88, communication: 90, problemSolving: 94, culture: 91 },
  },
  {
    id: "2", name: "Marcus Johnson", initials: "MJ", score: 87,
    status: "reviewed", date: "Feb 19", color: "#22C997",
    role: "Senior Frontend Engineer", roleId: "r1", duration: 32,
    skills: { tech: 90, behavioral: 85, communication: 82, problemSolving: 89, culture: 88 },
  },
  {
    id: "3", name: "Priya Patel", initials: "PP", score: 84,
    status: "reviewed", date: "Feb 19", color: "#FFAD33",
    role: "Senior Frontend Engineer", roleId: "r1", duration: 26,
    skills: { tech: 82, behavioral: 88, communication: 86, problemSolving: 80, culture: 84 },
  },
  // ── Product Designer (r2) — 3 candidates ──
  {
    id: "4", name: "Alex Rivera", initials: "AR", score: 78,
    status: "pending", date: "Feb 21", color: "#EC4899",
    role: "Product Designer", roleId: "r2", duration: 30,
    skills: { tech: 72, behavioral: 80, communication: 85, problemSolving: 74, culture: 82 },
  },
  {
    id: "5", name: "Jordan Lee", initials: "JL", score: 83,
    status: "shortlisted", date: "Feb 22", color: "#F97316",
    role: "Product Designer", roleId: "r2", duration: 27,
    skills: { tech: 70, behavioral: 86, communication: 90, problemSolving: 82, culture: 88 },
  },
  {
    id: "6", name: "Emma Wilson", initials: "EW", score: 71,
    status: "rejected", date: "Feb 18", color: "#6B6B8A",
    role: "Product Designer", roleId: "r2", duration: 22,
    skills: { tech: 65, behavioral: 75, communication: 78, problemSolving: 68, culture: 72 },
  },
  // ── Data Scientist (r3) — 4 candidates ──
  {
    id: "7", name: "Kai Nakamura", initials: "KN", score: 91,
    status: "shortlisted", date: "Feb 20", color: "#06B6D4",
    role: "Data Scientist", roleId: "r3", duration: 35,
    skills: { tech: 94, behavioral: 86, communication: 84, problemSolving: 96, culture: 85 },
  },
  {
    id: "8", name: "Sofia Martinez", initials: "SM", score: 86,
    status: "reviewed", date: "Feb 19", color: "#A855F7",
    role: "Data Scientist", roleId: "r3", duration: 33,
    skills: { tech: 88, behavioral: 84, communication: 80, problemSolving: 90, culture: 82 },
  },
  {
    id: "9", name: "Liam O'Brien", initials: "LO", score: 79,
    status: "pending", date: "Feb 21", color: "#EAB308",
    role: "Data Scientist", roleId: "r3", duration: 29,
    skills: { tech: 82, behavioral: 76, communication: 74, problemSolving: 80, culture: 78 },
  },
  {
    id: "10", name: "Ava Thompson", initials: "AT", score: 74,
    status: "reviewed", date: "Feb 18", color: "#10B981",
    role: "Data Scientist", roleId: "r3", duration: 25,
    skills: { tech: 76, behavioral: 72, communication: 78, problemSolving: 70, culture: 74 },
  },
];

export const ROLES: Role[] = [
  { id: "r1", title: "Senior Frontend Engineer", department: "Engineering", seniority: "Senior", location: "Remote",        candidateCount: 3, avgScore: 88, status: "live", daysAgo: 6  },
  { id: "r2", title: "Product Designer",         department: "Design",      seniority: "Mid",    location: "San Francisco", candidateCount: 3, avgScore: 77, status: "live", daysAgo: 12 },
  { id: "r3", title: "Data Scientist",           department: "ML Team",     seniority: "Senior", location: "Remote",        candidateCount: 4, avgScore: 83, status: "live", daysAgo: 3  },
];

export const PIPELINE: PipelineColumn[] = [
  { stage: "invited",    label: "Invited",     count: 12, color: "#6A6A90", candidateIds: ["1","2","7","8"] },
  { stage: "scheduled",  label: "Scheduled",   count: 8,  color: "#7C6FFF", candidateIds: ["3","4","9"] },
  { stage: "inProgress", label: "In Progress", count: 2,  color: "#22C997", candidateIds: ["5"] },
  { stage: "completed",  label: "Completed",   count: 18, color: "#9D93FF", candidateIds: ["1","2","7"] },
  { stage: "reviewed",   label: "Reviewed",    count: 14, color: "#22C997", candidateIds: ["2","3","8","10"] },
];

export const METRICS: DashboardMetrics = {
  activeRoles: 8,
  interviewsThisWeek: 24,
  avgFitScore: 81,
  pendingReviews: 6,
};

export const ACTIVITY: ActivityItem[] = [
  { id: "a1", emoji: "🎯", text: "Sarah Chen scored 92 on Frontend Engineer",       timeAgo: "2m ago" },
  { id: "a2", emoji: "🎤", text: "Marcus Johnson completed interview",                timeAgo: "15m ago" },
  { id: "a3", emoji: "📋", text: "New criteria generated for Data Scientist",          timeAgo: "1h ago" },
  { id: "a4", emoji: "📩", text: "3 candidates invited for Product Designer",         timeAgo: "2h ago" },
  { id: "a5", emoji: "⚡", text: "AI flagged inconsistency in Alex Rivera responses", timeAgo: "3h ago" },
  { id: "a6", emoji: "✅", text: "Priya Patel moved to Shortlisted",                  timeAgo: "4h ago" },
];

export const TRANSCRIPT: TranscriptMessage[] = [
  { id: "t1", speaker: "ai",        text: "Welcome Sarah. Let's start with your experience building design systems. Can you walk me through a system you've built from scratch?", timestamp: "0:00" },
  { id: "t2", speaker: "candidate", text: "Sure! At my last company, I led the creation of our component library serving 12 product teams. We used React with TypeScript, Storybook for documentation, and Chromatic for visual regression testing.", timestamp: "0:45" },
  { id: "t3", speaker: "ai",        text: "That's a solid foundation. How did you handle versioning and breaking changes across 12 teams?", timestamp: "4:20" },
  { id: "t4", speaker: "candidate", text: "We implemented semantic versioning with automated changelogs. For breaking changes, we used a deprecation-first approach with codemods to automate migration.", timestamp: "5:10" },
  { id: "t5", speaker: "ai",        text: "Interesting approach. What was the most technically challenging aspect of maintaining consistency at that scale?", timestamp: "9:00" },
  { id: "t6", speaker: "candidate", text: "Token synchronization was the hardest part. We built a design token pipeline that pulled from Figma, transformed through Style Dictionary, and output platform-specific formats.", timestamp: "10:00" },
];

export const EVALUATION: CandidateEvaluation = {
  candidate: CANDIDATES[0],
  confidence: 96,
  criterionScores: [
    { name: "System Design",       score: 95, rationale: "Demonstrated deep understanding of distributed systems with real production examples from multiple scaling challenges.", evidence: ["t2", "t4"], riskFlags: [] },
    { name: "React & TypeScript",  score: 92, rationale: "Strong TypeScript generics usage. Explained discriminated unions and mapped types with practical team-wide adoption.", evidence: ["t2"], riskFlags: [] },
    { name: "Performance",         score: 88, rationale: "Detailed Core Web Vitals knowledge. Described bundle optimization reducing LCP by 40% with measurable production impact.", evidence: ["t6"], riskFlags: [] },
    { name: "Collaboration",       score: 90, rationale: "Led design system initiative across 12 product teams with clear deprecation protocols and migration support.", evidence: ["t2", "t4"], riskFlags: [] },
    { name: "Problem Solving",     score: 94, rationale: "Excellent structured thinking. Decomposed complex token synchronization into clear sub-problems with iterative solution design.", evidence: ["t6"], riskFlags: [] },
  ],
  transcript: TRANSCRIPT,
};

export const AUDIT_EVENTS: AuditEvent[] = [
  { id: "e1", type: "ai",     emoji: "🎯", action: "Score generated for Sarah Chen",              detail: "Overall: 92/100, Confidence: 96%",      time: "2:47 PM" },
  { id: "e2", type: "human",  emoji: "✅", action: "Jane Smith shortlisted Sarah Chen",            detail: "Override: None",                        time: "2:52 PM" },
  { id: "e3", type: "ai",     emoji: "🎤", action: "Interview completed: Marcus Johnson",          detail: "Duration: 32 min, 14 questions",        time: "1:15 PM" },
  { id: "e4", type: "ai",     emoji: "⚠️", action: "Risk flag: Alex Rivera inconsistency",        detail: "Conflicting claims about team size",    time: "11:30 AM" },
  { id: "e5", type: "system", emoji: "📋", action: "Criteria updated for Frontend Engineer",        detail: "System Design weight: 20% → 25%",      time: "10:00 AM" },
  { id: "e6", type: "human",  emoji: "👥", action: "3 candidates invited for Product Designer",   detail: "Invited by: Jane Smith",                time: "9:15 AM" },
];

export const REASONING_STEPS: ReasoningStep[] = [
  { label: "Input Analysis",    detail: "Parsed 14 responses across 5 criteria areas" },
  { label: "Pattern Detection", detail: "Identified strong system design knowledge" },
  { label: "Evidence Mapping",  detail: "Linked 8 transcript excerpts to evaluation criteria" },
  { label: "Score Computation", detail: "Weighted average: 92.4, rounded to 92" },
  { label: "Confidence",        detail: "High evidence density, consistent signals: 96%" },
];

export const TEAM_MEMBERS: TeamMember[] = [
  { id: "u1", name: "Jane Smith",     initials: "JS", email: "jane@acme.com",    role: "Admin",       status: "active" },
  { id: "u2", name: "Tom Davis",      initials: "TD", email: "tom@acme.com",     role: "Recruiter",   status: "active" },
  { id: "u3", name: "Lisa Park",      initials: "LP", email: "lisa@acme.com",    role: "Interviewer", status: "active" },
  { id: "u4", name: "Sam Okafor",     initials: "SO", email: "sam@acme.com",     role: "Viewer",      status: "invited" },
];

export const INTEGRATIONS: Integration[] = [
  { id: "i1", name: "Greenhouse",      emoji: "🌿", connected: true,  description: "ATS sync" },
  { id: "i2", name: "Lever",           emoji: "⚡", connected: false, description: "ATS sync" },
  { id: "i3", name: "Google Calendar", emoji: "📅", connected: true,  description: "Scheduling" },
  { id: "i4", name: "Slack",           emoji: "💬", connected: false, description: "Notifications" },
  { id: "i5", name: "Workday",         emoji: "📊", connected: false, description: "HRIS sync" },
  { id: "i6", name: "BambooHR",        emoji: "🎋", connected: false, description: "HRIS sync" },
];

export const TEMPLATES: InterviewTemplate[] = [
  { id: "tp1", name: "Full-Stack Engineer",    role: "Engineering", duration: 45, criteriaCount: 5, usedCount: 34 },
  { id: "tp2", name: "Product Manager",        role: "Product",     duration: 30, criteriaCount: 4, usedCount: 18 },
  { id: "tp3", name: "UX Designer",            role: "Design",      duration: 30, criteriaCount: 4, usedCount: 12 },
  { id: "tp4", name: "Data Scientist",         role: "Data",        duration: 60, criteriaCount: 6, usedCount: 9 },
];

// ── Async API functions ───────────────────────────────────────────────────────

export const seveumApi = {
  getCandidates: async (roleId?: string): Promise<Candidate[]> => {
    await delay(300);
    if (roleId) return CANDIDATES.filter((c) => c.roleId === roleId);
    return CANDIDATES;
  },

  getRoles: async (): Promise<Role[]> => {
    await delay(250);
    return ROLES;
  },

  getDashboard: async () => {
    await delay(350);
    return { metrics: METRICS, pipeline: PIPELINE, roles: ROLES, activity: ACTIVITY };
  },

  getEvaluation: async (candidateId: string): Promise<CandidateEvaluation> => {
    await delay(400);
    const candidate = CANDIDATES.find((c) => c.id === candidateId) ?? CANDIDATES[0];
    return { ...EVALUATION, candidate };
  },

  getAuditEvents: async (): Promise<AuditEvent[]> => {
    await delay(300);
    return AUDIT_EVENTS;
  },

  getTeam: async (): Promise<TeamMember[]> => {
    await delay(200);
    return TEAM_MEMBERS;
  },

  getIntegrations: async (): Promise<Integration[]> => {
    await delay(200);
    return INTEGRATIONS;
  },

  getTemplates: async (): Promise<InterviewTemplate[]> => {
    await delay(200);
    return TEMPLATES;
  },
};
