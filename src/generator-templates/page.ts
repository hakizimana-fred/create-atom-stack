import type { ParsedRoute, DynamicParam } from '../parsers/route-parser.js';

const LAYOUT_IMPORTS = `import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';`;

/* ── Static page ─────────────────────────────────────────────────────────── */

function staticPageTsx(pascal: string, title: string): string {
  return `${LAYOUT_IMPORTS}
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${title}',
};

export default function ${pascal}Page() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight">${title}</h1>
        <p className="mt-2 text-txt-secondary">
          Start building your ${title.toLowerCase()} page here.
        </p>
      </main>
      <Footer />
    </div>
  );
}
`;
}

/* ── Dynamic page ────────────────────────────────────────────────────────── */

function buildParamsType(params: DynamicParam[]): string {
  const fields = params.map((p) => `    ${p.name}: ${p.tsType};`).join('\n');
  return `type Params = {\n  params: Promise<{\n${fields}\n  }>;\n};`;
}

function buildParamDestructure(params: DynamicParam[]): string {
  const names = params.map((p) => p.name).join(', ');
  return `const { ${names} } = await params;`;
}

function dynamicPageTsx(pascal: string, title: string, params: DynamicParam[]): string {
  const firstParam = params[0];
  const firstIsArray = firstParam.tsType.includes('[]');
  const exampleUsage = firstIsArray
    ? `<p className="text-txt-secondary">Path: {${firstParam.name}${firstParam.tsType.includes('undefined') ? `?.join('/') ?? 'index'` : `.join('/')`}}</p>`
    : `<p className="text-txt-secondary">ID: {${firstParam.name}}</p>`;

  return `${LAYOUT_IMPORTS}
import type { Metadata } from 'next';

${buildParamsType(params)}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  ${buildParamDestructure(params)}
  return { title: \`${title} — \${${firstParam.name}${firstIsArray ? '?.[0]' : ''}}\` };
}

export default async function ${pascal}Page({ params }: Params) {
  ${buildParamDestructure(params)}

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight">${title}</h1>
        ${exampleUsage}
      </main>
      <Footer />
    </div>
  );
}
`;
}

/* ── Loading + index ─────────────────────────────────────────────────────── */

export function loadingTsx(pascal: string): string {
  return `export default function ${pascal}Loading() {
  return (
    <div
      className="flex items-center justify-center min-h-[400px]"
      aria-label="Loading"
    >
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

/* ── Public factory ──────────────────────────────────────────────────────── */

export function buildPageTsx(route: ParsedRoute): string {
  return route.isDynamic
    ? dynamicPageTsx(route.componentName, route.pageTitle, route.dynamicParams)
    : staticPageTsx(route.componentName, route.pageTitle);
}
