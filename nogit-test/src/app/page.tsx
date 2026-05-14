import { Header } from '@/components/organisms/header';
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

const PROJECT_STRUCTURE = `src/
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
│   ├── api/client.ts        # typed fetch wrapper
│   └── utils/               # cn · format
├── hooks/
│   └── use-scroll-state.ts
├── design-system/tokens/    # js mirrors of css tokens
└── data/constants/
    └── navigation.ts        # NAV_LINKS`;

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
