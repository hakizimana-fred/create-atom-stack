# Architecture — nogit-test

## Overview

nogit-test is built with **Next.js 15 (App Router)**, **React 19**, and **TypeScript 5**.
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

```
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
```

---

## Component Architecture

### Atoms — `src/components/atoms/`
Self-contained, stateless primitives. No domain knowledge.

| Component | Purpose |
|---|---|
| `Button` | 5 variants, 4 sizes, loading state, polymorphic `as` prop |
| `Card` | Surface container (solid, glass, glass-raised) |
| `Badge` | Status chips (success, error, warning, brand, neutral, info) |
| `Input` | Text field with optional leading icon + error state |
| `Typography` | Heading, Body, Label, Caption |
| `Loading` | CSS spinner with size + label variants |

### Molecules — `src/components/molecules/`
Combinations of atoms serving a single interaction pattern.

| Component | Purpose |
|---|---|
| `CodeBlock` | Terminal-style or preformatted code/tree display |
| `FeatureCard` | Icon + title + description card for showcasing features |
| `Pagination` | Previous/next controls with page counter |

### Organisms — `src/components/organisms/`
Layout-level components that compose atoms and molecules.

| Component | Purpose |
|---|---|
| `Header` | Sticky navigation bar with logo, links, theme toggle |
| `Footer` | Site footer with brand and navigation links |

---

## Theme System

Dark mode is the default. The theme is controlled via `data-theme` on `<html>`
— no `dark:` Tailwind variants needed.

```typescript
// Toggle theme (already wired in Header via useUiStore)
document.documentElement.setAttribute('data-theme', 'light');
```

All design decisions are CSS custom properties in `src/app/globals.css`:

- `--glass-*` — Translucent surfaces with backdrop blur
- `--surface-*` — Solid backgrounds
- `--text-*` — Text colors (`text-txt-primary`, `text-txt-secondary`, etc.)
- `--border-*` — Border colors
- `--brand-*` — Primary interactive color (indigo)
- `--success / --error / --warning` — Semantic status colors

---

## State Management

Zustand stores are small and focused. One store per concern.

```typescript
import { useUiStore } from '@/store/ui.store';

const { theme, toggleTheme } = useUiStore();
```

Add new stores at `src/store/<feature>.store.ts`.

---

## API Client

A typed fetch wrapper at `src/lib/api/client.ts`:

```typescript
import { api } from '@/lib/api/client';

// GET with query params
const users = await api.get<User[]>('/users', { params: { page: 1 } });

// POST with body
const user = await api.post<User>('/users', { name: 'Alice' });
```

Set `NEXT_PUBLIC_API_URL` in `.env.local` to point at your backend.

---

## Routing

Next.js App Router. Add new routes by creating folders under `src/app`.

```
/          → src/app/page.tsx    (landing page)
/about     → src/app/about/page.tsx
```

**Server vs Client:** Pages/layouts are Server Components by default.
Interactive components opt in with `'use client'`.

---

## Path Aliases

`@/*` maps to `src/*`. Always use aliases — never deep relative paths.

```typescript
import { cn } from '@/lib/utils/cn';
import { useUiStore } from '@/store/ui.store';
import { Button } from '@/components/atoms/button';
```

---

## Commit Convention

Conventional Commits enforced by Commitlint + Husky:

```
feat: add user settings page
fix: correct pagination offset
chore: upgrade tailwindcss
docs: update architecture guide
```

Allowed types: `build` `chore` `ci` `docs` `feat` `fix` `perf` `refactor` `revert` `style` `test`

---

## Testing

Tests live next to the component or module they cover:

```
src/components/atoms/button/__tests__/button.test.tsx
src/lib/utils/__tests__/format.test.ts
```

Run: `npm test` · Watch mode: `npm run test:watch`
