import type { TranscriptMessage } from "../../types";

interface TranscriptPanelProps {
  messages: TranscriptMessage[];
  candidateName?: string;
  showTyping?: boolean;
}

export function TranscriptPanel({
  messages,
  candidateName = "Candidate",
  showTyping = false,
}: TranscriptPanelProps) {
  return (
    <div className="flex-1 overflow-auto p-3.5">
      {messages.map((msg) => (
        <div key={msg.id} className="mb-3.5">
          <div
            className={`text-[10px] font-bold font-mono uppercase tracking-[0.04em] mb-[3px] ${
              msg.speaker === "ai" ? "text-brand" : "text-success"
            }`}
          >
            {msg.speaker === "ai" ? "Aria" : candidateName}
            <span className="text-ink3 font-normal ml-1.5 normal-case">
              {msg.timestamp}
            </span>
          </div>
          <p className="text-[13px] text-ink2 leading-[1.65] font-normal">{msg.text}</p>
        </div>
      ))}

      {showTyping && (
        <div className="flex gap-1 p-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="rounded-full animate-pulse-slow w-[5px] h-[5px] bg-ink3"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
