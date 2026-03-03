import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { RiPlayFill, RiUploadCloud2Line, RiRobot2Line, RiCloseLine } from "react-icons/ri";
import { useProblemDetail } from "../hooks/useProblemDetail";
import { useCodeEditor } from "../hooks/useCodeEditor";
import { useSubmission } from "../hooks/useSubmission";
import { useTutoring } from "../hooks/useTutoring";
import { useVoiceTutoring } from "../hooks/useVoiceTutoring";
import { CodeEditor } from "../components/shared/CodeEditor";
import { ProblemDescription } from "../components/shared/ProblemDescription";
import { TestResultPanel } from "../components/shared/TestResultPanel";
import { TutorChat } from "../components/shared/TutorChat";
import { VoiceTutorButton } from "../components/shared/VoiceTutorButton";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import type { Language } from "../types";

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "python",     label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "java",       label: "Java" },
  { value: "cpp",        label: "C++" },
  { value: "go",         label: "Go" },
];

export default function ProblemDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { problem, isLoading } = useProblemDetail(slug);
  const { language, setLanguage, code, setCode } = useCodeEditor(slug, problem?.starterCode);
  const {
    runCode, isRunning, runResults,
    submitCode, isSubmitting,
  } = useSubmission(slug ?? "");

  const [tutorOpen, setTutorOpen] = useState(false);

  const tutoring = useTutoring(problem?.id ?? "");
  const voice = useVoiceTutoring();

  // Start tutoring session when panel opens
  const handleOpenTutor = useCallback(() => {
    setTutorOpen(true);
    if (!tutoring.isActive) {
      tutoring.startSession(false);
    }
  }, [tutoring]);

  const handleCloseTutor = useCallback(() => {
    setTutorOpen(false);
    if (voice.connectionState === "connected") {
      voice.disconnect();
    }
  }, [voice]);

  const handleVoiceConnect = useCallback(() => {
    if (tutoring.sessionId) {
      voice.connect(tutoring.sessionId);
    }
  }, [tutoring.sessionId, voice]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        submitCode({ language, sourceCode: code });
      } else {
        runCode({ language, sourceCode: code });
      }
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault();
    }
  }, [language, code, runCode, submitCode]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (isLoading) return <LoadingSkeleton />;
  if (!problem) return <EmptyState title="Problem not found" description="This problem doesn't exist or has been removed." />;

  return (
    <div className="flex h-[calc(100vh-120px)] gap-0 -mx-8 -my-6 animate-fade-in">
      {/* Left Panel: Problem Description */}
      <div className="w-[45%] min-w-[400px] border-r border-edge bg-layer overflow-hidden flex flex-col">
        <ProblemDescription problem={problem} />
      </div>

      {/* Center Panel: Editor + Test Results */}
      <div className="flex-1 flex flex-col min-w-0 bg-layer">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-edge">
          {/* Language selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="input-field w-auto! min-w-[130px] text-xs"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>

          <div className="flex-1" />

          {/* Voice tutor controls (when panel is open) */}
          {tutorOpen && tutoring.isActive && (
            <VoiceTutorButton
              connectionState={voice.connectionState}
              isAiSpeaking={voice.isAiSpeaking}
              micEnabled={voice.micEnabled}
              onConnect={handleVoiceConnect}
              onDisconnect={voice.disconnect}
              onToggleMic={voice.toggleMic}
            />
          )}

          {/* AI Tutor toggle */}
          <button
            onClick={tutorOpen ? handleCloseTutor : handleOpenTutor}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              tutorOpen
                ? "bg-brand text-white"
                : "bg-brand/10 text-brand hover:bg-brand/20"
            }`}
          >
            <RiRobot2Line size={14} />
            AI Tutor
          </button>

          {/* Run button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => runCode({ language, sourceCode: code })}
            disabled={isRunning}
          >
            <RiPlayFill size={14} />
            {isRunning ? "Running..." : "Run"}
          </Button>

          {/* Submit button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => submitCode({ language, sourceCode: code })}
            disabled={isSubmitting}
          >
            <RiUploadCloud2Line size={14} />
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>

        {/* Code Editor */}
        <div className="flex-1 min-h-0">
          <CodeEditor
            language={language}
            value={code}
            onChange={setCode}
          />
        </div>

        {/* Test Results */}
        <div className="h-[250px] border-t border-edge">
          <TestResultPanel
            results={runResults ?? []}
            isRunning={isRunning}
          />
        </div>
      </div>

      {/* Right Panel: AI Tutor (collapsible) */}
      {tutorOpen && (
        <div className="w-[320px] border-l border-edge bg-layer flex flex-col">
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-edge">
            <div className="flex items-center gap-2">
              <RiRobot2Line size={16} className="text-brand" />
              <span className="text-sm font-semibold text-ink">AI Tutor</span>
            </div>
            <button
              onClick={handleCloseTutor}
              className="p-1 rounded hover:bg-canvas2 text-ink3 hover:text-ink transition-colors"
            >
              <RiCloseLine size={16} />
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <TutorChat
              messages={tutoring.messages}
              isSending={tutoring.isSending}
              onSendMessage={tutoring.sendMessage}
              currentCode={code}
              language={language}
            />
          </div>
        </div>
      )}
    </div>
  );
}
