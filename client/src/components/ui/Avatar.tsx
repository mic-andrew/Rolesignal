interface AvatarProps {
  initials: string;
  size?: number;
  color?: string;
}

export function Avatar({ initials, size = 36, color = "#7C6FFF" }: AvatarProps) {
  const fontSize = Math.round(size * 0.34);
  return (
    <div
      className="flex items-center justify-center shrink-0 rounded-full font-bold text-white tracking-tighter"
      style={{
        width: size,
        height: size,
        minWidth: size,
        fontSize,
        background: `linear-gradient(145deg, ${color}dd, ${color}88)`,
      }}
    >
      {initials}
    </div>
  );
}
