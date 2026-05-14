import { cn } from '@/lib/utils/cn';
import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'brand' | 'neutral' | 'info';
export type BadgeSize    = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success-subtle  text-success-text  border-success/20',
  error:   'bg-error-subtle    text-error-text    border-error/20',
  warning: 'bg-warning-subtle  text-warning-text  border-warning/20',
  brand:   'bg-brand-subtle    text-brand         border-brand/20',
  neutral: 'bg-glass           text-txt-secondary border-border',
  info:    'bg-status-info-bg  text-status-info-text border-status-info/20',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-2xs',
  md: 'px-2   py-0.5 text-xs',
};

export function Badge({
  variant = 'neutral',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-pill border font-medium',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
