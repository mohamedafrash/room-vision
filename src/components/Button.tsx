import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-60';

  const variants = {
    primary:
      'bg-[#E97B46] text-white shadow-[0_10px_30px_rgba(231,123,70,0.3)] hover:bg-[#F08A59] focus-visible:ring-[#E97B46]',
    secondary:
      'bg-black/70 text-white hover:bg-black focus-visible:ring-white/40',
    ghost:
      'bg-transparent text-white/80 hover:bg-white/10 focus-visible:ring-white/40',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {!isLoading && icon}
      <span>{children}</span>
    </button>
  );
};
