import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiCloseLine } from "react-icons/ri";
import { useVoiceInterview } from "../hooks/useVoiceInterview";
import { InterviewPanel } from "../components/shared/interview/InterviewPanel";
import { AIPanelContent } from "../components/shared/interview/AIPanelContent";
import { CandidatePanelContent } from "../components/shared/interview/CandidatePanelContent";
import { InterviewControls } from "../components/shared/interview/InterviewControls";
import { TranscriptPanel } from "../components/shared/TranscriptPanel";

export default function InterviewRoom() {
  const navigate = useNavigate();
  const {
    token,
    interview,
    connectionState,
    transcript,
    isAiSpeaking,
    elapsedSeconds,
    micEnabled,
    connect,
    toggleMic,
    endInterview,
  } = useVoiceInterview();

  const [chatOpen, setChatOpen] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(true);

  useEffect(() => {
    if (connectionState === "idle") connect();
  }, [connectionState, connect]);

  const candidateName = interview?.candidateName ?? "Candidate";
  const lastAiMessage = captionsOn
    ? ([...transcript].reverse().find((m) => m.speaker === "ai")?.text ?? "")
    : "";
  const isConnected = connectionState === "connected";
  const candidateSpeaking = isConnected && !isAiSpeaking && micEnabled;

  const handleEndInterview = async () => {
    await endInterview();
    navigate(`/i/${token}/complete`);
  };

  return (
    <div className="h-screen bg-[var(--color-canvas)] flex flex-col select-none overflow-hidden">
      {/* Two-panel layout */}
      <div className="flex-1 flex gap-3 p-3 min-h-0">
        {/* AI Panel */}
        <InterviewPanel variant="ai" speaking={isAiSpeaking}>
          <AIPanelContent
            isAiSpeaking={isAiSpeaking}
            isConnected={isConnected}
            lastAiMessage={lastAiMessage}
            connectionState={connectionState}
          />
        </InterviewPanel>

        {/* Candidate Panel */}
        <InterviewPanel variant="candidate" speaking={candidateSpeaking}>
          <CandidatePanelContent
            candidateName={candidateName}
            micEnabled={micEnabled}
            isSpeaking={candidateSpeaking}
          />
        </InterviewPanel>

        {/* Transcript panel */}
        {chatOpen && (
          <div className="w-[360px] shrink-0 flex flex-col rounded-2xl overflow-hidden bg-[var(--color-layer)] border border-[var(--color-edge)] animate-slide-in-right">
            <div className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-[var(--color-edge)]">
              <span className="text-sm font-semibold text-[var(--color-ink)]">
                Live Transcript
              </span>
              <button
                onClick={() => setChatOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-[var(--color-ink3)] hover:bg-[var(--acg)] transition-colors"
              >
                <RiCloseLine size={18} />
              </button>
            </div>
            <TranscriptPanel
              messages={transcript}
              candidateName={candidateName.split(" ")[0]}
              showTyping={isAiSpeaking}
            />
          </div>
        )}
      </div>

      {/* Floating controls */}
      <InterviewControls
        micEnabled={micEnabled}
        captionsOn={captionsOn}
        chatOpen={chatOpen}
        elapsedSeconds={elapsedSeconds}
        onToggleMic={toggleMic}
        onToggleCaptions={() => setCaptionsOn(!captionsOn)}
        onToggleChat={() => setChatOpen(!chatOpen)}
        onEndInterview={handleEndInterview}
      />

      {/* Spacer for floating controls */}
      <div className="h-20 shrink-0" />
    </div>
  );
}
