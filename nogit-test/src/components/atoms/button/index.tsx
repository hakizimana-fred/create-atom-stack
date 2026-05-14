import { cn } from '@/lib/utils/cn';
import type { ButtonHTMLAttributes, ElementType, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
export type ButtonSize    = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  as?: ElementType;
  children: ReactNode;
  [key: string]: unknown;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:   'bg-brand text-white hover:bg-brand-hover disabled:bg-brand/40',
  secondary: 'bg-glass border border-border text-txt-primary hover:bg-glass-raised',
  ghost:     'bg-transparent text-txt-secondary hover:bg-glass hover:text-txt-primary',
  danger:    'bg-error-subtle text-error-text border border-error/20 hover:bg-error/20',
  glass:     'glass-panel text-txt-primary hover:glass-panel-raised',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'h-6  px-2   text-xs  gap-1   rounded-md',
  sm: 'h-7  px-2.5 text-xs  gap-1.5 rounded-md',
  md: 'h-8  px-3   text-sm  gap-2   rounded-lg',
  lg: 'h-10 px-4   text-sm  gap-2   rounded-lg',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  as: Tag = 'button',
  ...props
}: ButtonProps) {
  return (
    <Tag
      disabled={Tag === 'button' ? (disabled || loading) : undefined}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-base',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <svg
          className="size-3.5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </Tag>
  );
}
