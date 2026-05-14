import { cn } from '@/lib/utils/cn';

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
