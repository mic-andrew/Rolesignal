import { RiMicLine, RiMicOffLine, RiLoader4Line } from "react-icons/ri";

type ConnectionState = "idle" | "connecting" | "connected" | "disconnected" | "error";

interface VoiceTutorButtonProps {
  connectionState: ConnectionState;
  isAiSpeaking: boolean;
  micEnabled: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onToggleMic: () => void;
}

export function VoiceTutorButton({
  connectionState,
  isAiSpeaking,
  micEnabled,
  onConnect,
  onDisconnect,
  onToggleMic,
}: VoiceTutorButtonProps) {
  if (connectionState === "idle" || connectionState === "disconnected" || connectionState === "error") {
    return (
      <button
        onClick={onConnect}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand/10 text-brand hover:bg-brand/20 transition-colors"
        title="Start voice tutoring"
      >
        <RiMicLine size={14} />
        Voice
      </button>
    );
  }

  if (connectionState === "connecting") {
    return (
      <button
        disabled
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand/10 text-brand opacity-70"
      >
        <RiLoader4Line size={14} className="animate-spin" />
        Connecting...
      </button>
    );
  }

  // Connected state
  return (
    <div className="flex items-center gap-1">
      {/* Mic toggle */}
      <button
        onClick={onToggleMic}
        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          micEnabled
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : "bg-red-100 text-red-700 hover:bg-red-200"
        }`}
        title={micEnabled ? "Mute" : "Unmute"}
      >
        {micEnabled ? <RiMicLine size={14} /> : <RiMicOffLine size={14} />}
      </button>

      {/* AI speaking indicator */}
      {isAiSpeaking && (
        <div className="flex items-center gap-1 px-2 py-1.5 text-xs text-brand">
          <span className="flex gap-0.5">
            <span className="w-1 h-3 bg-brand rounded-full animate-pulse" />
            <span className="w-1 h-4 bg-brand rounded-full animate-pulse [animation-delay:150ms]" />
            <span className="w-1 h-2 bg-brand rounded-full animate-pulse [animation-delay:300ms]" />
          </span>
        </div>
      )}

      {/* Disconnect */}
      <button
        onClick={onDisconnect}
        className="px-2 py-1.5 rounded-lg text-xs font-medium bg-danger/10 text-danger hover:bg-danger/20 transition-colors"
        title="End voice session"
      >
        End
      </button>
    </div>
  );
}
