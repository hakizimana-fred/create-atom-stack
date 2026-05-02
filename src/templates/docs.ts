const B1 = '`';
const B3 = B1.repeat(3);

export function architectureMd(projectName: string): string {
  return `# Architecture — ${projectName}

## Overview

${projectName} is built with **Next.js 15 (App Router)**, **React 19**, and **TypeScript 5**.
It follows an atomic design system and uses Zustand for client-side state.

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 App Router |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 (token-driven) |
| State Management | Zustand v5 |
| Icons | Lucide React |
| HTTP Client | Native Fetch API |
| Formatting | Prettier |
| Linting | ESLint 9 (flat config) |
| Git Hooks | Husky + Commitlint |
| Testing | Jest + Testing Library |

---

## Directory Structure

${B3}
src/
├── app/                         # Next.js App Router
│   ├── layout.tsx               # Root layout (fonts, metadata, dark theme)
│   ├── globals.css              # Design token variables + base styles
│   └── page.tsx                 # Landing homepage
│
├── components/                  # Atomic Design System
│   ├── atoms/                   # Stateless primitives
│   │   ├── badge/
│   │   ├── button/
│   │   ├── card/
│   │   ├── input/
│   │   ├── loading/
│   │   └── typography/
│   ├── molecules/               # Composed atoms
│   │   ├── code-block/
│   │   ├── feature-card/
│   │   └── pagination/
│   └── organisms/               # Layout-level components
│       ├── header/
│       └── footer/
│
├── store/                       # Zustand stores (one per concern)
│   └── ui.store.ts
│
├── types/                       # TypeScript definitions
│   ├── common.ts
│   └── index.ts
│
├── data/
│   └── constants/
│       └── navigation.ts        # NAV_LINKS array
│
├── design-system/
│   └── tokens/                  # JS mirrors of CSS tokens
│       ├── colors.ts
│       ├── radius.ts
│       ├── shadows.ts
│       ├── spacing.ts
│       └── typography.ts
│
├── lib/
│   ├── api/
│   │   └── client.ts            # Fetch wrapper (get/post/put/patch/delete)
│   └── utils/
│       ├── cn.ts                # Class name merger
│       └── format.ts            # Number, percent, date formatters
│
└── hooks/
    └── use-scroll-state.ts      # Tracks window scroll offset
${B3}

---

## Component Architecture

### Atoms — ${B1}src/components/atoms/${B1}
Self-contained, stateless primitives. No domain knowledge.

| Component | Purpose |
|---|---|
| ${B1}Button${B1} | 5 variants, 4 sizes, loading state, polymorphic ${B1}as${B1} prop |
| ${B1}Card${B1} | Surface container (solid, glass, glass-raised) |
| ${B1}Badge${B1} | Status chips (success, error, warning, brand, neutral, info) |
| ${B1}Input${B1} | Text field with optional leading icon + error state |
| ${B1}Typography${B1} | Heading, Body, Label, Caption |
| ${B1}Loading${B1} | CSS spinner with size + label variants |

### Molecules — ${B1}src/components/molecules/${B1}
Combinations of atoms serving a single interaction pattern.

| Component | Purpose |
|---|---|
| ${B1}CodeBlock${B1} | Terminal-style or preformatted code/tree display |
| ${B1}FeatureCard${B1} | Icon + title + description card for showcasing features |
| ${B1}Pagination${B1} | Previous/next controls with page counter |

### Organisms — ${B1}src/components/organisms/${B1}
Layout-level components that compose atoms and molecules.

| Component | Purpose |
|---|---|
| ${B1}Header${B1} | Sticky navigation bar with logo, links, theme toggle |
| ${B1}Footer${B1} | Site footer with brand and navigation links |

---

## Theme System

Dark mode is the default. The theme is controlled via ${B1}data-theme${B1} on ${B1}<html>${B1}
— no ${B1}dark:${B1} Tailwind variants needed.

${B3}typescript
// Toggle theme (already wired in Header via useUiStore)
document.documentElement.setAttribute('data-theme', 'light');
${B3}

All design decisions are CSS custom properties in ${B1}src/app/globals.css${B1}:

- ${B1}--glass-*${B1} — Translucent surfaces with backdrop blur
- ${B1}--surface-*${B1} — Solid backgrounds
- ${B1}--text-*${B1} — Text colors (${B1}text-txt-primary${B1}, ${B1}text-txt-secondary${B1}, etc.)
- ${B1}--border-*${B1} — Border colors
- ${B1}--brand-*${B1} — Primary interactive color (indigo)
- ${B1}--success / --error / --warning${B1} — Semantic status colors

---

## State Management

Zustand stores are small and focused. One store per concern.

${B3}typescript
import { useUiStore } from '@/store/ui.store';

const { theme, toggleTheme } = useUiStore();
${B3}

Add new stores at ${B1}src/store/<feature>.store.ts${B1}.

---

## API Client

A typed fetch wrapper at ${B1}src/lib/api/client.ts${B1}:

${B3}typescript
import { api } from '@/lib/api/client';

// GET with query params
const users = await api.get<User[]>('/users', { params: { page: 1 } });

// POST with body
const user = await api.post<User>('/users', { name: 'Alice' });
${B3}

Set ${B1}NEXT_PUBLIC_API_URL${B1} in ${B1}.env.local${B1} to point at your backend.

---

## Routing

Next.js App Router. Add new routes by creating folders under ${B1}src/app${B1}.

${B3}
/          → src/app/page.tsx    (landing page)
/about     → src/app/about/page.tsx
${B3}

**Server vs Client:** Pages/layouts are Server Components by default.
Interactive components opt in with ${B1}'use client'${B1}.

---

## Path Aliases

${B1}@/*${B1} maps to ${B1}src/*${B1}. Always use aliases — never deep relative paths.

${B3}typescript
import { cn } from '@/lib/utils/cn';
import { useUiStore } from '@/store/ui.store';
import { Button } from '@/components/atoms/button';
${B3}

---

## Commit Convention

Conventional Commits enforced by Commitlint + Husky:

${B3}
feat: add user settings page
fix: correct pagination offset
chore: upgrade tailwindcss
docs: update architecture guide
${B3}

Allowed types: ${B1}build${B1} ${B1}chore${B1} ${B1}ci${B1} ${B1}docs${B1} ${B1}feat${B1} ${B1}fix${B1} ${B1}perf${B1} ${B1}refactor${B1} ${B1}revert${B1} ${B1}style${B1} ${B1}test${B1}

---

## Testing

Tests live next to the component or module they cover:

${B3}
src/components/atoms/button/__tests__/button.test.tsx
src/lib/utils/__tests__/format.test.ts
${B3}

Run: ${B1}npm test${B1} · Watch mode: ${B1}npm run test:watch${B1}
`;
}

export function gettingStartedMd(projectName: string): string {
  return `# Getting Started — ${projectName}

## Prerequisites

- Node.js >= 18 (see ${B1}.nvmrc${B1})
- npm >= 9

## Setup

${B3}bash
git clone <repo-url>
cd ${projectName}
npm install
cp .env.example .env.local
npm run dev
${B3}

The app runs at ${B1}http://localhost:3000${B1}.

## Available Scripts

| Script | Description |
|---|---|
| ${B1}npm run dev${B1} | Start development server |
| ${B1}npm run build${B1} | Production build |
| ${B1}npm run lint${B1} | ESLint check |
| ${B1}npm run prettier${B1} | Format all files |
| ${B1}npm test${B1} | Run Jest tests |
| ${B1}npm run test:watch${B1} | Watch mode |

## Environment Variables

Copy ${B1}.env.example${B1} to ${B1}.env.local${B1} and fill in your values.

| Variable | Description |
|---|---|
| ${B1}NEXT_PUBLIC_API_URL${B1} | API base URL (client-accessible) |
| ${B1}API_URL${B1} | API base URL (server-side only) |

## Adding Pages

Create a new folder under ${B1}src/app/${B1}:

${B3}bash
mkdir -p src/app/about
touch src/app/about/page.tsx
${B3}

The Header and Footer are rendered in ${B1}src/app/page.tsx${B1} — move them to
${B1}src/app/layout.tsx${B1} when you add more pages that share the same navigation.
`;
}

export function designSystemMd(): string {
  return `# Design System

## Overview

The design system is **token-driven**: all visual decisions are CSS custom
properties in ${B1}src/app/globals.css${B1}, mapped to Tailwind utilities via
${B1}tailwind.config.ts${B1}. Switching themes requires only changing ${B1}data-theme${B1}
on ${B1}<html>${B1}.

Dark mode is the **default**. Light mode is available by setting ${B1}data-theme="light"${B1}.

---

## Color Tokens

### Surfaces

| Token | Tailwind | Usage |
|---|---|---|
| ${B1}--page-bg${B1} | ${B1}bg-surface-page${B1} | HTML background |
| ${B1}--surface-base${B1} | ${B1}bg-surface-base${B1} | Page content area |
| ${B1}--surface-raised${B1} | ${B1}bg-surface${B1} | Cards, panels |
| ${B1}--glass-surface${B1} | ${B1}bg-glass${B1} | Frosted glass overlays |

### Text

| Token | Tailwind | Usage |
|---|---|---|
| ${B1}--text-primary${B1} | ${B1}text-txt-primary${B1} | Main body text |
| ${B1}--text-secondary${B1} | ${B1}text-txt-secondary${B1} | Supporting text |
| ${B1}--text-tertiary${B1} | ${B1}text-txt-tertiary${B1} | Placeholders, hints |
| ${B1}--text-inverse${B1} | ${B1}text-txt-inverse${B1} | Text on colored bg |

### Interactive

| Token | Tailwind | Usage |
|---|---|---|
| ${B1}--brand${B1} | ${B1}bg-brand / text-brand${B1} | Primary actions |
| ${B1}--brand-hover${B1} | ${B1}hover:bg-brand-hover${B1} | Hover state |
| ${B1}--brand-subtle${B1} | ${B1}bg-brand-subtle${B1} | Active state chips |
| ${B1}--brand-glow${B1} | — | Glow shadow accent |

### Semantic Status

| Token | Tailwind | Usage |
|---|---|---|
| ${B1}--success${B1} | ${B1}text-success / bg-success${B1} | Positive outcomes |
| ${B1}--error${B1} | ${B1}text-error / bg-error${B1} | Errors, destructive actions |
| ${B1}--warning${B1} | ${B1}text-warning / bg-warning${B1} | Caution states |

---

## Typography

The ${B1}Heading${B1}, ${B1}Body${B1}, ${B1}Label${B1}, and ${B1}Caption${B1} components from
${B1}src/components/atoms/typography${B1} cover all text patterns.

${B3}tsx
<Heading level={1}>Page Title</Heading>
<Body size="lg" secondary>Supporting text</Body>
<Label tertiary>SECTION LABEL</Label>
<Caption>Small note</Caption>
${B3}

---

## Glass Utilities

${B3}html
<!-- Standard frosted panel -->
<div class="glass-panel rounded-xl p-4">...</div>

<!-- Elevated panel (modals, dropdowns) -->
<div class="glass-panel-raised rounded-2xl p-6">...</div>

<!-- Sticky header that activates on scroll -->
<header class="glass-topbar">...</header>
${B3}

---

## Background Patterns

${B3}html
<!-- Subtle grid lines (great for hero sections) -->
<div class="bg-grid">...</div>

<!-- Dot grid pattern -->
<div class="bg-dots">...</div>
${B3}

---

## Layout Constants

| Token | Value | Tailwind |
|---|---|---|
| Sidebar (collapsed) | 64px | ${B1}w-sidebar${B1} |
| Sidebar (expanded) | 240px | ${B1}w-sidebar-expanded${B1} |
| Header height | 56px | ${B1}h-header${B1} |
| Max content width | 1280px | ${B1}max-w-content${B1} |
`;
}
