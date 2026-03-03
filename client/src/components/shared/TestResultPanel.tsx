import { useState } from "react";
import { RiCheckboxCircleFill, RiCloseCircleFill } from "react-icons/ri";
import type { TestResult } from "../../types";

interface TestResultPanelProps {
  results: TestResult[];
  isRunning?: boolean;
}

export function TestResultPanel({ results, isRunning = false }: TestResultPanelProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (isRunning) {
    return (
      <div className="flex items-center justify-center h-full gap-2 text-sm text-ink2">
        <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin-slow" />
        Running code...
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-ink3">
        Run your code to see test results
      </div>
    );
  }

  const passed = results.filter((r) => r.passed).length;
  const current = results[activeTab];

  return (
    <div className="flex flex-col h-full">
      {/* Summary */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-edge">
        <span className={`text-sm font-semibold ${passed === results.length ? "text-success" : "text-danger"}`}>
          {passed}/{results.length} test cases passed
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-edge overflow-x-auto">
        {results.map((r, i) => (
          <button
            key={r.testCaseId}
            onClick={() => setActiveTab(i)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === i
                ? "bg-brand text-white"
                : r.passed
                  ? "bg-(--grg) text-success"
                  : "bg-(--rdg) text-danger"
            }`}
          >
            {r.passed ? <RiCheckboxCircleFill size={12} /> : <RiCloseCircleFill size={12} />}
            Case {i + 1}
          </button>
        ))}
      </div>

      {/* Detail */}
      {current && (
        <div className="flex-1 overflow-auto p-4 space-y-3 text-sm">
          <div>
            <span className="text-xs font-medium text-ink3 block mb-1">Input</span>
            <pre className="bg-canvas2 rounded-lg px-3 py-2 text-ink font-mono text-xs overflow-x-auto">
              {current.input}
            </pre>
          </div>
          <div>
            <span className="text-xs font-medium text-ink3 block mb-1">Expected Output</span>
            <pre className="bg-canvas2 rounded-lg px-3 py-2 text-ink font-mono text-xs overflow-x-auto">
              {current.expectedOutput}
            </pre>
          </div>
          <div>
            <span className="text-xs font-medium text-ink3 block mb-1">Your Output</span>
            <pre className={`rounded-lg px-3 py-2 font-mono text-xs overflow-x-auto ${
              current.passed ? "bg-(--grg) text-success" : "bg-(--rdg) text-danger"
            }`}>
              {current.actualOutput || "(empty)"}
            </pre>
          </div>
          {current.runtimeMs !== null && (
            <span className="text-xs text-ink3">Runtime: {current.runtimeMs}ms</span>
          )}
        </div>
      )}
    </div>
  );
}
