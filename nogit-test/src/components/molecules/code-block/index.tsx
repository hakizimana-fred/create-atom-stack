import { cn } from '@/lib/utils/cn';

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
