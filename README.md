# create-atom-stack

**create-atom-stack** is a CLI scaffolding tool that generates a production-ready [Next.js 15](https://nextjs.org) project with atomic design, Zustand, Tailwind CSS v4, and Conventional Commits — in a single command.

No boilerplate hunting. No config copy-pasting. Just run and build.

[![npm version](https://img.shields.io/npm/v/create-atom-stack)](https://www.npmjs.com/package/create-atom-stack)
[![npm downloads](https://img.shields.io/npm/dm/create-atom-stack)](https://www.npmjs.com/package/create-atom-stack)
[![license](https://img.shields.io/npm/l/create-atom-stack)](https://github.com/hakizimana-fred/create-atom-stack/blob/main/LICENSE)

**Links:** [NPM Package](https://www.npmjs.com/package/create-atom-stack) · [GitHub Repository](https://github.com/hakizimana-fred/create-atom-stack)

---

![create-atom-stack CLI screenshot](./atomstack.png)

---

## Quick Start

Three ways to scaffold — pick what fits your workflow:

**Fully interactive** — the CLI asks your name, package manager, state library, and E2E framework:

```bash
npx create-atom-stack
```

**Zero-config** — pass a name and get a project in seconds using smart defaults (npm · Zustand · no E2E):

```bash
npx create-atom-stack my-app
```

**Explicit flags** — non-interactive with full control, great for scripts and CI:

```bash
npx create-atom-stack my-app --pm=pnpm --state=jotai --e2e=playwright
```

Then start developing:

```bash
cd my-app
pnpm dev   # or: npm run dev / yarn dev / bun dev
```

---

## Options

| Flag | Default | Description |
|---|---|---|
| `--pm=<npm\|pnpm\|yarn\|bun>` | `npm` | Package manager |
| `--state=<zustand\|jotai\|none>` | `zustand` | State management library |
| `--e2e=<playwright\|cypress\|none>` | `none` | End-to-end testing framework |
| `--no-conventional-commits` | — | Skip Husky + Commitlint setup |
| `--skip-install` | — | Scaffold files only, skip `install` |

---

## What You Get

**54 files scaffolded**, organized as:

```
<project>/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── globals.css             # All CSS design tokens (light + dark)
│   │   ├── layout.tsx              # Root layout with Geist fonts
│   │   └── (dashboard)/            # Dashboard route group
│   │       ├── layout.tsx          # Sidebar + Topbar shell
│   │       └── dashboard/page.tsx  # Example dashboard page
│   │
│   ├── components/                 # Atomic Design System
│   │   ├── atoms/                  # Button, Badge, Card, Input, Loading, Typography
│   │   ├── molecules/              # MetricCard, Pagination
│   │   └── organisms/              # Sidebar, Topbar
│   │
│   ├── store/                      # Zustand (ui.store — theme + sidebar)
│   ├── types/                      # AsyncState, PaginatedResponse, etc.
│   ├── lib/                        # Axios client, cn(), formatters
│   ├── hooks/                      # useScrollState
│   ├── data/constants/             # NAV_ITEMS navigation config
│   └── design-system/tokens/       # JS mirrors of CSS tokens (colors, spacing, etc.)
│
├── tailwind.config.ts              # Full token-driven Tailwind config
├── .husky/                         # pre-commit lint + commit-msg lint
├── .vscode/                        # settings.json, launch.json, extensions.json
├── commitlint.config.ts            # Conventional Commits rules
├── .releaserc                      # Semantic-release config
├── .nvmrc                          # Node 22.19.0
├── ARCHITECTURE.md                 # Project structure guide
└── docs/                           # Design system + getting started docs
```

---

## Tech Stack

| Category | Choice |
|---|---|
| Framework | Next.js 15 App Router |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 |
| State | Zustand v5 |
| Icons | Lucide React |
| HTTP | Axios |
| Fonts | Geist Sans + Geist Mono |
| Toasts | Sonner |
| Git Hooks | Husky + Commitlint |
| Testing | Jest + Testing Library |
| Formatting | Prettier |
| Linting | ESLint 9 |
| Releases | Semantic Release |

---

## Design System

The design system is **token-driven**: all design decisions live as CSS custom properties in `globals.css` and are mapped to Tailwind utilities via `tailwind.config.ts`.

Theme switching is controlled by `data-theme="dark"` on `<html>` — no `dark:` class variants needed.

**Key color groups:**

- `--glass-*` — Frosted glass surfaces
- `--surface-*` — Solid backgrounds
- `--text-*` / `txt-*` utilities — Text hierarchy
- `--brand-*` — Primary interactive color
- `--profit` / `--loss` / `--warning` — Status colors

---

## Contributing / Local Development

```bash
# Clone and install
git clone https://github.com/hakizimana-fred/create-atom-stack.git
cd create-atom-stack
npm install

# Build the CLI
npm run build

# Watch mode (rebuild on change)
npm run dev

# Test locally without publishing
node dist/index.js my-test-app --skip-install
```

---

## Publishing

```bash
npm publish
```

After publishing, users can scaffold a new project with:

```bash
npx create-atom-stack my-app
# or
pnpm dlx create-atom-stack my-app
# or
bunx create-atom-stack my-app
```

---

## Keywords

`create-atom-stack` · `create atom stack` · CLI tool · project scaffolding · Next.js starter · JavaScript starter · TypeScript boilerplate · atomic design · React scaffold · frontend starter kit
