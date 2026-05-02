# create-atom-stack

Scaffold a production-ready Next.js App Router project with atomic design, Zustand, Tailwind CSS v4, and Conventional Commits — in one command.

## Usage

```bash
npx create-atom-stack <project-name>
```

**Example:**
```bash
npx create-atom-stack my-dashboard
cd my-dashboard
npm run dev
```

## Options

| Flag | Description |
|---|---|
| `--skip-install` | Skip `npm install` (scaffolds files only) |

## What you get

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

## Design System

The design system is **token-driven**: all design decisions are CSS custom properties in `globals.css`, mapped to Tailwind utilities via `tailwind.config.ts`.

Theme switching is controlled by `data-theme="dark"` on `<html>` — no `dark:` class variants needed.

**Key color groups:**
- `--glass-*` — Frosted glass surfaces
- `--surface-*` — Solid backgrounds
- `--text-*` / `txt-*` utilities — Text hierarchy
- `--brand-*` — Primary interactive color
- `--profit` / `--loss` / `--warning` — Status colors

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

## Development

```bash
# Build the CLI
npm run build

# Watch mode (rebuild on change)
npm run dev

# Test locally
node dist/index.js my-app --skip-install
```

## Publishing

```bash
npm publish
```

After publishing, users can run:
```bash
npx create-atom-stack my-app
```
