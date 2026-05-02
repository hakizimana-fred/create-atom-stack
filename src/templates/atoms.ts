export const buttonAtom = `import { cn } from '@/lib/utils/cn';
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
`;

export const badgeAtom = `import { cn } from '@/lib/utils/cn';
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
`;

export const cardAtom = `import { cn } from '@/lib/utils/cn';
import type { HTMLAttributes, ReactNode } from 'react';

type CardVariant = 'solid' | 'glass' | 'glass-raised';
type CardPadding  = 'none' | 'sm' | 'md' | 'lg';
type CardShadow   = 'none' | 'xs' | 'sm' | 'md' | 'glass-xs' | 'glass-sm' | 'glass-md' | 'glass-lg';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  shadow?: CardShadow;
}

const variantStyles: Record<CardVariant, string> = {
  solid:         'bg-surface border border-border',
  glass:         'glass-panel',
  'glass-raised':'glass-panel-raised',
};

const paddingStyles: Record<CardPadding, string> = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-6',
};

const shadowStyles: Record<CardShadow, string> = {
  none:       '',
  xs:         'shadow-xs',
  sm:         'shadow-sm',
  md:         'shadow-md',
  'glass-xs': 'shadow-glass-xs',
  'glass-sm': 'shadow-glass-sm',
  'glass-md': 'shadow-glass-md',
  'glass-lg': 'shadow-glass-lg',
};

export function Card({
  variant = 'solid',
  padding = 'md',
  shadow = 'glass-xs',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl',
        variantStyles[variant],
        paddingStyles[padding],
        shadowStyles[shadow],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between border-b border-border px-4 py-3', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-end gap-2 border-t border-border px-4 py-3', className)}
      {...props}
    >
      {children}
    </div>
  );
}
`;

export const inputAtom = `import { cn } from '@/lib/utils/cn';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: React.ReactNode;
  error?: string;
}

export function Input({ leadingIcon, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="relative flex items-center">
        {leadingIcon && (
          <span className="pointer-events-none absolute left-3 flex size-4 items-center text-txt-tertiary">
            {leadingIcon}
          </span>
        )}
        <input
          className={cn(
            'h-9 w-full rounded-lg border bg-glass px-3 text-sm text-txt-primary',
            'placeholder:text-txt-tertiary',
            'transition-colors duration-fast',
            error
              ? 'border-error focus:border-error focus:ring-error/20'
              : 'border-border hover:border-border-strong focus:border-border-focus focus:ring-brand/20',
            'focus:outline-none focus:ring-2',
            leadingIcon && 'pl-9',
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-error-text">{error}</p>}
    </div>
  );
}
`;

export const loadingAtom = `import { cn } from '@/lib/utils/cn';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'size-4 border-2',
  md: 'size-8 border-2',
  lg: 'size-12 border-[3px]',
};

export function Loading({ size = 'md', className, label }: LoadingProps) {
  return (
    <div role="status" className={cn('inline-flex flex-col items-center gap-2', className)}>
      <span className="sr-only">{label ?? 'Loading'}</span>
      <span
        className={cn(
          'rounded-full border-brand/20 border-t-brand animate-spin',
          sizeStyles[size],
        )}
        aria-hidden="true"
      />
      {label && (
        <span className="text-xs font-medium text-txt-secondary" aria-hidden="true">
          {label}
        </span>
      )}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex h-full min-h-[200px] w-full items-center justify-center">
      <Loading size="lg" label="Loading..." />
    </div>
  );
}
`;

export const typographyAtom = `import { cn } from '@/lib/utils/cn';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';

interface TextProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  secondary?: boolean;
  tertiary?: boolean;
  as?: ElementType;
}

/* ── Heading ─────────────────────────────────────────────────────────────── */

interface HeadingProps extends Omit<TextProps, 'as'> {
  level?: 1 | 2 | 3 | 4;
}

const headingStyles: Record<NonNullable<HeadingProps['level']>, string> = {
  1: 'text-2xl font-semibold tracking-tight leading-tight',
  2: 'text-lg  font-medium  leading-6',
  3: 'text-base font-medium leading-6',
  4: 'text-sm  font-medium  leading-5',
};

export function Heading({ level = 1, secondary, tertiary, className, children, ...props }: HeadingProps) {
  const Tag = ('h' + level) as ElementType;
  return (
    <Tag
      className={cn(
        headingStyles[level],
        secondary ? 'text-txt-secondary' : tertiary ? 'text-txt-tertiary' : 'text-txt-primary',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* ── Body ─────────────────────────────────────────────────────────────────── */

interface BodyProps extends TextProps {
  size?: 'lg' | 'md' | 'sm';
}

const bodyStyles: Record<NonNullable<BodyProps['size']>, string> = {
  lg: 'text-md leading-relaxed',
  md: 'text-base leading-normal',
  sm: 'text-xs  leading-normal',
};

export function Body({ size = 'md', secondary, tertiary, as: Tag = 'p', className, children, ...props }: BodyProps) {
  return (
    <Tag
      className={cn(
        bodyStyles[size],
        secondary ? 'text-txt-secondary' : tertiary ? 'text-txt-tertiary' : 'text-txt-primary',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* ── Label ────────────────────────────────────────────────────────────────── */

export function Label({ tertiary, className, children, as: Tag = 'span', ...props }: TextProps) {
  return (
    <Tag
      className={cn(
        'text-xs font-medium uppercase tracking-wider',
        tertiary ? 'text-txt-tertiary' : 'text-txt-secondary',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* ── Caption ──────────────────────────────────────────────────────────────── */

export function Caption({ tertiary, className, children, as: Tag = 'span', ...props }: TextProps) {
  return (
    <Tag
      className={cn(
        'text-2xs leading-normal',
        tertiary ? 'text-txt-tertiary' : 'text-txt-secondary',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
`;
