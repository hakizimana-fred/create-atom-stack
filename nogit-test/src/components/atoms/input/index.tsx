import { cn } from '@/lib/utils/cn';
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
