interface AIAvatarProps {
  size?: number;
  speaking?: boolean;
}

export function AIAvatar({ size = 68, speaking = false }: AIAvatarProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="rounded-full flex items-center justify-center animate-float"
        style={{
          width: size,
          height: size,
          background: "linear-gradient(145deg, var(--color-brand), #5046E5)",
          boxShadow: "0 0 30px rgba(124,111,255,0.35)",
        }}
      >
        <span style={{ fontSize: size * 0.38, color: "#fff" }}>✦</span>
      </div>

      {speaking && (
        <div className="flex gap-0.5 items-end h-4 mt-2">
          {[0, 1, 2, 3, 4, 3, 2, 1, 0].map((_v, i) => (
            <div
              key={i}
              className="w-0.5 rounded-sm bg-brand animate-waveform"
              style={{
                minHeight: 3,
                animationDuration: `${0.4 + i * 0.05}s`,
                animationDelay: `${i * 50}ms`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
