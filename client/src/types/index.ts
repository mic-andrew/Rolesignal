// ── API wrappers (keep for server compatibility) ──────────────────────────────
export interface ItemResponse<T> { data: T; message: string; }
export interface ListResponse<T> { data: T[]; count: number; }

// ── Domain enums ──────────────────────────────────────────────────────────────
export type CandidateStatus = "shortlisted" | "reviewed" | "pending" | "rejected";
export type RoleStatus      = "live" | "draft" | "closed";
export type RoleSeniority   = "Junior" | "Mid" | "Senior" | "Lead";
export type InterviewStage  = "Intro" | "Technical" | "Behavioral" | "Situational" | "Closing";
export type AITone          = "Professional" | "Conversational" | "Challenging";
export type AuditEventType  = "ai" | "human" | "system";
export type SettingsTab     = "general" | "team" | "templates" | "ai" | "brand" | "governance" | "integrations";
export type PipelineStage   = "invited" | "scheduled" | "inProgress" | "completed" | "reviewed";

// ── Candidate ─────────────────────────────────────────────────────────────────
export interface CandidateSkills {
  tech: number;
  behavioral: number;
  communication: number;
  problemSolving: number;
  culture: number;
}

export interface Candidate {
  id: string;
  name: string;
  initials: string;
  score: number;
  status: CandidateStatus;
  date: string;
  skills: CandidateSkills;
  color: string;
  role: string;
  roleId: string;
  duration: number;
}

// ── Role ──────────────────────────────────────────────────────────────────────
export interface Role {
  id: string;
  title: string;
  department: string;
  seniority: RoleSeniority;
  location: string;
  candidateCount: number;
  avgScore: number;
  status: RoleStatus;
}

// ── Pipeline ──────────────────────────────────────────────────────────────────
export interface PipelineColumn {
  stage: PipelineStage;
  label: string;
  count: number;
  color: string;
  candidateIds: string[];
}

// ── Activity ──────────────────────────────────────────────────────────────────
export interface ActivityItem {
  id: string;
  emoji: string;
  text: string;
  timeAgo: string;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export interface DashboardMetrics {
  activeRoles: number;
  interviewsThisWeek: number;
  avgFitScore: number;
  pendingReviews: number;
}

// ── Interview setup ───────────────────────────────────────────────────────────
export interface SubCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
}

export interface Criterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  questionCount: number;
  color: string;
  subCriteria: SubCriterion[];
}

export interface InterviewConfig {
  duration: 15 | 30 | 45 | 60;
  tone: AITone;
  adaptiveDifficulty: boolean;
}

export interface SetupRoleData {
  title: string;
  department: string;
  seniority: RoleSeniority;
  location: string;
}

// ── Interview room ────────────────────────────────────────────────────────────
export interface TranscriptMessage {
  id: string;
  speaker: "ai" | "candidate";
  text: string;
  timestamp: string;
}

export interface InterviewQuestion {
  stage: InterviewStage;
  text: string;
}

// ── Evaluation ────────────────────────────────────────────────────────────────
export interface SubCriterionScore {
  name: string;
  score: number;
  rationale: string;
  evidence: string[];
  weight: number;
}

export interface CriterionScore {
  name: string;
  score: number;
  rationale: string;
  evidence: string[];
  riskFlags: string[];
  weight: number;
  subCriterionScores: SubCriterionScore[];
}

export interface CandidateEvaluation {
  candidate: Candidate;
  confidence: number;
  criterionScores: CriterionScore[];
  transcript: TranscriptMessage[];
}

export interface CriteriaTemplate {
  id: string;
  name: string;
  description: string;
  criteria: Array<{
    name: string;
    description: string;
    weight: number;
    subCriteria: Array<{
      name: string;
      description: string;
      weight: number;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
}

// ── Audit ─────────────────────────────────────────────────────────────────────
export interface AuditEvent {
  id: string;
  type: AuditEventType;
  action: string;
  detail: string;
  time: string;
  emoji: string;
}

export interface ReasoningStep {
  label: string;
  detail: string;
}

// ── Settings ──────────────────────────────────────────────────────────────────
export interface AIConfig {
  tone: AITone;
  formality: number;
  probingDepth: number;
  warmth: number;
  pace: number;
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: "Admin" | "Recruiter" | "Interviewer" | "Viewer";
  status: "active" | "invited";
}

export interface Integration {
  id: string;
  name: string;
  emoji: string;
  connected: boolean;
  description: string;
}

export interface InterviewTemplate {
  id: string;
  name: string;
  role: string;
  duration: number;
  criteriaCount: number;
  usedCount: number;
}

// ── Candidate grouping ───────────────────────────────────────────────────────
export interface RoleCandidateGroup {
  role: Role;
  candidates: Candidate[];
}

