import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/90",
  secondary:
    "bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] text-slate-900 dark:text-white hover:bg-[var(--color-border-darker)]",
  ghost:
    "bg-transparent text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent",
  danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}
      `}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
