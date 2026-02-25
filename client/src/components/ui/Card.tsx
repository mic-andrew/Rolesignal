import type { ReactNode, CSSProperties } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
  padding?: string;
}

export function Card({
  children,
  className = "",
  glow,
  style,
  onClick,
  padding = "p-6",
}: CardProps) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`rounded-2xl bg-gradient-to-b from-[var(--color-layer)] to-[var(--color-layer)]/93 border border-[var(--color-edge)] shadow-[var(--sh1)] transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${padding} ${glow ? "card-glow cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
