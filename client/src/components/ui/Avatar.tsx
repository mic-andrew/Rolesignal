interface AvatarProps {
  initials: string;
  size?: number;
  color?: string;
}

export function Avatar({ initials, size = 36, color = "#7C6FFF" }: AvatarProps) {
  const fontSize = Math.round(size * 0.34);
  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: "50%",
        background: `linear-gradient(145deg, ${color}dd, ${color}88)`,
        fontSize,
        fontWeight: 700,
        color: "#fff",
        letterSpacing: "-0.02em",
      }}
      className="flex items-center justify-center shrink-0"
    >
      {initials}
    </div>
  );
}
