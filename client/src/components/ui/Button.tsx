import type { ReactNode, MouseEvent } from "react";

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
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-xs",
  md: "px-5 py-2.5 text-[13px]",
  lg: "px-7 py-3.5 text-sm",
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "text-white border-none",
  ghost:   "bg-transparent text-ink2 border border-edge hover:bg-layer",
  danger:  "bg-[var(--rdg)] text-danger border border-[rgba(255,90,90,0.2)]",
  success: "bg-[var(--grg)] text-success border border-[rgba(34,201,151,0.2)]",
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
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold border-none transition-all duration-200 outline-none tracking-tight shrink-0 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer opacity-100"} ${variant === "primary" ? "btn-primary" : ""} ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${full ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
