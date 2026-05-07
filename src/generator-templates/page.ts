export function pageTsx(pascal: string, routeSegment: string): string {
  const title = routeSegment
    .split('/')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');

  return `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${title}',
};

export default function ${pascal}Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">${title}</h1>
      <p className="mt-2 text-muted-foreground">
        Start building your ${title.toLowerCase()} page here.
      </p>
    </main>
  );
}
`;
}

export function loadingTsx(pascal: string): string {
  return `export default function ${pascal}Loading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
    </div>
  );
}
`;
}

export function pageIndexTs(pascal: string): string {
  return `export { default as ${pascal}Page } from './page';
`;
}
