import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { RiLightbulbLine, RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { DifficultyBadge } from "./DifficultyBadge";
import type { ProblemDetail } from "../../types";

interface ProblemDescriptionProps {
  problem: ProblemDetail;
}

export function ProblemDescription({ problem }: ProblemDescriptionProps) {
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);

  const revealNextHint = () => {
    setRevealedHints((prev) => Math.min(prev + 1, problem.hints.length));
  };

  return (
    <div className="h-full overflow-auto px-5 py-4 space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl font-bold text-ink">{problem.title}</h1>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
        <span className="text-xs text-ink3">
          {problem.topicName} &middot; {problem.timeComplexity && `Time: ${problem.timeComplexity}`}
          {problem.spaceComplexity && ` &middot; Space: ${problem.spaceComplexity}`}
        </span>
      </div>

      {/* Description */}
      <div className="prose prose-sm max-w-none text-ink2 [&_h1]:text-ink [&_h2]:text-ink [&_h3]:text-ink [&_code]:bg-canvas2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-brand [&_pre]:bg-canvas2 [&_pre]:rounded-lg [&_pre]:text-xs">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {problem.description}
        </ReactMarkdown>
      </div>

      {/* Examples */}
      {problem.examples.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-ink">Examples</h3>
          {problem.examples.map((ex, i) => (
            <div key={i} className="bg-canvas2 rounded-xl p-4 space-y-2">
              <div>
                <span className="text-xs font-medium text-ink3">Input:</span>
                <pre className="text-sm font-mono text-ink mt-0.5">{ex.input}</pre>
              </div>
              <div>
                <span className="text-xs font-medium text-ink3">Output:</span>
                <pre className="text-sm font-mono text-ink mt-0.5">{ex.output}</pre>
              </div>
              {ex.explanation && (
                <div>
                  <span className="text-xs font-medium text-ink3">Explanation:</span>
                  <p className="text-sm text-ink2 mt-0.5">{ex.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Constraints */}
      {problem.constraints.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-ink mb-2">Constraints</h3>
          <ul className="list-disc pl-5 space-y-1">
            {problem.constraints.map((c, i) => (
              <li key={i} className="text-sm text-ink2">
                <code className="bg-canvas2 px-1.5 py-0.5 rounded text-brand font-mono text-xs">
                  {c}
                </code>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Hints */}
      {problem.hints.length > 0 && (
        <div>
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 text-sm font-medium text-brand cursor-pointer hover:text-brand2 transition-colors"
          >
            <RiLightbulbLine size={16} />
            Hints ({problem.hints.length})
            {showHints ? <RiArrowUpSLine size={16} /> : <RiArrowDownSLine size={16} />}
          </button>

          {showHints && (
            <div className="mt-3 space-y-2">
              {problem.hints.slice(0, revealedHints).map((hint, i) => (
                <div key={i} className="bg-(--amg) rounded-lg px-4 py-2.5 text-sm text-ink2">
                  <span className="font-semibold text-warn">Hint {i + 1}:</span> {hint}
                </div>
              ))}
              {revealedHints < problem.hints.length && (
                <button
                  onClick={revealNextHint}
                  className="text-xs text-brand cursor-pointer hover:text-brand2 transition-colors"
                >
                  Reveal hint {revealedHints + 1}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
