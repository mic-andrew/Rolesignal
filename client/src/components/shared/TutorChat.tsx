import { useState, useRef, useEffect } from "react";
import { RiSendPlane2Fill, RiRobot2Line, RiUser3Line } from "react-icons/ri";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { TutoringMessage, Language } from "../../types";

interface TutorChatProps {
  messages: TutoringMessage[];
  isSending: boolean;
  onSendMessage: (content: string, currentCode: string, language: Language) => void;
  currentCode: string;
  language: Language;
}

export function TutorChat({
  messages,
  isSending,
  onSendMessage,
  currentCode,
  language,
}: TutorChatProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    onSendMessage(input.trim(), currentCode, language);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-ink3 text-sm py-8">
            <RiRobot2Line className="mx-auto mb-2 text-2xl text-brand" />
            <p>Ask me anything about this problem!</p>
            <p className="text-xs mt-1">I'll guide you without giving away the solution.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.speaker === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                msg.speaker === "ai"
                  ? "bg-brand/10 text-brand"
                  : "bg-ink/10 text-ink2"
              }`}
            >
              {msg.speaker === "ai" ? <RiRobot2Line /> : <RiUser3Line />}
            </div>
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                msg.speaker === "ai"
                  ? "bg-layer2 text-ink border border-edge"
                  : "bg-brand text-white"
              }`}
            >
              {msg.speaker === "ai" ? (
                <div className="prose prose-sm max-w-none [&_pre]:bg-canvas2 [&_pre]:p-2 [&_pre]:rounded [&_code]:text-xs">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex gap-2">
            <div className="shrink-0 w-6 h-6 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs">
              <RiRobot2Line />
            </div>
            <div className="bg-layer2 border border-edge rounded-lg px-3 py-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-ink3 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-ink3 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-ink3 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-edge p-2 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for a hint..."
          className="input-field flex-1 text-sm"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="btn-primary px-3 py-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RiSendPlane2Fill size={14} />
        </button>
      </form>
    </div>
  );
}
