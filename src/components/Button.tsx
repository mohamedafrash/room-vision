import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  isLoading,
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "bg-gradient-to-br from-[var(--rv-primary)] to-[var(--rv-primary-strong)] text-white shadow-[0_18px_40px_rgba(0,91,111,0.24)] hover:scale-[0.99] focus-visible:ring-[var(--rv-primary)]",
    secondary:
      "bg-[var(--rv-surface-low)] text-[var(--rv-text)] hover:bg-[var(--rv-surface-high)] focus-visible:ring-[var(--rv-primary)]",
    ghost:
      "bg-transparent text-[var(--rv-primary)] hover:bg-[var(--rv-surface-low)] focus-visible:ring-[var(--rv-primary)]",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
      )}
      {!isLoading && icon}
      <span>{children}</span>
    </button>
  );
};
