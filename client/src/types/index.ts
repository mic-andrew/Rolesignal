// ── Shared API wrappers ──────────────────────────────────────────────────────
export interface ItemResponse<T> { data: T; message: string; }
export interface ListResponse<T> { data: T[]; count: number; }

// ── Domain enums ─────────────────────────────────────────────────────────────
export type Difficulty = "easy" | "medium" | "hard";
export type TopicCategory = "core_dsa" | "advanced" | "system_design";
export type ProblemStatus = "active" | "draft";
export type UserProblemStatus = "not_started" | "attempted" | "solved";
export type SubmissionStatus =
  | "pending"
  | "running"
  | "accepted"
  | "wrong_answer"
  | "time_limit"
  | "runtime_error"
  | "compile_error";
export type Language = "python" | "javascript" | "typescript" | "java" | "cpp" | "go";
export type TutoringMessageType = "text" | "hint" | "explanation" | "code_review";

// ── Topic ────────────────────────────────────────────────────────────────────
export interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sortOrder: number;
  category: TopicCategory;
  problemCount: number;
}

// ── Problem ──────────────────────────────────────────────────────────────────
export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  topicId: string;
  topicName: string;
  acceptanceRate: number | null;
  acceptedCount: number;
  submissionCount: number;
  userStatus: UserProblemStatus;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ProblemDetail extends Problem {
  description: string;
  constraints: string[];
  examples: ProblemExample[];
  starterCode: Record<Language, string>;
  hints: string[];
  timeComplexity: string;
  spaceComplexity: string;
  timeLimitMs: number;
  memoryLimitKb: number;
}

// ── Test Case ────────────────────────────────────────────────────────────────
export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isSample: boolean;
}

// ── Submission ───────────────────────────────────────────────────────────────
export interface Submission {
  id: string;
  problemId: string;
  language: Language;
  status: SubmissionStatus;
  runtimeMs: number | null;
  memoryKb: number | null;
  createdAt: string;
}

export interface SubmissionDetail extends Submission {
  sourceCode: string;
  stdout: string | null;
  stderr: string | null;
}

// ── Test Result (for run, not submit) ────────────────────────────────────────
export interface TestResult {
  testCaseId: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  runtimeMs: number | null;
  status: SubmissionStatus;
}

// ── User Progress ────────────────────────────────────────────────────────────
export interface UserProgress {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  currentStreak: number;
  longestStreak: number;
  acceptanceRate: number;
  topicProgress: TopicProgress[];
}

export interface TopicProgress {
  topicId: string;
  topicName: string;
  solved: number;
  total: number;
}

// ── Tutoring ─────────────────────────────────────────────────────────────────
export interface TutoringMessage {
  id: string;
  speaker: "ai" | "user";
  content: string;
  messageType: TutoringMessageType;
  createdAt: string;
}

export interface TutoringSession {
  id: string;
  problemId: string;
  startedAt: string;
  endedAt: string | null;
  voiceEnabled: boolean;
}
