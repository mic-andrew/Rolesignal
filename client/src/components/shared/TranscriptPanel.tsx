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
    <div className="flex-1 overflow-auto" style={{ padding: 14 }}>
      {messages.map((msg) => (
        <div key={msg.id} style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              fontFamily: "var(--font-family-mono)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: msg.speaker === "ai" ? "var(--color-brand)" : "var(--color-success)",
              marginBottom: 3,
            }}
          >
            {msg.speaker === "ai" ? "Aria" : candidateName}
            <span style={{ color: "var(--color-ink3)", fontWeight: 400, marginLeft: 6, textTransform: "none" }}>
              {msg.timestamp}
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--color-ink2)", lineHeight: 1.65, fontWeight: 400 }}>{msg.text}</p>
        </div>
      ))}

      {showTyping && (
        <div className="flex" style={{ gap: 4, padding: 8 }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="rounded-full animate-pulse-slow"
              style={{ width: 5, height: 5, background: "var(--color-ink3)", animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
