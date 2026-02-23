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
      style={{
        background: "linear-gradient(180deg, var(--color-layer), var(--color-layer)ee)",
        border: "1px solid var(--color-edge)",
        boxShadow: "var(--sh1)",
        transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
        ...style,
      }}
      className={`rounded-2xl ${padding} ${glow ? "card-glow cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
