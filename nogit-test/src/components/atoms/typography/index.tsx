import { cn } from '@/lib/utils/cn';
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
