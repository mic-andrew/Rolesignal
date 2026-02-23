import type { ReactNode, MouseEvent, CSSProperties } from "react";

type ButtonVariant = "primary" | "ghost" | "danger" | "success";
type ButtonSize    = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  full?: boolean;
  style?: CSSProperties;
}

const SIZES: Record<ButtonSize, CSSProperties> = {
  sm: { padding: "6px 14px", fontSize: 12 },
  md: { padding: "10px 20px", fontSize: 13 },
  lg: { padding: "13px 28px", fontSize: 14 },
};

const VARIANTS: Record<ButtonVariant, CSSProperties> = {
  primary: {},
  ghost:   { background: "transparent", color: "var(--color-ink2)", border: "1px solid var(--color-edge)" },
  danger:  { background: "var(--rdg)", color: "var(--color-danger)", border: "1px solid rgba(255,90,90,0.2)" },
  success: { background: "var(--grg)", color: "var(--color-success)", border: "1px solid rgba(34,201,151,0.2)" },
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled,
  type = "button",
  className = "",
  full,
  style,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variant === "primary" ? "btn-primary" : ""} ${full ? "w-full" : ""} ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: 8,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        border: "none",
        transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
        outline: "none",
        letterSpacing: "-0.01em",
        flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
        color: variant === "primary" ? "#fff" : undefined,
        ...SIZES[size],
        ...VARIANTS[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}
