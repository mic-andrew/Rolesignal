import { useEffect, useRef } from "react";
import { RiCloseLine } from "react-icons/ri";
import { Avatar } from "../ui/Avatar";
import type { TranscriptMessage, EvaluationInsight } from "../../types";

interface TranscriptSlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: TranscriptMessage[];
  candidateName: string;
  candidateInitials: string;
  candidateColor: string;
  highlightedMessageId: string | null;
  selectedInsight: EvaluationInsight | null;
}

export function TranscriptSlidePanel({
  isOpen,
  onClose,
  messages,
  candidateName,
  candidateInitials,
  candidateColor,
  highlightedMessageId,
  selectedInsight,
}: TranscriptSlidePanelProps) {
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && highlightRef.current) {
      const t = setTimeout(() => {
        highlightRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 380);
      return () => clearTimeout(t);
    }
  }, [isOpen, highlightedMessageId]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const firstName = candidateName.split(" ")[0];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Slide panel */}
      <div className="fixed top-0 right-0 h-full w-[480px] max-w-[90vw] bg-layer border-l border-edge z-50 flex flex-col animate-slide-in-right shadow-(--sh3)">
        {/* Sticky header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-edge shrink-0">
          <div className="flex items-center gap-3">
            <Avatar initials={candidateInitials} size={32} color={candidateColor} />
            <div>
              <div className="text-sm font-bold text-ink">{candidateName}</div>
              <div className="text-[11px] text-ink3">Interview Transcript</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-transparent border border-edge text-ink3 cursor-pointer hover:bg-layer2 transition-colors"
          >
            <RiCloseLine size={18} />
          </button>
        </div>

        {/* Referenced insight banner */}
        {selectedInsight && (
          <div className="mx-4 mt-3 px-4 py-3 rounded-lg bg-(--acg) border border-[rgba(124,111,255,0.15)]">
            <div className="text-[10px] font-bold text-brand uppercase tracking-wide mb-1">
              Referenced Insight &middot; {selectedInsight.criterionName}
            </div>
            <p className="text-[12px] text-ink2 leading-relaxed line-clamp-2">
              {selectedInsight.insightText}
            </p>
          </div>
        )}

        {/* Transcript messages */}
        <div className="flex-1 overflow-auto p-4">
          {messages.map((msg) => {
            const isHighlighted = msg.id === highlightedMessageId;
            const isAI = msg.speaker === "ai";

            return (
              <div
                key={msg.id}
                ref={isHighlighted ? highlightRef : undefined}
                className={`mb-3 rounded-lg px-3.5 py-2.5 transition-colors ${
                  isHighlighted
                    ? "bg-[rgba(255,173,51,0.08)] border-l-2 border-warn"
                    : "bg-transparent border-l-2 border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 mb-[3px]">
                  <span
                    className={`text-[10px] font-bold font-mono uppercase tracking-[0.04em] ${
                      isAI ? "text-brand" : "text-success"
                    }`}
                  >
                    {isAI ? "Sophie" : firstName}
                  </span>
                  <span className="text-ink3 text-[10px] font-normal">{msg.timestamp}</span>
                  {isHighlighted && (
                    <span className="text-[9px] font-bold uppercase tracking-wide text-warn bg-(--amg) px-1.5 py-0.5 rounded">
                      Referenced
                    </span>
                  )}
                </div>
                <p className={`text-[13px] leading-[1.65] ${isAI ? "text-ink3 italic" : "text-ink2"}`}>
                  {msg.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
