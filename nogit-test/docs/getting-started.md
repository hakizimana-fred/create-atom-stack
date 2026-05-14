# Getting Started — nogit-test

## Prerequisites

- Node.js >= 18 (see `.nvmrc`)
- npm >= 9

## Setup

```bash
git clone <repo-url>
cd nogit-test
npm install
cp .env.example .env.local
npm run dev
```

The app runs at `http://localhost:3000`.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm run prettier` | Format all files |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Watch mode |

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | API base URL (client-accessible) |
| `API_URL` | API base URL (server-side only) |

## Adding Pages

Create a new folder under `src/app/`:

```bash
mkdir -p src/app/about
touch src/app/about/page.tsx
```

The Header and Footer are rendered in `src/app/page.tsx` — move them to
`src/app/layout.tsx` when you add more pages that share the same navigation.
