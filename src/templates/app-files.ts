export function rootLayout(projectName: string, withQueryProvider = false): string {
  const title = projectName
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const providerImport = withQueryProvider
    ? `\nimport { Providers } from '@/lib/providers';`
    : '';
  const bodyContent = withQueryProvider
    ? `        <Providers>{children}</Providers>`
    : `        {children}`;

  return `import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';${providerImport}
import './globals.css';

export const metadata: Metadata = {
  title: { default: '${title}', template: '%s | ${title}' },
  description: 'Built with create-atom-stack — a production-ready Next.js starter.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={[
          GeistSans.variable,
          GeistMono.variable,
          'antialiased font-sans text-base text-txt-primary bg-surface-page min-h-dvh',
        ].join(' ')}
      >
${bodyContent}
      </body>
    </html>
  );
}
`;
}

// NOTE: backtick and ${} inside the template are escaped as \` and \${
export const rootPage = `import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';
import { CodeBlock } from '@/components/molecules/code-block';
import { Label } from '@/components/atoms/typography';
import { ChevronDown } from 'lucide-react';

/* ─── Page data ─────────────────────────────────────────────────────────── */

const QUICK_START = [
  { prompt: '$', code: 'npm run dev',   comment: '→ localhost:3000' },
  { prompt: '$', code: 'npm run lint',  comment: '→ ESLint check'  },
  { prompt: '$', code: 'npm test',      comment: '→ Jest suite'    },
];

const PROJECT_STRUCTURE = \`src/
├── app/
│   ├── globals.css          # design tokens + base styles
│   ├── layout.tsx           # root layout (fonts, metadata)
│   └── page.tsx             # ← you are here
├── components/
│   ├── atoms/               # button · badge · card · input · loading
│   ├── molecules/           # code-block · feature-card · pagination
│   └── organisms/           # header · footer
├── store/
│   └── ui.store.ts          # zustand: theme, sidebar
├── lib/
│   ├── http/                # client · errors · interceptors · types
│   └── utils/               # cn · format
├── hooks/
│   └── use-scroll-state.ts
├── design-system/tokens/    # js mirrors of css tokens
└── data/constants/
    └── navigation.ts        # NAV_LINKS\`;

const ATOMIC_LAYERS = [
  {
    layer: 'atoms/',
    desc: 'Stateless primitives — no domain knowledge',
    items: ['button', 'badge', 'card', 'input', 'loading', 'typography'],
  },
  {
    layer: 'molecules/',
    desc: 'Composed atoms serving one pattern',
    items: ['code-block', 'feature-card', 'pagination'],
  },
  {
    layer: 'organisms/',
    desc: 'Layout-level, may hold state or data',
    items: ['header', 'footer'],
  },
] as const;

const EXPLORE = [
  { path: 'ARCHITECTURE.md',       desc: 'Full project structure, conventions, and token docs' },
  { path: 'tailwind.config.ts',    desc: 'Customize the design system — colors, spacing, animations' },
  { path: 'src/app/',              desc: 'Add new routes — create a folder, drop in page.tsx'  },
  { path: 'src/components/',       desc: 'Grow the design system with new atoms and molecules'  },
  { path: 'src/store/',            desc: 'Add Zustand slices for new state concerns'            },
  { path: '.env.local',            desc: 'Set NEXT_PUBLIC_API_URL to connect your backend'     },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-page">
      <Header />

      <main className="flex-1">

        {/* ── 00 · Hero ──────────────────────────────────────────────────── */}
        <section className="relative flex min-h-[calc(100svh-56px)] flex-col items-center justify-center overflow-hidden px-4 py-20">

          {/* Ambient glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="h-[560px] w-[560px] rounded-full bg-brand/6 blur-[130px] animate-pulse-glow" />
          </div>

          {/* Grid */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid opacity-25" />

          {/* Status line */}
          <div className="relative mb-14 flex items-center gap-3">
            <span className="relative flex size-2.5 shrink-0">
              <span className="absolute inline-flex size-full rounded-full bg-success/30 animate-ping" />
              <span className="relative size-2.5 rounded-full bg-success" />
            </span>
            <span className="font-mono text-xs tracking-widest text-txt-tertiary uppercase select-none">
              System ready · All files generated · localhost:3000
            </span>
          </div>

          {/* Heading */}
          <div className="relative text-center">
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block text-txt-primary">Your Atom Stack</span>
              <span
                className="mt-2 block gradient-text"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, #6366f1 0%, #a78bfa 45%, #e879f9 100%)',
                }}
              >
                is ready.
              </span>
            </h1>

            <p className="mx-auto mt-10 max-w-lg font-mono text-xs leading-relaxed tracking-wide text-txt-tertiary">
              Next.js 15 · TypeScript 5 · Tailwind CSS v4 · Zustand
              <br />
              Atomic Design · ESLint · Prettier · Husky · Jest
            </p>
          </div>

          {/* Scroll cue */}
          <div
            aria-hidden="true"
            className="absolute bottom-10 animate-float opacity-40"
          >
            <ChevronDown className="size-5 text-txt-tertiary" />
          </div>
        </section>

        {/* ── 01 · Quick Start + Structure ───────────────────────────────── */}
        <section className="px-4 py-24">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">

            <div className="flex flex-col gap-5">
              <SectionLabel index="01" title="Quick Start" />
              <CodeBlock title="~ terminal" lines={QUICK_START} />

              <div className="mt-2 flex flex-col gap-2 font-mono text-xs text-txt-tertiary">
                <span className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-success/60" />
                  Runs on Node.js 18+ with npm 9+
                </span>
                <span className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-brand/60" />
                  Hot-reload enabled out of the box
                </span>
                <span className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-warning/60" />
                  Copy .env.example → .env.local before connecting a backend
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <SectionLabel index="02" title="Project Structure" />
              <CodeBlock title="src/" content={PROJECT_STRUCTURE} />
            </div>

          </div>
        </section>

        {/* ── 03 · Atomic Design Layers ──────────────────────────────────── */}
        <section className="border-y border-border/50 px-4 py-24">
          <div className="mx-auto max-w-5xl">
            <SectionLabel index="03" title="Design System Layers" className="mb-10" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {ATOMIC_LAYERS.map((layer) => (
                <div
                  key={layer.layer}
                  className="glass-panel flex flex-col gap-4 rounded-xl p-5 shadow-glass-sm"
                >
                  <div>
                    <p className="font-mono text-sm font-medium text-brand">{layer.layer}</p>
                    <p className="mt-1 text-xs text-txt-tertiary">{layer.desc}</p>
                  </div>

                  <ul className="flex flex-col gap-2">
                    {layer.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5">
                        <span className="size-1 shrink-0 rounded-full bg-border-strong" />
                        <code className="font-mono text-xs text-txt-secondary">{item}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 04 · Explore Further ───────────────────────────────────────── */}
        <section className="px-4 py-24">
          <div className="mx-auto max-w-5xl">
            <SectionLabel index="04" title="Explore Further" className="mb-10" />

            <div className="flex flex-col">
              {EXPLORE.map((item, i) => (
                <div
                  key={item.path}
                  className={[
                    'group flex items-start gap-5 py-4',
                    i < EXPLORE.length - 1 ? 'border-b border-border/50' : '',
                  ].join(' ')}
                >
                  <span className="mt-0.5 shrink-0 font-mono text-xs text-brand/60 group-hover:text-brand transition-colors duration-base select-none">
                    →
                  </span>
                  <code className="mt-0.5 w-48 shrink-0 font-mono text-sm text-txt-primary">
                    {item.path}
                  </code>
                  <p className="text-sm text-txt-tertiary">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function SectionLabel({
  index,
  title,
  className,
}: {
  index: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={['flex items-center gap-3', className].filter(Boolean).join(' ')}>
      <span className="shrink-0 font-mono text-xs text-txt-tertiary">{index}</span>
      <span className="h-px w-6 shrink-0 bg-border" />
      <Label tertiary className="font-mono tracking-widest">
        {title.toUpperCase()}
      </Label>
    </div>
  );
}
`;

// NOTE: backtick (\`) and \${} inside the template are escaped as \` and \${
export const docsPage = `import type { ReactNode } from 'react';
import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';
import { CodeBlock } from '@/components/molecules/code-block';

export const metadata = { title: 'Docs' };

/* ─── Static data ────────────────────────────────────────────────────────── */

const SECTIONS = [
  { id: 'introduction',  label: 'Introduction'      },
  { id: 'installation',  label: 'Installation'      },
  { id: 'cli-options',   label: 'CLI Options'       },
  { id: 'structure',     label: 'Project Structure' },
  { id: 'design-system', label: 'Design System'     },
] as const;

const INSTALL_COMMANDS = [
  { prompt: '$', code: 'npx create-atom-stack my-app',               comment: '# scaffold a new project' },
  { prompt: '$', code: 'npx create-atom-stack my-app --skip-install', comment: '# skip npm install'      },
  { prompt: '$', code: 'cd my-app && npm run dev',                    comment: '# start dev server'      },
];

const FILE_TREE = \`my-app/
├── src/
│   ├── app/                    Next.js App Router (layout + pages)
│   ├── components/
│   │   ├── atoms/              Primitives: button, badge, card, input, loading
│   │   ├── molecules/          Composed: code-block, feature-card, pagination
│   │   └── organisms/          Layout: header, footer
│   ├── store/                  Zustand slices (ui.store.ts)
│   ├── lib/
│   │   ├── http/               Modular HTTP layer (client · errors · interceptors)
│   │   └── utils/              cn · format helpers
│   ├── hooks/                  use-scroll-state
│   ├── types/                  Shared TypeScript types
│   └── design-system/tokens/   JS mirrors of CSS custom properties
├── tailwind.config.ts          Token-driven Tailwind configuration
├── jest.config.ts              Jest + Testing Library setup
├── ARCHITECTURE.md             Full project documentation
└── .env.example                Environment variable template\`;

const CLI_OPTIONS = [
  { flag: '<project-name>', required: true,  desc: 'Directory name for the new project (letters, numbers, hyphens)'   },
  { flag: '--skip-install', required: false, desc: 'Skip running npm install — useful for offline or CI environments' },
];

const TOKEN_GROUPS = [
  { group: '--brand-*',                    desc: 'Primary interactive color (indigo by default)'            },
  { group: '--glass-*',                    desc: 'Translucent surfaces, paired with backdrop-filter: blur'  },
  { group: '--surface-*',                  desc: 'Solid background hierarchy (page → base → raised → overlay)' },
  { group: '--text-*',                     desc: 'Text color scale: primary, secondary, tertiary, disabled' },
  { group: '--border-*',                   desc: 'Border and divider tokens'                                },
  { group: '--success / --error / --warning', desc: 'Semantic status colors with subtle and text variants'  },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function DocsPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-page">
      <Header />

      <main className="flex-1 px-4 py-16">
        <div className="mx-auto max-w-3xl">

          {/* ── Page header ───────────────────────────────────────────── */}
          <div className="mb-16 border-b border-border pb-12">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="size-1.5 rounded-full bg-brand animate-pulse-glow" />
              <span className="font-mono text-xs tracking-widest text-txt-tertiary uppercase">
                Documentation
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-txt-primary sm:text-4xl">
              create-atom-stack
            </h1>
            <p className="mt-4 max-w-lg text-txt-secondary">
              A CLI scaffold for production-ready Next.js projects with atomic design,
              Tailwind CSS v4, Zustand, and full DX tooling — ready in seconds.
            </p>

            {/* Quick section nav */}
            <div className="mt-8 flex flex-wrap gap-2">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={'#' + s.id}
                  className="rounded-pill border border-border bg-glass px-3 py-1 font-mono text-xs text-txt-secondary transition-colors duration-base hover:border-brand/30 hover:text-txt-primary"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* ── Introduction ──────────────────────────────────────────── */}
          <DocSection id="introduction" title="Introduction">
            <p className="text-txt-secondary leading-relaxed">
              <strong className="font-medium text-txt-primary">create-atom-stack</strong> is an
              open-source CLI that generates a complete Next.js 15 project in one command. It
              bundles atomic design principles, a token-driven Tailwind CSS v4 design system,
              Zustand state management, and production-grade DX tooling — all wired up and ready
              to extend.
            </p>
            <p className="mt-4 text-txt-secondary leading-relaxed">
              The generated project is a clean slate: no business logic, no company-specific
              styling, no unnecessary abstractions. Every file has a clear purpose and is meant to
              grow with your application.
            </p>

            <div className="mt-6 glass-panel rounded-xl p-5">
              <p className="font-mono text-xs text-txt-tertiary mb-3 uppercase tracking-wider">Included in every project</p>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  'Next.js 15 App Router',
                  'TypeScript 5 (strict)',
                  'Tailwind CSS v4',
                  'Zustand v5',
                  'ESLint 9 flat config',
                  'Prettier + Husky hooks',
                  'Commitlint (Conventional Commits)',
                  'Jest + Testing Library',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-txt-secondary">
                    <span className="size-1 shrink-0 rounded-full bg-brand/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </DocSection>

          {/* ── Installation ──────────────────────────────────────────── */}
          <DocSection id="installation" title="Installation">
            <p className="mb-5 text-txt-secondary">
              No global install required. Run directly with{' '}
              <code className="rounded bg-glass px-1.5 py-0.5 font-mono text-sm text-brand">npx</code>:
            </p>

            <CodeBlock title="~ terminal" lines={INSTALL_COMMANDS} />

            <div className="mt-5 overflow-hidden rounded-xl border border-border">
              <div className="border-b border-border bg-surface-overlay px-4 py-2.5">
                <p className="font-mono text-xs text-txt-tertiary">Requirements</p>
              </div>
              <div className="bg-surface-sunken p-4">
                <ul className="flex flex-col gap-2 font-mono text-xs text-txt-secondary">
                  <li className="flex items-center gap-2">
                    <span className="size-1 rounded-full bg-success/60" />
                    Node.js &gt;= 18.0.0
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1 rounded-full bg-success/60" />
                    npm &gt;= 9.0.0
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1 rounded-full bg-txt-tertiary/40" />
                    Git — optional, required for Husky hook setup
                  </li>
                </ul>
              </div>
            </div>
          </DocSection>

          {/* ── CLI Options ───────────────────────────────────────────── */}
          <DocSection id="cli-options" title="CLI Options">
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-surface-overlay">
                    <th className="px-4 py-3 font-mono text-xs font-medium text-txt-tertiary">Flag</th>
                    <th className="px-4 py-3 font-mono text-xs font-medium text-txt-tertiary">Required</th>
                    <th className="px-4 py-3 font-mono text-xs font-medium text-txt-tertiary">Description</th>
                  </tr>
                </thead>
                <tbody className="bg-surface-sunken">
                  {CLI_OPTIONS.map((opt, i) => (
                    <tr
                      key={opt.flag}
                      className={i < CLI_OPTIONS.length - 1 ? 'border-b border-border' : ''}
                    >
                      <td className="px-4 py-3.5">
                        <code className="font-mono text-sm text-brand">{opt.flag}</code>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={['font-mono text-xs', opt.required ? 'text-success-text' : 'text-txt-tertiary'].join(' ')}>
                          {opt.required ? 'yes' : 'no'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-txt-secondary">{opt.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DocSection>

          {/* ── Project Structure ─────────────────────────────────────── */}
          <DocSection id="structure" title="Project Structure">
            <p className="mb-5 text-txt-secondary leading-relaxed">
              The generated project follows{' '}
              <strong className="font-medium text-txt-primary">atomic design</strong>: UI is
              organised into atoms (primitives), molecules (composed atoms), and organisms
              (layout-level components). Each layer has a clear scope — atoms know nothing about
              the domain, organisms can hold state and data.
            </p>

            <CodeBlock title="my-app/" content={FILE_TREE} />

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {[
                { layer: 'atoms/', color: 'text-brand',   desc: 'Stateless primitives, no domain knowledge'     },
                { layer: 'molecules/', color: 'text-brand', desc: 'Composed atoms, one interaction pattern each' },
                { layer: 'organisms/', color: 'text-brand', desc: 'Layout-level, may hold state or fetch data'   },
              ].map((l) => (
                <div key={l.layer} className="flex-1 rounded-xl border border-border bg-surface-sunken p-4">
                  <code className={'font-mono text-xs ' + l.color}>{l.layer}</code>
                  <p className="mt-1 text-xs text-txt-tertiary">{l.desc}</p>
                </div>
              ))}
            </div>
          </DocSection>

          {/* ── Design System ─────────────────────────────────────────── */}
          <DocSection id="design-system" title="Design System">
            <p className="mb-5 text-txt-secondary leading-relaxed">
              All visual decisions are CSS custom properties in{' '}
              <code className="rounded bg-glass px-1.5 py-0.5 font-mono text-sm text-brand">
                src/app/globals.css
              </code>
              , mapped to Tailwind utilities in{' '}
              <code className="rounded bg-glass px-1.5 py-0.5 font-mono text-sm text-brand">
                tailwind.config.ts
              </code>
              . Dark mode is the default — switching themes sets a{' '}
              <code className="rounded bg-glass px-1.5 py-0.5 font-mono text-sm text-brand">
                data-theme
              </code>{' '}
              attribute on{' '}
              <code className="rounded bg-glass px-1.5 py-0.5 font-mono text-sm text-brand">
                &lt;html&gt;
              </code>
              , so no{' '}
              <code className="rounded bg-glass px-1.5 py-0.5 font-mono text-sm text-brand">
                dark:
              </code>{' '}
              Tailwind variants are needed.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {TOKEN_GROUPS.map((t) => (
                <div key={t.group} className="glass-panel rounded-xl p-4 shadow-glass-xs">
                  <code className="font-mono text-xs text-brand">{t.group}</code>
                  <p className="mt-1.5 text-xs text-txt-tertiary leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 glass-panel rounded-xl p-5 shadow-glass-xs">
              <p className="mb-3 font-mono text-xs text-txt-tertiary uppercase tracking-wider">
                Theme switching
              </p>
              <CodeBlock
                lines={[
                  { prompt: '//', code: "document.documentElement.setAttribute('data-theme', 'light')" },
                  { prompt: '//', code: "document.documentElement.setAttribute('data-theme', 'dark')" },
                ]}
              />
              <p className="mt-3 text-xs text-txt-tertiary">
                The{' '}
                <code className="font-mono text-brand">useUiStore</code> Zustand store handles
                this for you — call <code className="font-mono text-brand">toggleTheme()</code>{' '}
                and the attribute updates automatically.
              </p>
            </div>
          </DocSection>

        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function DocSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mb-16 scroll-mt-20">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-px w-6 shrink-0 bg-brand/50" />
        <h2 className="text-lg font-semibold text-txt-primary">{title}</h2>
      </div>
      <div>{children}</div>
    </section>
  );
}
`;
