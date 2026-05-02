export const codeBlockMolecule = `import { cn } from '@/lib/utils/cn';

interface TerminalLine {
  prompt?: string;
  code: string;
  comment?: string;
}

interface CodeBlockProps {
  title?: string;
  /** Terminal-style command lines */
  lines?: TerminalLine[];
  /** Preformatted text (file trees, output, etc.) */
  content?: string;
  className?: string;
}

export function CodeBlock({ title, lines, content, className }: CodeBlockProps) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-border shadow-glass-sm', className)}>
      {/* Title bar */}
      {title && (
        <div className="flex items-center gap-3 border-b border-border bg-surface-overlay px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-error/50" />
            <span className="size-2.5 rounded-full bg-warning/50" />
            <span className="size-2.5 rounded-full bg-success/50" />
          </div>
          <span className="font-mono text-xs text-txt-tertiary">{title}</span>
        </div>
      )}

      {/* Content */}
      <div className="bg-surface-sunken p-5">
        {content ? (
          <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-txt-secondary">
            {content}
          </pre>
        ) : lines ? (
          <div className="flex flex-col gap-3">
            {lines.map((line, i) => (
              <div key={i} className="flex items-start gap-2 font-mono text-sm">
                {line.prompt !== undefined && (
                  <span className="shrink-0 select-none text-success">{line.prompt}</span>
                )}
                <span className="text-txt-primary">{line.code}</span>
                {line.comment && (
                  <span className="ml-auto shrink-0 text-txt-tertiary">{line.comment}</span>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
`;

export const featureCardMolecule = `import { cn } from '@/lib/utils/cn';
import { Card } from '@/components/atoms/card';
import { Heading, Body } from '@/components/atoms/typography';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <Card
      variant="glass"
      padding="md"
      shadow="glass-sm"
      className={cn(
        'flex flex-col gap-3 transition-all duration-base',
        'hover:shadow-glass-md hover:border-brand/20',
        className,
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-xl bg-brand-subtle border border-brand/20 text-xl">
        {icon}
      </div>
      <div>
        <Heading level={3} className="text-sm font-semibold">
          {title}
        </Heading>
        <Body size="sm" secondary className="mt-1 leading-relaxed">
          {description}
        </Body>
      </div>
    </Card>
  );
}
`;

export const paginationMolecule = `import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { cn } from '@/lib/utils/cn';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, pageSize, total, onPageChange, className }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to   = Math.min(page * pageSize, total);

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <span className="text-xs text-txt-secondary">
        {from}–{to} of {total}
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="min-w-[4rem] text-center text-xs text-txt-secondary">
          {page} / {totalPages}
        </span>
        <Button
          variant="ghost"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
`;
