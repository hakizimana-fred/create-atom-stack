import { cn } from '@/lib/utils/cn';
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
