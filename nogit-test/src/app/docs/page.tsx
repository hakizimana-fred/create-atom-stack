import type { ReactNode } from 'react';
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

const FILE_TREE = `my-app/
├── src/
│   ├── app/                    Next.js App Router (layout + pages)
│   ├── components/
│   │   ├── atoms/              Primitives: button, badge, card, input, loading
│   │   ├── molecules/          Composed: code-block, feature-card, pagination
│   │   └── organisms/          Layout: header, footer
│   ├── store/                  Zustand slices (ui.store.ts)
│   ├── lib/
│   │   ├── api/client.ts       Typed fetch wrapper (get/post/put/patch/delete)
│   │   └── utils/              cn · format helpers
│   ├── hooks/                  use-scroll-state
│   ├── types/                  Shared TypeScript types
│   └── design-system/tokens/   JS mirrors of CSS custom properties
├── tailwind.config.ts          Token-driven Tailwind configuration
├── jest.config.ts              Jest + Testing Library setup
├── ARCHITECTURE.md             Full project documentation
└── .env.example                Environment variable template`;

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
