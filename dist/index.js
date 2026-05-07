#!/usr/bin/env node

// src/index.ts
import * as p4 from "@clack/prompts";
import chalk8 from "chalk";
import ora2 from "ora";

// src/create.ts
import path from "path";
import fs from "fs";
import { execSync, spawn } from "child_process";
import chalk from "chalk";

// src/templates/package-json.ts
function packageJsonTemplate(name, opts) {
  const expectedPackageManager = opts.pm;
  const packageManagerCheck = `node -e "const ua=process.env.npm_config_user_agent||''; const pm='` + expectedPackageManager + "/'; if (!ua.startsWith(pm)) { console.error('Use " + expectedPackageManager + ` to install dependencies.'); process.exit(1); }"`;
  const stateDep = opts.stateManagement === "zustand" ? { zustand: "^5.0.11" } : opts.stateManagement === "jotai" ? { jotai: "^2.11.3" } : opts.stateManagement === "react-query" ? { "@tanstack/react-query": "^5.80.2" } : {};
  const advancedDeps = {
    ...opts.advancedAddons.includes("rxjs") ? { rxjs: "^7.8.2" } : {},
    ...opts.advancedAddons.includes("xstate") ? { xstate: "^5.19.4", "@xstate/react": "^4.1.3" } : {}
  };
  const e2eDep = opts.e2e === "playwright" ? { "@playwright/test": "^1.52.0" } : opts.e2e === "cypress" ? { cypress: "^13.17.0" } : {};
  const e2eScripts = opts.e2e === "playwright" ? {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed"
  } : opts.e2e === "cypress" ? {
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open"
  } : {};
  const engines = { node: ">=18.0.0" };
  if (opts.pm === "npm") engines.npm = ">=9.0.0";
  if (opts.pm === "pnpm") engines.pnpm = ">=9.0.0";
  if (opts.pm === "yarn") engines.yarn = ">=1.22.0";
  if (opts.pm === "bun") engines.bun = ">=1.0.0";
  return JSON.stringify(
    {
      name,
      version: "0.1.0",
      private: true,
      engines,
      scripts: {
        preinstall: packageManagerCheck,
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "eslint",
        prettier: "prettier --write .",
        ...opts.conventionalCommits ? { prepare: "husky" } : {},
        test: "jest",
        "test:watch": "jest --watch",
        ...e2eScripts
      },
      dependencies: {
        geist: "^1.3.1",
        "lucide-react": "^0.474.0",
        next: "15.3.8",
        react: "19.1.0",
        "react-dom": "19.1.0",
        ...stateDep,
        ...advancedDeps
      },
      devDependencies: {
        ...opts.conventionalCommits ? {
          "@commitlint/cli": "^20.4.2",
          "@commitlint/config-conventional": "^20.4.2",
          "@commitlint/types": "^20.4.0"
        } : {},
        "@tailwindcss/postcss": "^4",
        "@testing-library/jest-dom": "^6.9.1",
        "@testing-library/react": "^16.3.2",
        "@testing-library/user-event": "^14.6.1",
        "@types/jest": "^30.0.0",
        "@types/node": "^20",
        "@types/react": "^19",
        "@types/react-dom": "^19",
        ...e2eDep,
        eslint: "^9",
        "eslint-config-next": "15.3.8",
        ...opts.conventionalCommits ? { husky: "^9.1.7" } : {},
        jest: "^30.0.0",
        "jest-environment-jsdom": "^30.0.0",
        prettier: "^3.8.1",
        tailwindcss: "^4",
        "ts-jest": "^29.4.9",
        typescript: "^5"
      }
    },
    null,
    2
  );
}

// src/templates/advanced.ts
var rxCounterService = `import { BehaviorSubject, map } from 'rxjs';

const _count$ = new BehaviorSubject(0);

export const count$ = _count$.asObservable();
export const doubled$ = count$.pipe(map((n) => n * 2));

export const counterService = {
  increment: () => _count$.next(_count$.getValue() + 1),
  decrement: () => _count$.next(_count$.getValue() - 1),
  reset:     () => _count$.next(0),
};
`;
var useObservable = `'use client';

import { useEffect, useState } from 'react';
import type { Observable } from 'rxjs';

export function useObservable<T>(observable: Observable<T>, initialValue: T): T {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const sub = observable.subscribe(setValue);
    return () => sub.unsubscribe();
  }, [observable]);

  return value;
}
`;
var toggleMachineTemplate = `import { createMachine } from 'xstate';

export const toggleMachine = createMachine({
  id: 'toggle',
  initial: 'off',
  states: {
    off: { on: { TOGGLE: 'on'  } },
    on:  { on: { TOGGLE: 'off' } },
  },
});
`;
var useToggleMachine = `'use client';

import { useMachine } from '@xstate/react';
import { toggleMachine } from '@/lib/machines/toggle.machine';

export function useToggleMachine() {
  const [state, send] = useMachine(toggleMachine);
  return {
    isOn:   state.matches('on'),
    toggle: () => send({ type: 'TOGGLE' }),
  };
}
`;

// src/templates/root-configs.ts
var tsconfigJson = JSON.stringify(
  {
    compilerOptions: {
      target: "ES2017",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "react-jsx",
      incremental: true,
      plugins: [{ name: "next" }],
      paths: { "@/*": ["./src/*"] }
    },
    include: [
      "next-env.d.ts",
      "**/*.ts",
      "**/*.tsx",
      ".next/types/**/*.ts",
      ".next/dev/types/**/*.ts",
      "**/*.mts"
    ],
    exclude: ["node_modules"]
  },
  null,
  2
);
var nextConfig = `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

export default nextConfig;
`;
var postCssConfig = `const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
`;
var prettierRc = JSON.stringify(
  {
    semi: true,
    singleQuote: true,
    trailingComma: "all",
    tabWidth: 2,
    printWidth: 100,
    arrowParens: "always",
    bracketSpacing: true,
    endOfLine: "lf"
  },
  null,
  2
);
var prettierIgnore = `.next
node_modules
dist
out
build
public
*.min.js
*.min.css
`;
var gitIgnore = `# Dependencies
node_modules
.pnp
.pnp.js

# Next.js build output
.next/
out/
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
playwright-report/
test-results/

# Misc
.DS_Store
*.pem
Thumbs.db

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
`;
var nvmrc = `22.19.0
`;
var npmrc = `engine-strict=true
fetch-timeout=300000
fetch-retries=5
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
network-concurrency=4
`;
var envExample = `# API base URL (server-side \u2014 used by Next.js server components and API routes)
API_URL=http://localhost:3000

# API base URL (client-side \u2014 exposed to the browser)
NEXT_PUBLIC_API_URL=http://localhost:3000
`;
var nextEnvDts = `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.
`;
var jestConfig = `import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/e2e/'],
};

export default createJestConfig(config);
`;
var jestSetup = `import '@testing-library/jest-dom';
`;
function playwrightConfig(pm) {
  const devCmd = pm === "npm" ? "npm run dev" : pm === "pnpm" ? "pnpm dev" : pm === "yarn" ? "yarn dev" : "bun dev";
  return `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: '${devCmd}',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
`;
}

// src/templates/tooling.ts
var eslintConfig = `import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
`;
var commitlintConfig = `import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'translation',
        'security',
        'changeset',
      ],
    ],
  },
};

export default config;
`;
var releaserc = JSON.stringify(
  {
    branches: ["main", "master", { name: "v*-Alpha", prerelease: "alpha" }],
    plugins: [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/changelog",
      "@semantic-release/github",
      [
        "@semantic-release/git",
        {
          assets: ["CHANGELOG.md", "package.json"],
          message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
        }
      ]
    ]
  },
  null,
  2
);
function huskyPreCommit(pm) {
  const run = pm === "npm" ? "npm run" : pm === "yarn" ? "yarn" : pm === "bun" ? "bun run" : "pnpm";
  return `${run} lint
`;
}
var huskyCommitMsg = `#!/usr/bin/env sh
npx --no -- commitlint --edit "$1"
`;
function huskyPrePush(pm) {
  const run = pm === "npm" ? "npm run" : pm === "yarn" ? "yarn" : pm === "bun" ? "bun run" : "pnpm";
  return `${run} build
`;
}
var vsCodeSettings = JSON.stringify(
  {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.formatOnPaste": true,
    "editor.codeActionsOnSave": {
      "source.fixAll": "never",
      "source.fixAll.eslint": "explicit",
      "source.organizeImports": "never"
    },
    "files.trimTrailingWhitespace": true,
    "files.insertFinalNewline": true,
    "typescript.preferences.importModuleSpecifier": "non-relative",
    "typescript.tsdk": "node_modules/typescript/lib",
    "editor.rulers": [100]
  },
  null,
  2
);
var vsCodeLaunch = JSON.stringify(
  {
    version: "0.1.0",
    configurations: [
      {
        name: "Next.js: debug server-side",
        type: "node-terminal",
        request: "launch",
        command: "npm run dev"
      },
      {
        name: "Next.js: debug client-side",
        type: "pwa-chrome",
        request: "launch",
        url: "http://localhost:3000"
      },
      {
        name: "Next.js: debug full stack",
        type: "node-terminal",
        request: "launch",
        command: "npm run dev",
        console: "integratedTerminal",
        serverReadyAction: {
          pattern: "started server on .+, url: (https?://.+)",
          uriFormat: "%s",
          action: "debugWithChrome"
        }
      }
    ]
  },
  null,
  2
);
var vsCodeExtensions = JSON.stringify(
  {
    recommendations: [
      "esbenp.prettier-vscode",
      "dbaeumer.vscode-eslint",
      "bradlc.vscode-tailwindcss",
      "ms-vscode.vscode-typescript-next",
      "formulahendry.auto-rename-tag"
    ]
  },
  null,
  2
);

// src/templates/tailwind-and-styles.ts
var tailwindConfig = `import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],

  darkMode: ['class', '[data-theme="dark"]'],

  theme: {
    extend: {
      colors: {
        glass: {
          DEFAULT: 'var(--glass-surface)',
          raised: 'var(--glass-raised)',
          overlay: 'var(--glass-overlay)',
          subtle: 'var(--glass-subtle)',
          border: 'var(--glass-border)',
          'border-strong': 'var(--glass-border-strong)',
          glow: 'var(--glass-glow)',
        },
        surface: {
          DEFAULT: 'var(--surface-raised)',
          base: 'var(--surface-base)',
          overlay: 'var(--surface-overlay)',
          sunken: 'var(--surface-sunken)',
          page: 'var(--page-bg)',
          soft: 'var(--surface-soft)',
        },
        txt: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          disabled: 'var(--text-disabled)',
          inverse: 'var(--text-inverse)',
          link: 'var(--text-link)',
        },
        border: {
          DEFAULT: 'var(--border-default)',
          strong: 'var(--border-strong)',
          focus: 'var(--border-focus)',
          light: 'var(--border-light)',
          divider: 'var(--border-divider)',
        },
        brand: {
          DEFAULT: 'var(--brand)',
          hover: 'var(--brand-hover)',
          subtle: 'var(--brand-subtle)',
          muted: 'var(--brand-muted)',
          glow: 'var(--brand-glow)',
        },
        success: {
          DEFAULT: 'var(--success)',
          subtle: 'var(--success-subtle)',
          text: 'var(--success-text)',
        },
        error: {
          DEFAULT: 'var(--error)',
          subtle: 'var(--error-subtle)',
          text: 'var(--error-text)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          subtle: 'var(--warning-subtle)',
          text: 'var(--warning-text)',
        },
        status: {
          success: {
            DEFAULT: 'var(--status-success)',
            bg: 'var(--status-success-bg)',
            text: 'var(--status-success-text)',
          },
          error: {
            DEFAULT: 'var(--status-error)',
            bg: 'var(--status-error-bg)',
            text: 'var(--status-error-text)',
          },
          info: {
            DEFAULT: 'var(--status-info)',
            bg: 'var(--status-info-bg)',
            text: 'var(--status-info-text)',
          },
          warning: {
            DEFAULT: 'var(--status-warning)',
            bg: 'var(--status-warning-bg)',
            text: 'var(--status-warning-text)',
          },
        },
      },

      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', '"Fira Code"', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        xs:   ['0.75rem',  { lineHeight: '1rem' }],
        sm:   ['0.8125rem',{ lineHeight: '1.25rem' }],
        base: ['0.875rem', { lineHeight: '1.375rem' }],
        md:   ['0.9375rem',{ lineHeight: '1.5rem' }],
        lg:   ['1rem',     { lineHeight: '1.5rem' }],
        xl:   ['1.125rem', { lineHeight: '1.75rem' }],
        '2xl':['1.25rem',  { lineHeight: '1.75rem' }],
        '3xl':['1.5rem',   { lineHeight: '2rem' }],
        '4xl':['1.875rem', { lineHeight: '2.25rem' }],
        '5xl':['2.25rem',  { lineHeight: '2.5rem' }],
      },

      borderRadius: {
        none: '0',
        xs:   '0.125rem',
        sm:   '0.25rem',
        md:   '0.375rem',
        lg:   '0.5rem',
        xl:   '0.75rem',
        '2xl':'1rem',
        '3xl':'1.5rem',
        pill: '9999px',
      },

      boxShadow: {
        xs: '0 1px 2px rgba(0,0,0,0.05)',
        sm: '0 1px 3px rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)',
        md: '0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10)',
        lg: '0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)',
        xl: '0 20px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.10)',
        'glass-xs': '0 1px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glass-sm': '0 4px 16px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.09)',
        'glass-md': '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)',
        'glass-lg': '0 16px 48px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.15)',
        'glow-brand':   '0 0 20px var(--brand-glow), 0 0 40px var(--brand-glow)',
        'glow-success': '0 0 20px rgba(34,197,94,0.35), 0 0 40px rgba(34,197,94,0.15)',
        'glow-error':   '0 0 20px rgba(239,68,68,0.35), 0 0 40px rgba(239,68,68,0.15)',
        card:           '0 1px 3px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card-hover':   '0 8px 24px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.08)',
        dropdown:       '0 16px 48px rgba(0,0,0,0.60), 0 4px 16px rgba(0,0,0,0.30)',
        'tab-active':   '0 2px 12px var(--brand-glow)',
        none: 'none',
      },

      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
        '22':  '5.5rem',
        '30':  '7.5rem',
        '55':  '13.75rem',
        '60':  '15rem',
      },

      width: {
        sidebar: '64px',
        'sidebar-expanded': '240px',
        content: '1280px',
      },
      height: {
        header:  '56px',
        topbar:  '56px',
        'table-row': '52px',
      },
      maxWidth: {
        content: '1280px',
      },

      transitionDuration: {
        fast:   '100ms',
        base:   '200ms',
        slow:   '300ms',
        spring: '500ms',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.30, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        glass:  'cubic-bezier(0.40, 0, 0.20, 1)',
      },

      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%':   { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },

      animation: {
        'fade-in':    'fade-in 250ms cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-in-up': 'fade-in-up 350ms cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-in':   'slide-in 250ms cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in':   'scale-in 180ms cubic-bezier(0.34,1.56,0.64,1) forwards',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        shimmer:      'shimmer 2s linear infinite',
        float:        'float 4s ease-in-out infinite',
      },
    },
  },

  plugins: [],
};

export default config;
`;
var globalsCss = `@import 'tailwindcss';

@config "../../tailwind.config.ts";

@layer base {
  button,
  a,
  [role='button'] {
    cursor: pointer;
  }
}

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   DESIGN TOKENS  \u2014 dark theme default
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500*/

:root {
  --page-bg: #09090b;

  /* \u2500\u2500 Surfaces \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  --surface-base:    #0f0f13;
  --surface-raised:  #18181b;
  --surface-overlay: #27272a;
  --surface-sunken:  #05050a;
  --surface-soft:    #141418;

  /* \u2500\u2500 Glass surfaces \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  --glass-surface:       rgba(24, 24, 27, 0.72);
  --glass-raised:        rgba(39, 39, 42, 0.90);
  --glass-overlay:       rgba(50, 50, 54, 0.98);
  --glass-subtle:        rgba(24, 24, 27, 0.50);
  --glass-border:        rgba(255, 255, 255, 0.07);
  --glass-border-strong: rgba(255, 255, 255, 0.12);
  --glass-glow:          rgba(255, 255, 255, 0.05);

  /* \u2500\u2500 Text \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  --text-primary:   #fafafa;
  --text-secondary: #a1a1aa;
  --text-tertiary:  #52525b;
  --text-disabled:  #3f3f46;
  --text-inverse:   #09090b;
  --text-link:      #818cf8;

  /* \u2500\u2500 Borders \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  --border-default: #27272a;
  --border-strong:  #3f3f46;
  --border-focus:   #6366f1;
  --border-light:   #18181b;
  --border-divider: #27272a;

  /* \u2500\u2500 Brand (indigo) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  --brand:        #6366f1;
  --brand-hover:  #4f46e5;
  --brand-subtle: rgba(99, 102, 241, 0.12);
  --brand-muted:  rgba(99, 102, 241, 0.20);
  --brand-glow:   rgba(99, 102, 241, 0.35);

  /* \u2500\u2500 Semantic status \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  --success:        #22c55e;
  --success-subtle: rgba(34, 197, 94, 0.12);
  --success-text:   #4ade80;

  --error:          #ef4444;
  --error-subtle:   rgba(239, 68, 68, 0.12);
  --error-text:     #f87171;

  --warning:        #f59e0b;
  --warning-subtle: rgba(245, 158, 11, 0.12);
  --warning-text:   #fbbf24;

  /* \u2500\u2500 Status chips \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  --status-success:       #22c55e;
  --status-success-bg:    rgba(34, 197, 94, 0.10);
  --status-success-text:  #4ade80;

  --status-error:         #ef4444;
  --status-error-bg:      rgba(239, 68, 68, 0.10);
  --status-error-text:    #f87171;

  --status-info:          #6366f1;
  --status-info-bg:       rgba(99, 102, 241, 0.10);
  --status-info-text:     #818cf8;

  --status-warning:       #f59e0b;
  --status-warning-bg:    rgba(245, 158, 11, 0.10);
  --status-warning-text:  #fbbf24;
}

/* Light theme override */
[data-theme='light'] {
  --page-bg: #fafafa;

  --surface-base:    #ffffff;
  --surface-raised:  #f4f4f5;
  --surface-overlay: #e4e4e7;
  --surface-sunken:  #f1f1f3;
  --surface-soft:    #f9f9fb;

  --glass-surface:       rgba(255, 255, 255, 0.70);
  --glass-raised:        rgba(255, 255, 255, 0.95);
  --glass-overlay:       rgba(255, 255, 255, 0.99);
  --glass-subtle:        rgba(255, 255, 255, 0.50);
  --glass-border:        rgba(0, 0, 0, 0.06);
  --glass-border-strong: rgba(0, 0, 0, 0.12);
  --glass-glow:          rgba(255, 255, 255, 0.80);

  --text-primary:   #09090b;
  --text-secondary: #52525b;
  --text-tertiary:  #a1a1aa;
  --text-disabled:  #d4d4d8;
  --text-inverse:   #fafafa;
  --text-link:      #4f46e5;

  --border-default: #e4e4e7;
  --border-strong:  #d4d4d8;
  --border-focus:   #6366f1;
  --border-light:   #f4f4f5;
  --border-divider: #e4e4e7;

  --brand:        #6366f1;
  --brand-hover:  #4f46e5;
  --brand-subtle: rgba(99, 102, 241, 0.08);
  --brand-muted:  rgba(99, 102, 241, 0.15);
  --brand-glow:   rgba(99, 102, 241, 0.25);

  --success:        #16a34a;
  --success-subtle: rgba(22, 163, 74, 0.08);
  --success-text:   #15803d;

  --error:          #dc2626;
  --error-subtle:   rgba(220, 38, 38, 0.08);
  --error-text:     #b91c1c;

  --warning:        #d97706;
  --warning-subtle: rgba(217, 119, 6, 0.08);
  --warning-text:   #b45309;

  --status-success:       #16a34a;
  --status-success-bg:    #dcfce7;
  --status-success-text:  #15803d;

  --status-error:         #dc2626;
  --status-error-bg:      #fee2e2;
  --status-error-text:    #b91c1c;

  --status-info:          #4f46e5;
  --status-info-bg:       #ede9fe;
  --status-info-text:     #4338ca;

  --status-warning:       #d97706;
  --status-warning-bg:    #fef3c7;
  --status-warning-text:  #92400e;
}

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   BASE STYLES
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500*/

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  text-rendering: optimizeLegibility;
  scroll-behavior: smooth;
}

:focus-visible {
  outline: none;
}

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   GLASS COMPOUND UTILITIES
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500*/

@layer utilities {
  .glass-panel {
    background: var(--glass-surface);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border: 1px solid var(--glass-border);
  }

  .glass-panel-raised {
    background: var(--glass-raised);
    backdrop-filter: blur(20px) saturate(200%);
    -webkit-backdrop-filter: blur(20px) saturate(200%);
    border: 1px solid var(--glass-border-strong);
  }

  .glass-panel-overlay {
    background: var(--glass-overlay);
    backdrop-filter: blur(28px) saturate(220%);
    -webkit-backdrop-filter: blur(28px) saturate(220%);
    border: 1px solid var(--glass-border-strong);
  }

  .glass-topbar {
    background: var(--glass-surface);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid var(--glass-border);
  }

  .bg-grid {
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .bg-dots {
    background-image:
      radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.06) 1px, transparent 0);
    background-size: 32px 32px;
  }

  .gradient-text {
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }

  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }

  .glow-brand {
    box-shadow: 0 0 24px var(--brand-glow), 0 0 48px var(--brand-glow);
  }
}
`;

// src/templates/app-files.ts
function rootLayout(projectName, withQueryProvider = false) {
  const title = projectName.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const providerImport = withQueryProvider ? `
import { Providers } from '@/lib/providers';` : "";
  const bodyContent = withQueryProvider ? `        <Providers>{children}</Providers>` : `        {children}`;
  return `import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';${providerImport}
import './globals.css';

export const metadata: Metadata = {
  title: { default: '${title}', template: '%s | ${title}' },
  description: 'Built with create-atom-stack \u2014 a production-ready Next.js starter.',
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
var rootPage = `import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';
import { CodeBlock } from '@/components/molecules/code-block';
import { Label } from '@/components/atoms/typography';
import { ChevronDown } from 'lucide-react';

/* \u2500\u2500\u2500 Page data \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

const QUICK_START = [
  { prompt: '$', code: 'npm run dev',   comment: '\u2192 localhost:3000' },
  { prompt: '$', code: 'npm run lint',  comment: '\u2192 ESLint check'  },
  { prompt: '$', code: 'npm test',      comment: '\u2192 Jest suite'    },
];

const PROJECT_STRUCTURE = \`src/
\u251C\u2500\u2500 app/
\u2502   \u251C\u2500\u2500 globals.css          # design tokens + base styles
\u2502   \u251C\u2500\u2500 layout.tsx           # root layout (fonts, metadata)
\u2502   \u2514\u2500\u2500 page.tsx             # \u2190 you are here
\u251C\u2500\u2500 components/
\u2502   \u251C\u2500\u2500 atoms/               # button \xB7 badge \xB7 card \xB7 input \xB7 loading
\u2502   \u251C\u2500\u2500 molecules/           # code-block \xB7 feature-card \xB7 pagination
\u2502   \u2514\u2500\u2500 organisms/           # header \xB7 footer
\u251C\u2500\u2500 store/
\u2502   \u2514\u2500\u2500 ui.store.ts          # zustand: theme, sidebar
\u251C\u2500\u2500 lib/
\u2502   \u251C\u2500\u2500 http/                # client \xB7 errors \xB7 interceptors \xB7 types
\u2502   \u2514\u2500\u2500 utils/               # cn \xB7 format
\u251C\u2500\u2500 hooks/
\u2502   \u2514\u2500\u2500 use-scroll-state.ts
\u251C\u2500\u2500 design-system/tokens/    # js mirrors of css tokens
\u2514\u2500\u2500 data/constants/
    \u2514\u2500\u2500 navigation.ts        # NAV_LINKS\`;

const ATOMIC_LAYERS = [
  {
    layer: 'atoms/',
    desc: 'Stateless primitives \u2014 no domain knowledge',
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
  { path: 'tailwind.config.ts',    desc: 'Customize the design system \u2014 colors, spacing, animations' },
  { path: 'src/app/',              desc: 'Add new routes \u2014 create a folder, drop in page.tsx'  },
  { path: 'src/components/',       desc: 'Grow the design system with new atoms and molecules'  },
  { path: 'src/store/',            desc: 'Add Zustand slices for new state concerns'            },
  { path: '.env.local',            desc: 'Set NEXT_PUBLIC_API_URL to connect your backend'     },
];

/* \u2500\u2500\u2500 Page \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-page">
      <Header />

      <main className="flex-1">

        {/* \u2500\u2500 00 \xB7 Hero \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
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
              System ready \xB7 All files generated \xB7 localhost:3000
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
              Next.js 15 \xB7 TypeScript 5 \xB7 Tailwind CSS v4 \xB7 Zustand
              <br />
              Atomic Design \xB7 ESLint \xB7 Prettier \xB7 Husky \xB7 Jest
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

        {/* \u2500\u2500 01 \xB7 Quick Start + Structure \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
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
                  Copy .env.example \u2192 .env.local before connecting a backend
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <SectionLabel index="02" title="Project Structure" />
              <CodeBlock title="src/" content={PROJECT_STRUCTURE} />
            </div>

          </div>
        </section>

        {/* \u2500\u2500 03 \xB7 Atomic Design Layers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
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

        {/* \u2500\u2500 04 \xB7 Explore Further \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
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
                    \u2192
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

/* \u2500\u2500\u2500 Helpers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

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
var docsPage = `import type { ReactNode } from 'react';
import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';
import { CodeBlock } from '@/components/molecules/code-block';

export const metadata = { title: 'Docs' };

/* \u2500\u2500\u2500 Static data \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

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
\u251C\u2500\u2500 src/
\u2502   \u251C\u2500\u2500 app/                    Next.js App Router (layout + pages)
\u2502   \u251C\u2500\u2500 components/
\u2502   \u2502   \u251C\u2500\u2500 atoms/              Primitives: button, badge, card, input, loading
\u2502   \u2502   \u251C\u2500\u2500 molecules/          Composed: code-block, feature-card, pagination
\u2502   \u2502   \u2514\u2500\u2500 organisms/          Layout: header, footer
\u2502   \u251C\u2500\u2500 store/                  Zustand slices (ui.store.ts)
\u2502   \u251C\u2500\u2500 lib/
\u2502   \u2502   \u251C\u2500\u2500 http/               Modular HTTP layer (client \xB7 errors \xB7 interceptors)
\u2502   \u2502   \u2514\u2500\u2500 utils/              cn \xB7 format helpers
\u2502   \u251C\u2500\u2500 hooks/                  use-scroll-state
\u2502   \u251C\u2500\u2500 types/                  Shared TypeScript types
\u2502   \u2514\u2500\u2500 design-system/tokens/   JS mirrors of CSS custom properties
\u251C\u2500\u2500 tailwind.config.ts          Token-driven Tailwind configuration
\u251C\u2500\u2500 jest.config.ts              Jest + Testing Library setup
\u251C\u2500\u2500 ARCHITECTURE.md             Full project documentation
\u2514\u2500\u2500 .env.example                Environment variable template\`;

const CLI_OPTIONS = [
  { flag: '<project-name>', required: true,  desc: 'Directory name for the new project (letters, numbers, hyphens)'   },
  { flag: '--skip-install', required: false, desc: 'Skip running npm install \u2014 useful for offline or CI environments' },
];

const TOKEN_GROUPS = [
  { group: '--brand-*',                    desc: 'Primary interactive color (indigo by default)'            },
  { group: '--glass-*',                    desc: 'Translucent surfaces, paired with backdrop-filter: blur'  },
  { group: '--surface-*',                  desc: 'Solid background hierarchy (page \u2192 base \u2192 raised \u2192 overlay)' },
  { group: '--text-*',                     desc: 'Text color scale: primary, secondary, tertiary, disabled' },
  { group: '--border-*',                   desc: 'Border and divider tokens'                                },
  { group: '--success / --error / --warning', desc: 'Semantic status colors with subtle and text variants'  },
];

/* \u2500\u2500\u2500 Page \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

export default function DocsPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-page">
      <Header />

      <main className="flex-1 px-4 py-16">
        <div className="mx-auto max-w-3xl">

          {/* \u2500\u2500 Page header \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
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
              Tailwind CSS v4, Zustand, and full DX tooling \u2014 ready in seconds.
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

          {/* \u2500\u2500 Introduction \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
          <DocSection id="introduction" title="Introduction">
            <p className="text-txt-secondary leading-relaxed">
              <strong className="font-medium text-txt-primary">create-atom-stack</strong> is an
              open-source CLI that generates a complete Next.js 15 project in one command. It
              bundles atomic design principles, a token-driven Tailwind CSS v4 design system,
              Zustand state management, and production-grade DX tooling \u2014 all wired up and ready
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

          {/* \u2500\u2500 Installation \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
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
                    Git \u2014 optional, required for Husky hook setup
                  </li>
                </ul>
              </div>
            </div>
          </DocSection>

          {/* \u2500\u2500 CLI Options \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
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

          {/* \u2500\u2500 Project Structure \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
          <DocSection id="structure" title="Project Structure">
            <p className="mb-5 text-txt-secondary leading-relaxed">
              The generated project follows{' '}
              <strong className="font-medium text-txt-primary">atomic design</strong>: UI is
              organised into atoms (primitives), molecules (composed atoms), and organisms
              (layout-level components). Each layer has a clear scope \u2014 atoms know nothing about
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

          {/* \u2500\u2500 Design System \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
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
              . Dark mode is the default \u2014 switching themes sets a{' '}
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
                this for you \u2014 call <code className="font-mono text-brand">toggleTheme()</code>{' '}
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

/* \u2500\u2500\u2500 Helpers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

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

// src/templates/atoms.ts
var buttonAtom = `import { cn } from '@/lib/utils/cn';
import type { ButtonHTMLAttributes, ElementType, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
export type ButtonSize    = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  as?: ElementType;
  children: ReactNode;
  [key: string]: unknown;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:   'bg-brand text-white hover:bg-brand-hover disabled:bg-brand/40',
  secondary: 'bg-glass border border-border text-txt-primary hover:bg-glass-raised',
  ghost:     'bg-transparent text-txt-secondary hover:bg-glass hover:text-txt-primary',
  danger:    'bg-error-subtle text-error-text border border-error/20 hover:bg-error/20',
  glass:     'glass-panel text-txt-primary hover:glass-panel-raised',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'h-6  px-2   text-xs  gap-1   rounded-md',
  sm: 'h-7  px-2.5 text-xs  gap-1.5 rounded-md',
  md: 'h-8  px-3   text-sm  gap-2   rounded-lg',
  lg: 'h-10 px-4   text-sm  gap-2   rounded-lg',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  as: Tag = 'button',
  ...props
}: ButtonProps) {
  return (
    <Tag
      disabled={Tag === 'button' ? (disabled || loading) : undefined}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-base',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <svg
          className="size-3.5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </Tag>
  );
}
`;
var badgeAtom = `import { cn } from '@/lib/utils/cn';
import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'brand' | 'neutral' | 'info';
export type BadgeSize    = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success-subtle  text-success-text  border-success/20',
  error:   'bg-error-subtle    text-error-text    border-error/20',
  warning: 'bg-warning-subtle  text-warning-text  border-warning/20',
  brand:   'bg-brand-subtle    text-brand         border-brand/20',
  neutral: 'bg-glass           text-txt-secondary border-border',
  info:    'bg-status-info-bg  text-status-info-text border-status-info/20',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-2xs',
  md: 'px-2   py-0.5 text-xs',
};

export function Badge({
  variant = 'neutral',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-pill border font-medium',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
`;
var cardAtom = `import { cn } from '@/lib/utils/cn';
import type { HTMLAttributes, ReactNode } from 'react';

type CardVariant = 'solid' | 'glass' | 'glass-raised';
type CardPadding  = 'none' | 'sm' | 'md' | 'lg';
type CardShadow   = 'none' | 'xs' | 'sm' | 'md' | 'glass-xs' | 'glass-sm' | 'glass-md' | 'glass-lg';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  shadow?: CardShadow;
}

const variantStyles: Record<CardVariant, string> = {
  solid:         'bg-surface border border-border',
  glass:         'glass-panel',
  'glass-raised':'glass-panel-raised',
};

const paddingStyles: Record<CardPadding, string> = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-6',
};

const shadowStyles: Record<CardShadow, string> = {
  none:       '',
  xs:         'shadow-xs',
  sm:         'shadow-sm',
  md:         'shadow-md',
  'glass-xs': 'shadow-glass-xs',
  'glass-sm': 'shadow-glass-sm',
  'glass-md': 'shadow-glass-md',
  'glass-lg': 'shadow-glass-lg',
};

export function Card({
  variant = 'solid',
  padding = 'md',
  shadow = 'glass-xs',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl',
        variantStyles[variant],
        paddingStyles[padding],
        shadowStyles[shadow],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between border-b border-border px-4 py-3', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-end gap-2 border-t border-border px-4 py-3', className)}
      {...props}
    >
      {children}
    </div>
  );
}
`;
var inputAtom = `import { cn } from '@/lib/utils/cn';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: React.ReactNode;
  error?: string;
}

export function Input({ leadingIcon, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="relative flex items-center">
        {leadingIcon && (
          <span className="pointer-events-none absolute left-3 flex size-4 items-center text-txt-tertiary">
            {leadingIcon}
          </span>
        )}
        <input
          className={cn(
            'h-9 w-full rounded-lg border bg-glass px-3 text-sm text-txt-primary',
            'placeholder:text-txt-tertiary',
            'transition-colors duration-fast',
            error
              ? 'border-error focus:border-error focus:ring-error/20'
              : 'border-border hover:border-border-strong focus:border-border-focus focus:ring-brand/20',
            'focus:outline-none focus:ring-2',
            leadingIcon && 'pl-9',
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-error-text">{error}</p>}
    </div>
  );
}
`;
var loadingAtom = `import { cn } from '@/lib/utils/cn';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'size-4 border-2',
  md: 'size-8 border-2',
  lg: 'size-12 border-[3px]',
};

export function Loading({ size = 'md', className, label }: LoadingProps) {
  return (
    <div role="status" className={cn('inline-flex flex-col items-center gap-2', className)}>
      <span className="sr-only">{label ?? 'Loading'}</span>
      <span
        className={cn(
          'rounded-full border-brand/20 border-t-brand animate-spin',
          sizeStyles[size],
        )}
        aria-hidden="true"
      />
      {label && (
        <span className="text-xs font-medium text-txt-secondary" aria-hidden="true">
          {label}
        </span>
      )}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex h-full min-h-[200px] w-full items-center justify-center">
      <Loading size="lg" label="Loading..." />
    </div>
  );
}
`;
var typographyAtom = `import { cn } from '@/lib/utils/cn';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';

interface TextProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  secondary?: boolean;
  tertiary?: boolean;
  as?: ElementType;
}

/* \u2500\u2500 Heading \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

interface HeadingProps extends Omit<TextProps, 'as'> {
  level?: 1 | 2 | 3 | 4;
}

const headingStyles: Record<NonNullable<HeadingProps['level']>, string> = {
  1: 'text-2xl font-semibold tracking-tight leading-tight',
  2: 'text-lg  font-medium  leading-6',
  3: 'text-base font-medium leading-6',
  4: 'text-sm  font-medium  leading-5',
};

export function Heading({ level = 1, secondary, tertiary, className, children, ...props }: HeadingProps) {
  const Tag = ('h' + level) as ElementType;
  return (
    <Tag
      className={cn(
        headingStyles[level],
        secondary ? 'text-txt-secondary' : tertiary ? 'text-txt-tertiary' : 'text-txt-primary',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* \u2500\u2500 Body \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

interface BodyProps extends TextProps {
  size?: 'lg' | 'md' | 'sm';
}

const bodyStyles: Record<NonNullable<BodyProps['size']>, string> = {
  lg: 'text-md leading-relaxed',
  md: 'text-base leading-normal',
  sm: 'text-xs  leading-normal',
};

export function Body({ size = 'md', secondary, tertiary, as: Tag = 'p', className, children, ...props }: BodyProps) {
  return (
    <Tag
      className={cn(
        bodyStyles[size],
        secondary ? 'text-txt-secondary' : tertiary ? 'text-txt-tertiary' : 'text-txt-primary',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* \u2500\u2500 Label \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

export function Label({ tertiary, className, children, as: Tag = 'span', ...props }: TextProps) {
  return (
    <Tag
      className={cn(
        'text-xs font-medium uppercase tracking-wider',
        tertiary ? 'text-txt-tertiary' : 'text-txt-secondary',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* \u2500\u2500 Caption \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

export function Caption({ tertiary, className, children, as: Tag = 'span', ...props }: TextProps) {
  return (
    <Tag
      className={cn(
        'text-2xs leading-normal',
        tertiary ? 'text-txt-tertiary' : 'text-txt-secondary',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
`;

// src/templates/molecules.ts
var codeBlockMolecule = `import { cn } from '@/lib/utils/cn';

interface TerminalLine {
  prompt?: string;
  code: string;
  comment?: string;
}

interface CodeBlockProps {
  title?: string;
  /** Terminal-style command lines */
  lines?: TerminalLine[];
  /** Preformatted text (file trees, output, etc.) */
  content?: string;
  className?: string;
}

export function CodeBlock({ title, lines, content, className }: CodeBlockProps) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-border shadow-glass-sm', className)}>
      {/* Title bar */}
      {title && (
        <div className="flex items-center gap-3 border-b border-border bg-surface-overlay px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-error/50" />
            <span className="size-2.5 rounded-full bg-warning/50" />
            <span className="size-2.5 rounded-full bg-success/50" />
          </div>
          <span className="font-mono text-xs text-txt-tertiary">{title}</span>
        </div>
      )}

      {/* Content */}
      <div className="bg-surface-sunken p-5">
        {content ? (
          <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-txt-secondary">
            {content}
          </pre>
        ) : lines ? (
          <div className="flex flex-col gap-3">
            {lines.map((line, i) => (
              <div key={i} className="flex items-start gap-2 font-mono text-sm">
                {line.prompt !== undefined && (
                  <span className="shrink-0 select-none text-success">{line.prompt}</span>
                )}
                <span className="text-txt-primary">{line.code}</span>
                {line.comment && (
                  <span className="ml-auto shrink-0 text-txt-tertiary">{line.comment}</span>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
`;
var featureCardMolecule = `import { cn } from '@/lib/utils/cn';
import { Card } from '@/components/atoms/card';
import { Heading, Body } from '@/components/atoms/typography';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <Card
      variant="glass"
      padding="md"
      shadow="glass-sm"
      className={cn(
        'flex flex-col gap-3 transition-all duration-base',
        'hover:shadow-glass-md hover:border-brand/20',
        className,
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-xl bg-brand-subtle border border-brand/20 text-xl">
        {icon}
      </div>
      <div>
        <Heading level={3} className="text-sm font-semibold">
          {title}
        </Heading>
        <Body size="sm" secondary className="mt-1 leading-relaxed">
          {description}
        </Body>
      </div>
    </Card>
  );
}
`;
var paginationMolecule = `import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { cn } from '@/lib/utils/cn';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, pageSize, total, onPageChange, className }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to   = Math.min(page * pageSize, total);

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <span className="text-xs text-txt-secondary">
        {from}\u2013{to} of {total}
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="min-w-[4rem] text-center text-xs text-txt-secondary">
          {page} / {totalPages}
        </span>
        <Button
          variant="ghost"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
`;

// src/templates/organisms.ts
var headerOrganism = `'use client';

import Link from 'next/link';
import { Moon, Sun, Github } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { useUiStore } from '@/store/ui.store';
import { useScrollState } from '@/hooks/use-scroll-state';
import { NAV_LINKS } from '@/data/constants/navigation';
import { cn } from '@/lib/utils/cn';

export function Header() {
  const { theme, toggleTheme } = useUiStore();
  const scrolled = useScrollState();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex h-14 items-center justify-between px-4 sm:px-6',
        'transition-all duration-base',
        scrolled
          ? 'glass-topbar border-b border-border shadow-glass-xs'
          : 'bg-transparent',
      )}
    >
      {/* Logo */}
      <Link href="/" className="group flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-lg border border-brand/20 bg-brand-subtle transition-colors duration-base group-hover:bg-brand-muted">
          <span className="text-xs font-bold text-brand">A</span>
        </div>
        <span className="hidden text-sm font-semibold text-txt-primary sm:block">
          create-atom-stack
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-0.5">
        {NAV_LINKS.map((link) =>
          link.label === 'GitHub' ? (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-txt-secondary transition-colors duration-base hover:bg-glass hover:text-txt-primary"
            >
              <Github className="size-4 shrink-0" />
              <span className="hidden sm:block">GitHub</span>
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className="group relative hidden px-3 py-1.5 text-sm text-txt-secondary transition-colors duration-base hover:text-txt-primary sm:block"
            >
              {link.label}
              {/* Slide-in underline */}
              <span className="absolute bottom-0.5 left-3 right-3 h-px origin-left scale-x-0 bg-brand/50 transition-transform duration-base group-hover:scale-x-100" />
            </Link>
          ),
        )}

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="ml-1"
        >
          {theme === 'dark' ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>
      </nav>
    </header>
  );
}
`;
var footerOrganism = `import Link from 'next/link';
import { Github } from 'lucide-react';
import { NAV_LINKS } from '@/data/constants/navigation';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md border border-brand/20 bg-brand-subtle">
            <span className="text-xs font-bold text-brand">A</span>
          </div>
          <span className="text-sm font-semibold text-txt-primary">create-atom-stack</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-5">
          {NAV_LINKS.map((link) =>
            link.label === 'GitHub' ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
                className="flex items-center gap-1.5 text-sm text-txt-tertiary transition-colors duration-base hover:text-txt-primary"
              >
                <Github className="size-3.5" />
                <span>GitHub</span>
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-txt-tertiary transition-colors duration-base hover:text-txt-primary"
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        {/* Legal */}
        <p className="text-xs text-txt-tertiary">
          \xA9 {year} create-atom-stack \xB7 MIT License
        </p>
      </div>
    </footer>
  );
}
`;

// src/templates/design-tokens.ts
var colorsToken = `function token(variable: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

export const glass = {
  surface:      () => token('--glass-surface'),
  raised:       () => token('--glass-raised'),
  overlay:      () => token('--glass-overlay'),
  subtle:       () => token('--glass-subtle'),
  border:       () => token('--glass-border'),
  borderStrong: () => token('--glass-border-strong'),
} as const;

export const surface = {
  base:    () => token('--surface-base'),
  raised:  () => token('--surface-raised'),
  overlay: () => token('--surface-overlay'),
  sunken:  () => token('--surface-sunken'),
  page:    () => token('--page-bg'),
} as const;

export const text = {
  primary:   () => token('--text-primary'),
  secondary: () => token('--text-secondary'),
  tertiary:  () => token('--text-tertiary'),
  disabled:  () => token('--text-disabled'),
  inverse:   () => token('--text-inverse'),
} as const;

export const brand = {
  DEFAULT: () => token('--brand'),
  hover:   () => token('--brand-hover'),
  subtle:  () => token('--brand-subtle'),
  muted:   () => token('--brand-muted'),
  glow:    () => token('--brand-glow'),
} as const;

export const semantic = {
  success: () => token('--success'),
  error:   () => token('--error'),
  warning: () => token('--warning'),
} as const;
`;
var typographyToken = `export const fontFamily = {
  sans: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  mono: "var(--font-geist-mono), ui-monospace, 'Fira Code', monospace",
} as const;

export const fontSize = {
  '2xs': ['0.625rem',  '1rem']      as const,
  xs:    ['0.75rem',   '1rem']      as const,
  sm:    ['0.8125rem', '1.25rem']   as const,
  base:  ['0.875rem',  '1.375rem']  as const,
  md:    ['0.9375rem', '1.5rem']    as const,
  lg:    ['1rem',      '1.5rem']    as const,
  xl:    ['1.125rem',  '1.75rem']   as const,
  '2xl': ['1.25rem',   '1.75rem']   as const,
  '3xl': ['1.5rem',    '2rem']      as const,
  '4xl': ['1.875rem',  '2.25rem']   as const,
  '5xl': ['2.25rem',   '2.5rem']    as const,
} as const;

export const fontWeight = {
  normal:   '400',
  medium:   '500',
  semibold: '600',
  bold:     '700',
} as const;
`;
var spacingToken = `export const spacing = {
  '4.5': '1.125rem',
  '13':  '3.25rem',
  '15':  '3.75rem',
  '18':  '4.5rem',
  '22':  '5.5rem',
  '30':  '7.5rem',
  '55':  '13.75rem',
  '60':  '15rem',
} as const;

export const layout = {
  sidebar:         '64px',
  sidebarExpanded: '240px',
  header:          '56px',
  maxContent:      '1280px',
} as const;
`;
var radiusToken = `export const radius = {
  none:  '0',
  xs:    '0.125rem',
  sm:    '0.25rem',
  md:    '0.375rem',
  lg:    '0.5rem',
  xl:    '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  pill:  '9999px',
} as const;
`;
var shadowsToken = `export const shadow = {
  xs: '0 1px 2px rgba(0,0,0,0.05)',
  sm: '0 1px 3px rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)',
  md: '0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10)',
  lg: '0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)',
  xl: '0 20px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.10)',
} as const;

export const glassShadow = {
  xs: '0 1px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
  sm: '0 4px 16px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.09)',
  md: '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)',
  lg: '0 16px 48px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.15)',
} as const;

export const glow = {
  brand:   '0 0 20px rgba(99,102,241,0.40), 0 0 40px rgba(99,102,241,0.15)',
  success: '0 0 20px rgba(34,197,94,0.35),  0 0 40px rgba(34,197,94,0.15)',
  error:   '0 0 20px rgba(239,68,68,0.35),  0 0 40px rgba(239,68,68,0.15)',
} as const;
`;

// src/templates/state-and-utils.ts
var uiStoreStandalone = `'use client';

import { useState, useCallback, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useUiStore() {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ui-theme') as Theme | null;
    const initial: Theme = stored ?? 'dark';
    setThemeState(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem('ui-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  }, []);

  const toggleTheme = useCallback(
    () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    [theme, setTheme],
  );

  const toggleSidebar = useCallback(() => setSidebarOpen((o) => !o), []);

  return { theme, sidebarOpen, setTheme, toggleTheme, toggleSidebar };
}
`;
var jotaiStore = `import { atom } from 'jotai';

type Theme = 'light' | 'dark';

export const themeAtom = atom<Theme>('dark');
export const sidebarOpenAtom = atom<boolean>(true);
`;
var uiStore = `import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface UiState {
  theme: Theme;
  sidebarOpen: boolean;
}

interface UiActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState & UiActions>()((set) => ({
  theme: 'dark',
  sidebarOpen: true,

  setTheme: (theme) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    set({ theme });
  },

  toggleTheme: () =>
    set((state) => {
      const next: Theme = state.theme === 'dark' ? 'light' : 'dark';
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', next);
      }
      return { theme: next };
    }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
`;
var commonTypes = `export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: ApiError };

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  column: string;
  direction: SortDirection;
}

export type ID = string | number;
`;
var typesIndex = `export * from './common';
`;
var cnUtil = `export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
`;
var formatUtil = `const NUMBER_FORMATTER = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const COMPACT_FORMATTER = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const PERCENT_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric', month: 'short', day: '2-digit',
});

const DATETIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric', month: 'short', day: '2-digit',
  hour: '2-digit', minute: '2-digit',
});

export function formatNumber(value: number): string {
  return NUMBER_FORMATTER.format(value);
}

export function formatCompact(value: number): string {
  return COMPACT_FORMATTER.format(value);
}

export function formatPercent(value: number): string {
  return PERCENT_FORMATTER.format(value / 100);
}

export function formatDate(date: Date | string): string {
  return DATE_FORMATTER.format(new Date(date));
}

export function formatDatetime(date: Date | string): string {
  return DATETIME_FORMATTER.format(new Date(date));
}
`;
var httpTypes = `export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: QueryParams;
  timeout?: number;
  body?: unknown;
}

export interface ApiErrorPayload {
  message?: string;
  code?: string;
  details?: unknown;
}

export interface RequestConfig {
  url: string;
  init: RequestInit;
}

export type RequestInterceptor  = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
export type ResponseInterceptor = (response: Response) => Response | Promise<Response>;
`;
var httpErrors = `import type { ApiErrorPayload } from './types';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | undefined;
  readonly details: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export async function parseApiError(res: Response): Promise<ApiError> {
  const payload = await res.json().catch((): ApiErrorPayload => ({}));
  return new ApiError(
    payload.message ?? res.statusText,
    res.status,
    payload.code,
    payload.details,
  );
}
`;
var httpInterceptors = `import type { RequestConfig, RequestInterceptor, ResponseInterceptor } from './types';

const requestInterceptors: RequestInterceptor[]  = [];
const responseInterceptors: ResponseInterceptor[] = [];

export function registerRequestInterceptor(fn: RequestInterceptor): () => void {
  requestInterceptors.push(fn);
  return () => {
    const i = requestInterceptors.indexOf(fn);
    if (i !== -1) requestInterceptors.splice(i, 1);
  };
}

export function registerResponseInterceptor(fn: ResponseInterceptor): () => void {
  responseInterceptors.push(fn);
  return () => {
    const i = responseInterceptors.indexOf(fn);
    if (i !== -1) responseInterceptors.splice(i, 1);
  };
}

export async function applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
  let current = config;
  for (const fn of requestInterceptors) current = await fn(current);
  return current;
}

export async function applyResponseInterceptors(response: Response): Promise<Response> {
  let current = response;
  for (const fn of responseInterceptors) current = await fn(current);
  return current;
}

/* \u2500\u2500 Auth token injection \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

let authToken: string | null = null;

/** Inject a bearer token into every outgoing request. Call with null to clear. */
export function setAuthToken(token: string | null): void {
  authToken = token;
}

registerRequestInterceptor((config) => {
  if (!authToken) return config;
  const headers = new Headers(config.init.headers);
  headers.set('Authorization', \`Bearer \${authToken}\`);
  return { ...config, init: { ...config.init, headers } };
});
`;
var httpClient = `import type { RequestOptions, RequestConfig } from './types';
import { parseApiError } from './errors';
import { applyRequestInterceptors, applyResponseInterceptors } from './interceptors';

// SSR-safe: server components need an absolute URL; browser can use relative paths.
const BASE_URL =
  typeof window === 'undefined'
    ? (process.env.API_URL ?? 'http://localhost:3000')
    : (process.env.NEXT_PUBLIC_API_URL ?? '');

function buildUrl(path: string, params?: RequestOptions['params']): string {
  if (!params) return BASE_URL + path;
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== null && v !== undefined) qs.append(k, String(v));
  }
  const query = qs.toString();
  return query ? \`\${BASE_URL}\${path}?\${query}\` : BASE_URL + path;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, timeout, body, headers, ...init } = options;

  // Skip Content-Type for FormData \u2014 browser sets multipart/form-data + boundary automatically.
  const resolvedHeaders: Record<string, string> = {};
  if (body !== undefined && !(body instanceof FormData)) {
    resolvedHeaders['Content-Type'] = 'application/json';
  }
  if (headers) Object.assign(resolvedHeaders, headers as Record<string, string>);

  const controller = new AbortController();
  const timer = timeout ? setTimeout(() => controller.abort(), timeout) : null;

  let config: RequestConfig = {
    url: buildUrl(path, params),
    init: {
      ...init,
      headers: resolvedHeaders,
      body: body instanceof FormData
        ? body
        : body !== undefined
          ? JSON.stringify(body)
          : undefined,
      signal: controller.signal,
    },
  };

  try {
    config = await applyRequestInterceptors(config);
    let response = await fetch(config.url, config.init);
    response = await applyResponseInterceptors(response);

    if (!response.ok) throw await parseApiError(response);

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  } finally {
    if (timer !== null) clearTimeout(timer);
  }
}

export const http = {
  get:    <T>(path: string, opts?: Omit<RequestOptions, 'body'>) =>
    request<T>(path, { method: 'GET', ...opts }),

  post:   <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { method: 'POST', body, ...opts }),

  put:    <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { method: 'PUT', body, ...opts }),

  patch:  <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { method: 'PATCH', body, ...opts }),

  delete: <T>(path: string, opts?: Omit<RequestOptions, 'body'>) =>
    request<T>(path, { method: 'DELETE', ...opts }),
};
`;
var httpIndex = `export { http } from './client';
export { ApiError, isApiError } from './errors';
export { registerRequestInterceptor, registerResponseInterceptor, setAuthToken } from './interceptors';
export type {
  RequestOptions,
  QueryParams,
  ApiErrorPayload,
  RequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
} from './types';
`;
var reactQueryProviders = `'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, retry: 1 },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
`;
var usePostsQuery = `import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

interface Post {
  id: number;
  title: string;
  body: string;
}

export function usePosts() {
  return useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn:  () => http.get<Post[]>('/posts'),
  });
}
`;
var useScrollState = `'use client';

import { useEffect, useState } from 'react';

export function useScrollState(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
`;
var navigationConstants = `export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Docs',   href: '/docs' },
  { label: 'GitHub', href: 'https://github.com/hakizimana-fred/create-atom-stack', external: true },
];
`;

// src/templates/docs.ts
var B1 = "`";
var B3 = B1.repeat(3);
function architectureMd(projectName) {
  return `# Architecture \u2014 ${projectName}

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
\u251C\u2500\u2500 app/                         # Next.js App Router
\u2502   \u251C\u2500\u2500 layout.tsx               # Root layout (fonts, metadata, dark theme)
\u2502   \u251C\u2500\u2500 globals.css              # Design token variables + base styles
\u2502   \u2514\u2500\u2500 page.tsx                 # Landing homepage
\u2502
\u251C\u2500\u2500 components/                  # Atomic Design System
\u2502   \u251C\u2500\u2500 atoms/                   # Stateless primitives
\u2502   \u2502   \u251C\u2500\u2500 badge/
\u2502   \u2502   \u251C\u2500\u2500 button/
\u2502   \u2502   \u251C\u2500\u2500 card/
\u2502   \u2502   \u251C\u2500\u2500 input/
\u2502   \u2502   \u251C\u2500\u2500 loading/
\u2502   \u2502   \u2514\u2500\u2500 typography/
\u2502   \u251C\u2500\u2500 molecules/               # Composed atoms
\u2502   \u2502   \u251C\u2500\u2500 code-block/
\u2502   \u2502   \u251C\u2500\u2500 feature-card/
\u2502   \u2502   \u2514\u2500\u2500 pagination/
\u2502   \u2514\u2500\u2500 organisms/               # Layout-level components
\u2502       \u251C\u2500\u2500 header/
\u2502       \u2514\u2500\u2500 footer/
\u2502
\u251C\u2500\u2500 store/                       # Zustand stores (one per concern)
\u2502   \u2514\u2500\u2500 ui.store.ts
\u2502
\u251C\u2500\u2500 types/                       # TypeScript definitions
\u2502   \u251C\u2500\u2500 common.ts
\u2502   \u2514\u2500\u2500 index.ts
\u2502
\u251C\u2500\u2500 data/
\u2502   \u2514\u2500\u2500 constants/
\u2502       \u2514\u2500\u2500 navigation.ts        # NAV_LINKS array
\u2502
\u251C\u2500\u2500 design-system/
\u2502   \u2514\u2500\u2500 tokens/                  # JS mirrors of CSS tokens
\u2502       \u251C\u2500\u2500 colors.ts
\u2502       \u251C\u2500\u2500 radius.ts
\u2502       \u251C\u2500\u2500 shadows.ts
\u2502       \u251C\u2500\u2500 spacing.ts
\u2502       \u2514\u2500\u2500 typography.ts
\u2502
\u251C\u2500\u2500 lib/
\u2502   \u251C\u2500\u2500 api/
\u2502   \u2502   \u2514\u2500\u2500 client.ts            # Fetch wrapper (get/post/put/patch/delete)
\u2502   \u2514\u2500\u2500 utils/
\u2502       \u251C\u2500\u2500 cn.ts                # Class name merger
\u2502       \u2514\u2500\u2500 format.ts            # Number, percent, date formatters
\u2502
\u2514\u2500\u2500 hooks/
    \u2514\u2500\u2500 use-scroll-state.ts      # Tracks window scroll offset
${B3}

---

## Component Architecture

### Atoms \u2014 ${B1}src/components/atoms/${B1}
Self-contained, stateless primitives. No domain knowledge.

| Component | Purpose |
|---|---|
| ${B1}Button${B1} | 5 variants, 4 sizes, loading state, polymorphic ${B1}as${B1} prop |
| ${B1}Card${B1} | Surface container (solid, glass, glass-raised) |
| ${B1}Badge${B1} | Status chips (success, error, warning, brand, neutral, info) |
| ${B1}Input${B1} | Text field with optional leading icon + error state |
| ${B1}Typography${B1} | Heading, Body, Label, Caption |
| ${B1}Loading${B1} | CSS spinner with size + label variants |

### Molecules \u2014 ${B1}src/components/molecules/${B1}
Combinations of atoms serving a single interaction pattern.

| Component | Purpose |
|---|---|
| ${B1}CodeBlock${B1} | Terminal-style or preformatted code/tree display |
| ${B1}FeatureCard${B1} | Icon + title + description card for showcasing features |
| ${B1}Pagination${B1} | Previous/next controls with page counter |

### Organisms \u2014 ${B1}src/components/organisms/${B1}
Layout-level components that compose atoms and molecules.

| Component | Purpose |
|---|---|
| ${B1}Header${B1} | Sticky navigation bar with logo, links, theme toggle |
| ${B1}Footer${B1} | Site footer with brand and navigation links |

---

## Theme System

Dark mode is the default. The theme is controlled via ${B1}data-theme${B1} on ${B1}<html>${B1}
\u2014 no ${B1}dark:${B1} Tailwind variants needed.

${B3}typescript
// Toggle theme (already wired in Header via useUiStore)
document.documentElement.setAttribute('data-theme', 'light');
${B3}

All design decisions are CSS custom properties in ${B1}src/app/globals.css${B1}:

- ${B1}--glass-*${B1} \u2014 Translucent surfaces with backdrop blur
- ${B1}--surface-*${B1} \u2014 Solid backgrounds
- ${B1}--text-*${B1} \u2014 Text colors (${B1}text-txt-primary${B1}, ${B1}text-txt-secondary${B1}, etc.)
- ${B1}--border-*${B1} \u2014 Border colors
- ${B1}--brand-*${B1} \u2014 Primary interactive color (indigo)
- ${B1}--success / --error / --warning${B1} \u2014 Semantic status colors

---

## State Management

Zustand stores are small and focused. One store per concern.

${B3}typescript
import { useUiStore } from '@/store/ui.store';

const { theme, toggleTheme } = useUiStore();
${B3}

Add new stores at ${B1}src/store/<feature>.store.ts${B1}.

---

## HTTP Layer

A modular HTTP infrastructure at ${B1}src/lib/http/${B1}:

${B3}typescript
import { http, ApiError, isApiError, setAuthToken } from '@/lib/http';

// GET with query params
const users = await http.get<User[]>('/users', { params: { page: 1 } });

// POST / PATCH / DELETE
const user   = await http.post<User>('/users', { name: 'Alice' });
const updated = await http.patch<User>('/users/1', { name: 'Bob' });
await http.delete('/users/1');

// Typed error handling
try {
  await http.get('/protected');
} catch (err) {
  if (isApiError(err)) console.error(err.status, err.code);
}

// Auth token injection (client-side)
setAuthToken(localStorage.getItem('token'));

// Timeout support
await http.get('/slow', { timeout: 5000 });

// FormData (multipart \u2014 Content-Type set automatically)
const form = new FormData();
form.append('file', file);
await http.post('/upload', form);
${B3}

Set ${B1}NEXT_PUBLIC_API_URL${B1} in ${B1}.env.local${B1} to point at your backend. Server components use ${B1}API_URL${B1}.

---

## Routing

Next.js App Router. Add new routes by creating folders under ${B1}src/app${B1}.

${B3}
/          \u2192 src/app/page.tsx    (landing page)
/about     \u2192 src/app/about/page.tsx
${B3}

**Server vs Client:** Pages/layouts are Server Components by default.
Interactive components opt in with ${B1}'use client'${B1}.

---

## Path Aliases

${B1}@/*${B1} maps to ${B1}src/*${B1}. Always use aliases \u2014 never deep relative paths.

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

Run: ${B1}npm test${B1} \xB7 Watch mode: ${B1}npm run test:watch${B1}
`;
}
function gettingStartedMd(projectName) {
  return `# Getting Started \u2014 ${projectName}

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

The Header and Footer are rendered in ${B1}src/app/page.tsx${B1} \u2014 move them to
${B1}src/app/layout.tsx${B1} when you add more pages that share the same navigation.
`;
}
function designSystemMd() {
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
| ${B1}--brand-glow${B1} | \u2014 | Glow shadow accent |

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

// src/templates/e2e.ts
var cypressConfig = `import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
  },
});
`;
var cypressSupport = `// Cypress support file \u2014 add global hooks and custom commands here.
`;
var cypressHomeSpec = `describe('Home page', () => {
  it('loads and has a title', () => {
    cy.visit('/');
    cy.title().should('not.be.empty');
  });

  it('displays an h1 heading', () => {
    cy.visit('/');
    cy.get('h1').should('be.visible');
  });

  it('renders the header navigation', () => {
    cy.visit('/');
    cy.get('nav').should('be.visible');
  });
});
`;
var cypressDocsSpec = `describe('Docs page', () => {
  it('is reachable directly', () => {
    cy.visit('/docs');
    cy.get('main').should('be.visible');
  });

  it('is accessible via the Docs nav link', () => {
    cy.visit('/');
    cy.get('nav').contains(/docs/i).click();
    cy.url().should('include', '/docs');
    cy.get('main').should('be.visible');
  });
});
`;
var homeSpec = `import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads and has a title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.+/);
  });

  test('displays an h1 heading', async ({ page }) => {
    await page.goto('/');
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('renders the header navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('has no broken internal links on the nav', async ({ page }) => {
    await page.goto('/');
    const internalLinks = page.getByRole('navigation').getByRole('link');
    const hrefs = await internalLinks.evaluateAll((els) =>
      (els as HTMLAnchorElement[])
        .map((el) => el.getAttribute('href') ?? '')
        .filter((h) => h.startsWith('/')),
    );
    for (const href of hrefs) {
      const res = await page.request.get(href);
      expect(res.status(), \`\${href} returned \${res.status()}\`).toBeLessThan(400);
    }
  });
});
`;
var docsSpec = `import { test, expect } from '@playwright/test';

test.describe('Docs page', () => {
  test('is reachable directly', async ({ page }) => {
    const res = await page.goto('/docs');
    expect(res?.status()).toBeLessThan(400);
  });

  test('renders visible main content', async ({ page }) => {
    await page.goto('/docs');
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('is accessible via the Docs nav link', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /docs/i }).first().click();
    await expect(page).toHaveURL(//docs/);
    await expect(page.getByRole('main')).toBeVisible();
  });
});
`;

// src/templates/index.ts
function getFileMap(projectName, opts) {
  const storeFile = opts.stateManagement === "zustand" ? uiStore : opts.stateManagement === "jotai" ? jotaiStore : uiStoreStandalone;
  const withRxjs = opts.advancedAddons.includes("rxjs");
  const withXstate = opts.advancedAddons.includes("xstate");
  return {
    /* ── Root config files ─────────────────────────────────────────────── */
    "package.json": packageJsonTemplate(projectName, opts),
    "tsconfig.json": tsconfigJson,
    "next.config.ts": nextConfig,
    "postcss.config.mjs": postCssConfig,
    "tailwind.config.ts": tailwindConfig,
    ".prettierrc": prettierRc,
    ".prettierignore": prettierIgnore,
    ".gitignore": gitIgnore,
    ".nvmrc": nvmrc,
    ".npmrc": npmrc,
    ".env.example": envExample,
    /* yarn berry requires a lockfile at the project root to stop upward traversal,
       and nodeLinker: node-modules for Next.js / jest compatibility */
    ...opts.pm === "yarn" ? {
      "yarn.lock": "",
      ".yarnrc.yml": [
        "nodeLinker: node-modules",
        'npmRegistryServer: "https://registry.npmjs.org"',
        "httpTimeout: 300000",
        "httpRetry: 5",
        "networkConcurrency: 4",
        ""
      ].join("\n")
    } : {},
    "next-env.d.ts": nextEnvDts,
    "jest.config.ts": jestConfig,
    "jest.setup.ts": jestSetup,
    /* ── Tooling ───────────────────────────────────────────────────────── */
    "eslint.config.mjs": eslintConfig,
    ...opts.conventionalCommits ? {
      "commitlint.config.ts": commitlintConfig,
      ".releaserc": releaserc,
      ".husky/pre-commit": huskyPreCommit(opts.pm),
      ".husky/commit-msg": huskyCommitMsg,
      ".husky/pre-push": huskyPrePush(opts.pm)
    } : {},
    /* ── VSCode ────────────────────────────────────────────────────────── */
    ".vscode/settings.json": vsCodeSettings,
    ".vscode/launch.json": vsCodeLaunch,
    ".vscode/extensions.json": vsCodeExtensions,
    /* ── App ───────────────────────────────────────────────────────────── */
    "src/app/globals.css": globalsCss,
    "src/app/layout.tsx": rootLayout(projectName, opts.stateManagement === "react-query"),
    "src/app/page.tsx": rootPage,
    "src/app/docs/page.tsx": docsPage,
    /* ── Atoms ─────────────────────────────────────────────────────────── */
    "src/components/atoms/button/index.tsx": buttonAtom,
    "src/components/atoms/badge/index.tsx": badgeAtom,
    "src/components/atoms/card/index.tsx": cardAtom,
    "src/components/atoms/input/index.tsx": inputAtom,
    "src/components/atoms/loading/index.tsx": loadingAtom,
    "src/components/atoms/typography/index.tsx": typographyAtom,
    /* ── Molecules ─────────────────────────────────────────────────────── */
    "src/components/molecules/code-block/index.tsx": codeBlockMolecule,
    "src/components/molecules/feature-card/index.tsx": featureCardMolecule,
    "src/components/molecules/pagination/index.tsx": paginationMolecule,
    /* ── Organisms ─────────────────────────────────────────────────────── */
    "src/components/organisms/header/index.tsx": headerOrganism,
    "src/components/organisms/footer/index.tsx": footerOrganism,
    /* ── Design tokens ─────────────────────────────────────────────────── */
    "src/design-system/tokens/colors.ts": colorsToken,
    "src/design-system/tokens/typography.ts": typographyToken,
    "src/design-system/tokens/spacing.ts": spacingToken,
    "src/design-system/tokens/radius.ts": radiusToken,
    "src/design-system/tokens/shadows.ts": shadowsToken,
    /* ── Store / server-state ─────────────────────────────────────────── */
    "src/store/ui.store.ts": storeFile,
    ...opts.stateManagement === "react-query" ? {
      "src/lib/providers.tsx": reactQueryProviders,
      "src/hooks/use-posts.ts": usePostsQuery
    } : {},
    /* ── Types ─────────────────────────────────────────────────────────── */
    "src/types/common.ts": commonTypes,
    "src/types/index.ts": typesIndex,
    /* ── Lib ───────────────────────────────────────────────────────────── */
    "src/lib/utils/cn.ts": cnUtil,
    "src/lib/utils/format.ts": formatUtil,
    "src/lib/http/types.ts": httpTypes,
    "src/lib/http/errors.ts": httpErrors,
    "src/lib/http/interceptors.ts": httpInterceptors,
    "src/lib/http/client.ts": httpClient,
    "src/lib/http/index.ts": httpIndex,
    /* ── Hooks ─────────────────────────────────────────────────────────── */
    "src/hooks/use-scroll-state.ts": useScrollState,
    ...withRxjs ? { "src/hooks/use-observable.ts": useObservable } : {},
    ...withXstate ? { "src/hooks/use-toggle-machine.ts": useToggleMachine } : {},
    /* ── Advanced add-ons ─────────────────────────────────────────────── */
    ...withRxjs ? {
      "src/lib/rx/counter.service.ts": rxCounterService
    } : {},
    ...withXstate ? {
      "src/lib/machines/toggle.machine.ts": toggleMachineTemplate
    } : {},
    /* ── Data ──────────────────────────────────────────────────────────── */
    "src/data/constants/navigation.ts": navigationConstants,
    /* ── E2E tests ─────────────────────────────────────────────────────── */
    ...opts.e2e === "playwright" ? {
      "playwright.config.ts": playwrightConfig(opts.pm),
      "e2e/home.spec.ts": homeSpec,
      "e2e/docs.spec.ts": docsSpec
    } : {},
    ...opts.e2e === "cypress" ? {
      "cypress.config.ts": cypressConfig,
      "cypress/support/e2e.ts": cypressSupport,
      "cypress/e2e/home.cy.ts": cypressHomeSpec,
      "cypress/e2e/docs.cy.ts": cypressDocsSpec
    } : {},
    /* ── Docs ──────────────────────────────────────────────────────────── */
    "ARCHITECTURE.md": architectureMd(projectName),
    "docs/getting-started.md": gettingStartedMd(projectName),
    "docs/design-system.md": designSystemMd()
  };
}

// src/create.ts
var PM_INSTALL = {
  npm: ["npm", "install"],
  pnpm: ["pnpm", "install"],
  yarn: ["yarn", "install"],
  bun: ["bun", "install"]
};
var PM_RUN = {
  npm: (s) => ["npm", "run", s],
  pnpm: (s) => ["pnpm", s],
  yarn: (s) => ["yarn", s],
  bun: (s) => ["bun", "run", s]
};
var PM_SUMMARY_RE = {
  npm: /added (\d+) packages/i,
  pnpm: /packages are hard linked|Packages: \+(\d+)/i,
  yarn: /success Saved (\d+) new packages|Done in/i,
  bun: /(\d+) packages? installed/i
};
function isPMAvailable(pm) {
  try {
    execSync(`${pm} --version`, { stdio: "pipe", shell: true });
    return true;
  } catch {
    return false;
  }
}
var INSTALL_PHASES = [
  "Resolving dependency tree",
  "Fetching packages from registry",
  "Verifying package integrity",
  "Linking dependencies",
  "Building package graph",
  "Running lifecycle scripts"
];
function runInstall(pm, cwd, spinner) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let phaseIdx = 0;
    const elapsed = () => chalk.dim(` \xB7 ${Math.round((Date.now() - startTime) / 1e3)}s`);
    spinner.text = INSTALL_PHASES[0] + elapsed();
    const phaseTick = setInterval(() => {
      phaseIdx = (phaseIdx + 1) % INSTALL_PHASES.length;
      spinner.text = INSTALL_PHASES[phaseIdx] + elapsed();
    }, 3e3);
    const [bin, ...args] = PM_INSTALL[pm];
    const child = spawn(`${bin} ${args.join(" ")}`, [], {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      shell: true
    });
    const errorLines = [];
    let lastPkgUpdate = 0;
    const onChunk = (chunk) => {
      const text3 = chunk.toString();
      const now = Date.now();
      for (const line of text3.split("\n")) {
        if (/ERR_|error|Error/i.test(line) && line.trim()) {
          errorLines.push(line.trim());
        }
      }
      const summary = text3.match(PM_SUMMARY_RE[pm]);
      if (summary) {
        clearInterval(phaseTick);
        const count = summary[1] ?? "";
        spinner.text = chalk.white(count ? `Installed ${count} packages` : "Packages installed") + elapsed();
        return;
      }
      if (pm === "npm") {
        if (now - lastPkgUpdate < 400) return;
        const pkg = text3.match(/reify:(@?[a-z][a-z0-9._-]*(?:\/[a-z0-9._-]+)?)/i);
        if (pkg) {
          lastPkgUpdate = now;
          spinner.text = chalk.dim("\u21B3 ") + chalk.white(pkg[1]) + elapsed();
        }
      }
    };
    child.stdout?.on("data", onChunk);
    child.stderr?.on("data", onChunk);
    child.on("close", (code) => {
      clearInterval(phaseTick);
      if (code === 0) {
        resolve();
      } else {
        const detail = errorLines.slice(-3).join(" | ");
        reject(new Error(detail || `${pm} install exited with code ${code}`));
      }
    });
    child.on("error", (err) => {
      clearInterval(phaseTick);
      reject(err);
    });
  });
}
function installPlaywrightBrowsers(cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      "node",
      ["node_modules/.bin/playwright", "install", "chromium"],
      { cwd, stdio: "pipe" }
    );
    child.on("close", (code) => code === 0 ? resolve() : reject(new Error(`playwright install exited with code ${code}`)));
    child.on("error", reject);
  });
}
async function createProject(projectName, { skipInstall, noGit, pm, stateManagement, e2e, conventionalCommits, advancedAddons, spinner }) {
  const projectDir = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(projectDir)) {
    throw new Error(
      `Directory "${projectName}" already exists. Choose a different name or remove it first.`
    );
  }
  spinner.text = "Creating project directory...";
  fs.mkdirSync(projectDir, { recursive: true });
  const fileMap = getFileMap(projectName, { pm, stateManagement, e2e, conventionalCommits, advancedAddons });
  const entries = Object.entries(fileMap);
  const total = entries.length;
  let written = 0;
  spinner.text = `Writing files... [0/${total}]`;
  for (const [filePath, content] of entries) {
    const fullPath = path.join(projectDir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, "utf-8");
    written++;
    spinner.text = `Writing files... [${written}/${total}]`;
  }
  for (const hook of [".husky/pre-commit", ".husky/commit-msg", ".husky/pre-push"]) {
    const hookPath = path.join(projectDir, hook);
    if (fs.existsSync(hookPath)) fs.chmodSync(hookPath, 493);
  }
  spinner.succeed(chalk.green(`${written} files written`));
  if (!skipInstall) {
    if (!isPMAvailable(pm)) {
      spinner.warn(
        chalk.yellow(
          `"${pm}" is not installed or not in PATH. Install it first: https://` + (pm === "pnpm" ? "pnpm.io/installation" : pm === "yarn" ? "yarnpkg.com/getting-started/install" : "bun.sh/docs/installation")
        )
      );
    } else {
      spinner.start(INSTALL_PHASES[0]);
      try {
        await runInstall(pm, projectDir, spinner);
        spinner.succeed(chalk.green("Dependencies installed"));
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        spinner.fail(chalk.red(`${pm} install failed`));
        console.log();
        console.log("  " + chalk.yellow("\u26A0 Install error:") + chalk.dim(" " + msg));
        console.log("  " + chalk.dim("Retry from inside the project:"));
        console.log("    " + chalk.cyan(`$ cd ${projectName}`));
        console.log("    " + chalk.cyan(`$ ${pm === "npm" ? "npm install" : `${pm} install`}`));
        console.log();
        process.exit(1);
      }
      if (e2e === "playwright") {
        spinner.start("Installing Playwright browsers (chromium)...");
        try {
          await installPlaywrightBrowsers(projectDir);
          spinner.succeed(chalk.green("Playwright browsers installed"));
        } catch {
          spinner.warn(chalk.yellow('Playwright browser install failed \u2014 run "npx playwright install chromium" manually'));
        }
      }
    }
  }
  if (!noGit) {
    spinner.start("Initializing git repository...");
    try {
      execSync("git init", { cwd: projectDir, stdio: "pipe" });
      if (!skipInstall && conventionalCommits) {
        spinner.text = "Installing git hooks (husky)...";
        const [bin, ...args] = PM_RUN[pm]("prepare");
        execSync(`${bin} ${args.join(" ")}`, { cwd: projectDir, stdio: "pipe" });
        spinner.succeed(chalk.green("Git initialized + hooks installed"));
      } else {
        spinner.succeed(chalk.green("Git initialized"));
      }
    } catch {
      spinner.warn(chalk.yellow('Git setup skipped \u2014 run "git init" manually'));
    }
  }
  printDone(projectName, pm, stateManagement, e2e, conventionalCommits, advancedAddons, noGit, skipInstall);
}
function printDone(projectName, pm, stateManagement, e2e, conventionalCommits, advancedAddons, noGit, skipInstall) {
  const stateLabel = stateManagement === "react-query" ? "TanStack Query" : stateManagement === "jotai" ? "Jotai" : stateManagement === "zustand" ? "Zustand" : "none";
  const e2eLabel = e2e === "playwright" ? "Playwright" : e2e === "cypress" ? "Cypress" : "none";
  const devCmd = pm === "npm" ? "npm run dev" : `${pm} dev`;
  const installCmd = pm === "npm" ? "npm install" : `${pm} install`;
  const nextSteps = [
    `cd ${projectName}`,
    ...skipInstall ? [installCmd] : [],
    devCmd
  ];
  console.log();
  console.log(
    "  " + chalk.bold.green("\u2713 Ready!") + "  " + chalk.dim(`${projectName} is scaffolded.`)
  );
  console.log();
  console.log("  " + chalk.dim("Stack:  ") + chalk.white("Next.js 15 \xB7 TypeScript \xB7 Tailwind CSS v4 \xB7 " + stateLabel));
  console.log("  " + chalk.dim("Design: ") + chalk.white("Atomic Design (atoms \u2192 molecules \u2192 organisms)"));
  const dxParts = ["ESLint", "Prettier", "Jest"];
  if (conventionalCommits) dxParts.push("Husky", "Commitlint");
  if (e2e !== "none") dxParts.push(e2eLabel);
  console.log("  " + chalk.dim("DX:     ") + chalk.white(dxParts.join(" \xB7 ")));
  if (advancedAddons.length > 0) {
    const addonLabels = advancedAddons.map((a) => a === "rxjs" ? "RxJS" : "XState");
    console.log("  " + chalk.dim("Addons: ") + chalk.white(addonLabels.join(" \xB7 ")));
  }
  console.log("  " + chalk.dim("PM:     ") + chalk.white(pm));
  if (noGit) console.log("  " + chalk.dim("Git:    ") + chalk.yellow("skipped (--no-git)"));
  console.log();
  console.log("  " + chalk.dim("Next steps:"));
  for (const step of nextSteps) {
    console.log("    " + chalk.cyan("$ " + step));
  }
  console.log();
}

// src/commands/add.ts
import path15 from "path";
import * as p3 from "@clack/prompts";
import chalk7 from "chalk";

// src/generators/component/index.ts
import path2 from "path";

// src/generator-templates/component.ts
function componentTsx(pascal, _kebab) {
  return `import type { FC, HTMLAttributes } from 'react';

export interface ${pascal}Props extends HTMLAttributes<HTMLDivElement> {}

const ${pascal}: FC<${pascal}Props> = ({ className, children, ...props }) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

export default ${pascal};
`;
}
function componentVariantsTsx(pascal, kebab) {
  return `import type { FC, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ${pascal}Props extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary';
}

const ${pascal}: FC<${pascal}Props> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  return (
    <div
      data-variant={variant}
      className={cn('${kebab}', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default ${pascal};
`;
}
function componentStylesTs(pascal) {
  return `export const ${pascal}Styles = {
  root: '',
  variants: {
    default:   '',
    secondary: '',
  },
} as const;
`;
}
function componentTestTsx(pascal) {
  return `import { render, screen } from '@testing-library/react';
import ${pascal} from './${pascal}';

describe('${pascal}', () => {
  it('renders children', () => {
    render(<${pascal}>content</${pascal}>);
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<${pascal} className="custom">test</${pascal}>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards additional props', () => {
    render(<${pascal} data-testid="el">test</${pascal}>);
    expect(screen.getByTestId('el')).toBeInTheDocument();
  });
});
`;
}
function componentStoryTsx(pascal, storyTitle, withVariants = false) {
  const secondaryStory = withVariants ? `
export const Secondary: Story = { args: { variant: 'secondary' } };
` : "";
  return `import type { Meta, StoryObj } from '@storybook/react';
import ${pascal} from './${pascal}';

const meta: Meta<typeof ${pascal}> = {
  title: '${storyTitle}',
  component: ${pascal},
};
export default meta;

type Story = StoryObj<typeof ${pascal}>;

export const Default: Story = {};
${secondaryStory}`;
}
function componentIndexTs(pascal) {
  return `export { default } from './${pascal}';
export type { ${pascal}Props } from './${pascal}';
`;
}

// src/generators/component/index.ts
var componentGenerator = {
  type: "component",
  defaultBaseDir: "src/components",
  generate(ctx) {
    const { pascalName, kebabName, outDir } = ctx;
    const cwd = process.cwd();
    const withVariants = Boolean(ctx.extra?.withVariants);
    const withTest = Boolean(ctx.extra?.withTest);
    const withStyles = Boolean(ctx.extra?.withStyles);
    const withStory = Boolean(ctx.extra?.withStory);
    const files = [
      [`${pascalName}.tsx`, withVariants ? componentVariantsTsx(pascalName, kebabName) : componentTsx(pascalName, kebabName)],
      ["index.ts", componentIndexTs(pascalName)]
    ];
    if (withStyles) files.push([`${pascalName}.styles.ts`, componentStylesTs(pascalName)]);
    if (withTest) files.push([`${pascalName}.test.tsx`, componentTestTsx(pascalName)]);
    if (withStory) files.push([`${pascalName}.stories.tsx`, componentStoryTsx(pascalName, `components/${pascalName}`, withVariants)]);
    return files.map(([name, content]) => {
      const fullPath = path2.join(outDir, name);
      return { fullPath, relativePath: path2.relative(cwd, fullPath), content };
    });
  }
};
var component_default = componentGenerator;

// src/generators/atom/index.ts
import path3 from "path";

// src/generator-templates/atomic.ts
var LEVEL_COMMENT = {
  atom: "// Atom \u2014 smallest reusable unit; no composed sub-components",
  molecule: "// Molecule \u2014 composes atoms into a focused, single-purpose unit",
  organism: "// Organism \u2014 self-contained section composed of molecules and atoms",
  template: "// Template \u2014 structural layout; handles slot composition and spacing"
};
var STORY_FOLDER = {
  atom: "Atoms",
  molecule: "Molecules",
  organism: "Organisms",
  template: "Templates"
};
function atomicComponentTsx(pascal, kebab, level, withVariants = false) {
  if (level === "template") {
    return `import type { FC, PropsWithChildren } from 'react';
import { cn } from '@/lib/utils/cn';

${LEVEL_COMMENT[level]}
export interface ${pascal}Props extends PropsWithChildren {
  className?: string;
}

const ${pascal}: FC<${pascal}Props> = ({ className, children }) => {
  return (
    <div className={cn('${kebab}', className)}>
      {children}
    </div>
  );
};

export default ${pascal};
`;
  }
  if (withVariants) {
    return `import type { FC, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

${LEVEL_COMMENT[level]}
export interface ${pascal}Props extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary';
}

const ${pascal}: FC<${pascal}Props> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  return (
    <div
      data-variant={variant}
      className={cn('${kebab}', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default ${pascal};
`;
  }
  return `import type { FC, HTMLAttributes } from 'react';

${LEVEL_COMMENT[level]}
export interface ${pascal}Props extends HTMLAttributes<HTMLDivElement> {}

const ${pascal}: FC<${pascal}Props> = ({ className, children, ...props }) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

export default ${pascal};
`;
}
function atomicStylesTs(pascal) {
  return `export const ${pascal}Styles = {
  root: '',
  variants: {
    default:   '',
    secondary: '',
  },
} as const;
`;
}
function atomicTestTsx(pascal) {
  return `import { render, screen } from '@testing-library/react';
import ${pascal} from './${pascal}';

describe('${pascal}', () => {
  it('renders children', () => {
    render(<${pascal}>content</${pascal}>);
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<${pascal} className="custom">test</${pascal}>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards props to root element', () => {
    render(<${pascal} data-testid="el">test</${pascal}>);
    expect(screen.getByTestId('el')).toBeInTheDocument();
  });
});
`;
}
function atomicStoryTsx(pascal, level, withVariants = false) {
  const folder = STORY_FOLDER[level];
  const secondaryStory = withVariants ? `
export const Secondary: Story = { args: { variant: 'secondary' } };
` : "";
  return `import type { Meta, StoryObj } from '@storybook/react';
import ${pascal} from './${pascal}';

const meta: Meta<typeof ${pascal}> = {
  title: '${folder}/${pascal}',
  component: ${pascal},
};
export default meta;

type Story = StoryObj<typeof ${pascal}>;

export const Default: Story = {};
${secondaryStory}`;
}
function atomicIndexTs(pascal) {
  return `export { default } from './${pascal}';
export type { ${pascal}Props } from './${pascal}';
`;
}

// src/generators/atom/index.ts
var atomGenerator = {
  type: "atom",
  defaultBaseDir: "src/components/atoms",
  generate(ctx) {
    const { pascalName, kebabName, outDir } = ctx;
    const cwd = process.cwd();
    const withVariants = Boolean(ctx.extra?.withVariants);
    const withTest = Boolean(ctx.extra?.withTest);
    const withStyles = Boolean(ctx.extra?.withStyles);
    const withStory = Boolean(ctx.extra?.withStory);
    const files = [
      [`${pascalName}.tsx`, atomicComponentTsx(pascalName, kebabName, "atom", withVariants)],
      ["index.ts", atomicIndexTs(pascalName)]
    ];
    if (withStyles) files.push([`${pascalName}.styles.ts`, atomicStylesTs(pascalName)]);
    if (withTest) files.push([`${pascalName}.test.tsx`, atomicTestTsx(pascalName)]);
    if (withStory) files.push([`${pascalName}.stories.tsx`, atomicStoryTsx(pascalName, "atom", withVariants)]);
    return files.map(([name, content]) => {
      const fullPath = path3.join(outDir, name);
      return { fullPath, relativePath: path3.relative(cwd, fullPath), content };
    });
  }
};
var atom_default = atomGenerator;

// src/generators/molecule/index.ts
import path4 from "path";
var moleculeGenerator = {
  type: "molecule",
  defaultBaseDir: "src/components/molecules",
  generate(ctx) {
    const { pascalName, kebabName, outDir } = ctx;
    const cwd = process.cwd();
    const withVariants = Boolean(ctx.extra?.withVariants);
    const withTest = Boolean(ctx.extra?.withTest);
    const withStyles = Boolean(ctx.extra?.withStyles);
    const withStory = Boolean(ctx.extra?.withStory);
    const files = [
      [`${pascalName}.tsx`, atomicComponentTsx(pascalName, kebabName, "molecule", withVariants)],
      ["index.ts", atomicIndexTs(pascalName)]
    ];
    if (withStyles) files.push([`${pascalName}.styles.ts`, atomicStylesTs(pascalName)]);
    if (withTest) files.push([`${pascalName}.test.tsx`, atomicTestTsx(pascalName)]);
    if (withStory) files.push([`${pascalName}.stories.tsx`, atomicStoryTsx(pascalName, "molecule", withVariants)]);
    return files.map(([name, content]) => {
      const fullPath = path4.join(outDir, name);
      return { fullPath, relativePath: path4.relative(cwd, fullPath), content };
    });
  }
};
var molecule_default = moleculeGenerator;

// src/generators/organism/index.ts
import path5 from "path";
var organismGenerator = {
  type: "organism",
  defaultBaseDir: "src/components/organisms",
  generate(ctx) {
    const { pascalName, kebabName, outDir } = ctx;
    const cwd = process.cwd();
    const withVariants = Boolean(ctx.extra?.withVariants);
    const withTest = Boolean(ctx.extra?.withTest);
    const withStyles = Boolean(ctx.extra?.withStyles);
    const withStory = Boolean(ctx.extra?.withStory);
    const files = [
      [`${pascalName}.tsx`, atomicComponentTsx(pascalName, kebabName, "organism", withVariants)],
      ["index.ts", atomicIndexTs(pascalName)]
    ];
    if (withStyles) files.push([`${pascalName}.styles.ts`, atomicStylesTs(pascalName)]);
    if (withTest) files.push([`${pascalName}.test.tsx`, atomicTestTsx(pascalName)]);
    if (withStory) files.push([`${pascalName}.stories.tsx`, atomicStoryTsx(pascalName, "organism", withVariants)]);
    return files.map(([name, content]) => {
      const fullPath = path5.join(outDir, name);
      return { fullPath, relativePath: path5.relative(cwd, fullPath), content };
    });
  }
};
var organism_default = organismGenerator;

// src/generators/template/index.ts
import path6 from "path";
var templateGenerator = {
  type: "template",
  defaultBaseDir: "src/components/templates",
  generate(ctx) {
    const { pascalName, kebabName, outDir } = ctx;
    const cwd = process.cwd();
    const withTest = Boolean(ctx.extra?.withTest);
    const withStyles = Boolean(ctx.extra?.withStyles);
    const withStory = Boolean(ctx.extra?.withStory);
    const files = [
      [`${pascalName}.tsx`, atomicComponentTsx(pascalName, kebabName, "template", false)],
      ["index.ts", atomicIndexTs(pascalName)]
    ];
    if (withStyles) files.push([`${pascalName}.styles.ts`, atomicStylesTs(pascalName)]);
    if (withTest) files.push([`${pascalName}.test.tsx`, atomicTestTsx(pascalName)]);
    if (withStory) files.push([`${pascalName}.stories.tsx`, atomicStoryTsx(pascalName, "template", false)]);
    return files.map(([name, content]) => {
      const fullPath = path6.join(outDir, name);
      return { fullPath, relativePath: path6.relative(cwd, fullPath), content };
    });
  }
};
var template_default = templateGenerator;

// src/generators/page/index.ts
import path7 from "path";

// src/parsers/route-parser.ts
function parseSegment(seg) {
  if (/^\(.+\)$/.test(seg)) {
    return { raw: seg, kind: "group", name: seg.slice(1, -1) };
  }
  if (/^\[\[\.\.\..+\]\]$/.test(seg)) {
    const name = seg.slice(5, -2);
    return { raw: seg, kind: "optional-catch-all", name };
  }
  if (/^\[\.\.\..+\]$/.test(seg)) {
    const name = seg.slice(4, -1);
    return { raw: seg, kind: "catch-all", name };
  }
  if (/^\[.+\]$/.test(seg)) {
    const name = seg.slice(1, -1);
    return { raw: seg, kind: "dynamic", name };
  }
  return { raw: seg, kind: "static", name: seg };
}
function parseRoute(rawInput) {
  const rawPath = rawInput.trim().replace(/\\/g, "/").replace(/^\/|\/$/g, "");
  const parts = rawPath.split("/").filter(Boolean);
  const segments = parts.map(parseSegment);
  const meaningfulSegs = segments.filter((s) => s.kind !== "group");
  const last = meaningfulSegs[meaningfulSegs.length - 1] ?? segments[segments.length - 1];
  const componentName = toPascal(last.name);
  const titleParts = segments.filter((s) => s.kind !== "group").map((s) => s.name.charAt(0).toUpperCase() + s.name.slice(1));
  const pageTitle = titleParts.join(" ");
  const dynamicParams = segments.filter((s) => s.kind !== "static" && s.kind !== "group").map((s) => ({
    name: s.name,
    tsType: s.kind === "optional-catch-all" ? "string[] | undefined" : s.kind === "catch-all" ? "string[]" : "string"
  }));
  return {
    rawPath,
    outputPath: rawPath,
    componentName,
    pageTitle,
    isDynamic: dynamicParams.length > 0,
    dynamicParams
  };
}
function toPascal(s) {
  return s.replace(/[-_](.)/g, (_, c) => c.toUpperCase()).replace(/^(.)/, (_, c) => c.toUpperCase());
}

// src/generator-templates/page.ts
var LAYOUT_IMPORTS = `import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';`;
function staticPageTsx(pascal, title) {
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
function buildParamsType(params) {
  const fields = params.map((p5) => `    ${p5.name}: ${p5.tsType};`).join("\n");
  return `type Params = {
  params: Promise<{
${fields}
  }>;
};`;
}
function buildParamDestructure(params) {
  const names = params.map((p5) => p5.name).join(", ");
  return `const { ${names} } = await params;`;
}
function dynamicPageTsx(pascal, title, params) {
  const firstParam = params[0];
  const firstIsArray = firstParam.tsType.includes("[]");
  const exampleUsage = firstIsArray ? `<p className="text-txt-secondary">Path: {${firstParam.name}${firstParam.tsType.includes("undefined") ? `?.join('/') ?? 'index'` : `.join('/')`}}</p>` : `<p className="text-txt-secondary">ID: {${firstParam.name}}</p>`;
  return `${LAYOUT_IMPORTS}
import type { Metadata } from 'next';

${buildParamsType(params)}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  ${buildParamDestructure(params)}
  return { title: \`${title} \u2014 \${${firstParam.name}${firstIsArray ? "?.[0]" : ""}}\` };
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
function loadingTsx(pascal) {
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
function pageIndexTs(pascal) {
  return `export { default as ${pascal}Page } from './page';
`;
}
function buildPageTsx(route) {
  return route.isDynamic ? dynamicPageTsx(route.componentName, route.pageTitle, route.dynamicParams) : staticPageTsx(route.componentName, route.pageTitle);
}

// src/utils/logger.ts
import chalk2 from "chalk";
var P = "  ";
var log = {
  info: (msg) => console.log(P + chalk2.cyan("\u2139") + " " + msg),
  success: (msg) => console.log(P + chalk2.green("\u2713") + " " + chalk2.green(msg)),
  warn: (msg) => console.log(P + chalk2.yellow("\u26A0") + " " + chalk2.yellow(msg)),
  error: (msg) => console.error(P + chalk2.red("\u2717") + " " + chalk2.red(msg)),
  blank: () => console.log(),
  section: (msg) => {
    console.log();
    console.log(P + chalk2.bold(msg));
  },
  file: (action, filePath) => {
    const icon = { create: chalk2.green("+"), skip: chalk2.yellow("\u2013"), overwrite: chalk2.blue("\u21BA") }[action];
    const color = { create: chalk2.green, skip: chalk2.yellow, overwrite: chalk2.blue }[action];
    console.log(P + "  " + icon + " " + color(filePath));
  },
  dryFile: (filePath) => {
    console.log(P + "  " + chalk2.dim("[dry]") + " " + chalk2.dim(filePath));
  }
};

// src/generators/page/index.ts
import chalk3 from "chalk";
var pageGenerator = {
  type: "page",
  defaultBaseDir: "src/app",
  generate(ctx) {
    const { rawName: rawName2, outDir } = ctx;
    const cwd = process.cwd();
    const route = parseRoute(rawName2);
    if (route.isDynamic) {
      log.info(
        chalk3.dim("Dynamic route detected \u2014 if you see shell errors, quote the path: ") + chalk3.cyan(`"${rawName2}"`)
      );
    }
    const files = [
      ["page.tsx", buildPageTsx(route)],
      ["loading.tsx", loadingTsx(route.componentName)],
      ["index.ts", pageIndexTs(route.componentName)]
    ];
    return files.map(([name, content]) => {
      const fullPath = path7.join(outDir, name);
      return { fullPath, relativePath: path7.relative(cwd, fullPath), content };
    });
  }
};
var page_default = pageGenerator;

// src/generators/feature/index.ts
import path8 from "path";

// src/generator-templates/feature.ts
function featureIndexTs(pascal, extraDirs = []) {
  const typeReexport = extraDirs.includes("types") ? `export * from './types';
` : "";
  const placeholder = typeReexport ? "" : "export {};\n";
  return `// ${pascal} feature \u2014 public API
${placeholder}${typeReexport}`;
}
function featureTypesIndexTs(pascal) {
  return `export interface ${pascal}Entity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ${pascal}State {
  isLoading: boolean;
  error: string | null;
}
`;
}
function featureBarrelTs(dirName) {
  return `// ${dirName} \u2014 add exports here
`;
}

// src/generators/feature/index.ts
var VALID_SUBDIRS = ["components", "hooks", "services", "store", "utils", "types"];
var featureGenerator = {
  type: "feature",
  defaultBaseDir: "src/features",
  generate(ctx) {
    const { pascalName, outDir } = ctx;
    const cwd = process.cwd();
    const extraDirs = (ctx.extra?.with ?? []).filter((d) => VALID_SUBDIRS.includes(d));
    const files = [];
    const add = (rel, content) => {
      const fullPath = path8.join(outDir, rel);
      files.push({ fullPath, relativePath: path8.relative(cwd, fullPath), content });
    };
    add("index.ts", featureIndexTs(pascalName, extraDirs));
    for (const dir of extraDirs) {
      if (dir === "types") {
        add("types/index.ts", featureTypesIndexTs(pascalName));
      } else {
        add(`${dir}/index.ts`, featureBarrelTs(dir));
      }
    }
    return files;
  }
};
var feature_default = featureGenerator;

// src/generators/store/index.ts
import path11 from "path";

// src/resolvers/state-management.ts
import { spawn as spawn2 } from "child_process";
import * as p from "@clack/prompts";
import chalk4 from "chalk";
import ora from "ora";

// src/config/atom-config.ts
import fs2 from "fs";
import path9 from "path";
var CONFIG_FILE = "atom.config.json";
function readAtomConfig(cwd = process.cwd()) {
  const configPath = path9.join(cwd, CONFIG_FILE);
  if (!fs2.existsSync(configPath)) return null;
  try {
    return JSON.parse(fs2.readFileSync(configPath, "utf-8"));
  } catch {
    return null;
  }
}
function writeAtomConfig(config, cwd = process.cwd()) {
  const configPath = path9.join(cwd, CONFIG_FILE);
  fs2.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
}
function patchAtomConfig(updates, cwd = process.cwd()) {
  const existing = readAtomConfig(cwd) ?? {};
  writeAtomConfig({ ...existing, ...updates }, cwd);
}

// src/config/project-detector.ts
import fs3 from "fs";
import path10 from "path";
function readPackageJson(cwd) {
  const p5 = path10.join(cwd, "package.json");
  if (!fs3.existsSync(p5)) return null;
  try {
    return JSON.parse(fs3.readFileSync(p5, "utf-8"));
  } catch {
    return null;
  }
}
function allDeps(pkg) {
  return /* @__PURE__ */ new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {})
  ]);
}
function detectStateManagement(cwd = process.cwd()) {
  const pkg = readPackageJson(cwd);
  if (!pkg) return null;
  const deps = allDeps(pkg);
  if (deps.has("zustand")) return "zustand";
  if (deps.has("@reduxjs/toolkit")) return "redux-toolkit";
  if (deps.has("jotai")) return "jotai";
  if (deps.has("mobx")) return "mobx";
  return null;
}
function detectPackageManager(cwd = process.cwd()) {
  if (fs3.existsSync(path10.join(cwd, "bun.lock")) || fs3.existsSync(path10.join(cwd, "bun.lockb"))) return "bun";
  if (fs3.existsSync(path10.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs3.existsSync(path10.join(cwd, "yarn.lock"))) return "yarn";
  try {
    const pkg = JSON.parse(fs3.readFileSync(path10.join(cwd, "package.json"), "utf-8"));
    if (pkg.packageManager?.startsWith("pnpm")) return "pnpm";
    if (pkg.packageManager?.startsWith("yarn")) return "yarn";
    if (pkg.packageManager?.startsWith("bun")) return "bun";
  } catch {
  }
  return "npm";
}
function detectZod(cwd = process.cwd()) {
  const pkg = readPackageJson(cwd);
  if (!pkg) return false;
  return allDeps(pkg).has("zod");
}

// src/resolvers/state-management.ts
var SM_PACKAGES = {
  "zustand": ["zustand"],
  "redux-toolkit": ["@reduxjs/toolkit", "react-redux"],
  "jotai": ["jotai"],
  "mobx": ["mobx", "mobx-react-lite"]
};
var PM_ADD = {
  npm: "install",
  pnpm: "add",
  yarn: "add",
  bun: "add"
};
function installPackages(packages, pm) {
  const cmd = `${pm} ${PM_ADD[pm] ?? "install"} ${packages.join(" ")}`;
  return new Promise((resolve, reject) => {
    const child = spawn2(cmd, [], {
      cwd: process.cwd(),
      stdio: "pipe",
      shell: true
    });
    child.on("close", (code) => code === 0 ? resolve() : reject(new Error(`Exit ${code}`)));
    child.on("error", reject);
  });
}
async function resolveStateManagement() {
  const config = readAtomConfig();
  if (config?.stateManagement && config.stateManagement !== "none") {
    return config.stateManagement;
  }
  const detected = detectStateManagement();
  if (detected) {
    patchAtomConfig({ stateManagement: detected });
    return detected;
  }
  const isTTY = Boolean(process.stdin.isTTY);
  if (!isTTY) {
    log.warn("No state management detected \u2014 defaulting to Zustand.");
    return "zustand";
  }
  log.blank();
  log.warn("No state management detected in this project.");
  const result = await p.select({
    message: chalk4.bold("Which state management solution do you want to use?"),
    options: [
      { value: "zustand", label: "Zustand", hint: "lightweight \u2014 recommended" },
      { value: "redux-toolkit", label: "Redux Toolkit", hint: "scalable \u2014 enterprise" },
      { value: "jotai", label: "Jotai", hint: "atomic \u2014 minimal" },
      { value: "mobx", label: "MobX", hint: "reactive \u2014 OOP-friendly" }
    ]
  });
  if (p.isCancel(result)) {
    p.cancel("Cancelled.");
    process.exit(0);
  }
  patchAtomConfig({ stateManagement: result });
  const packages = SM_PACKAGES[result];
  if (packages) {
    const pm = detectPackageManager();
    const spinner = ora({ prefixText: "  " }).start(
      `Installing ${chalk4.cyan(packages.join(" "))} via ${chalk4.dim(pm)}\u2026`
    );
    try {
      await installPackages(packages, pm);
      spinner.succeed(chalk4.green(`Installed ${packages.join(", ")}`));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      spinner.warn(
        chalk4.yellow(`Install failed (${msg}). Run manually: `) + chalk4.cyan(`${pm} ${PM_ADD[pm]} ${packages.join(" ")}`)
      );
    }
  }
  return result;
}

// src/generators/store/adapters/zustand.ts
function zustandAdapter(camel, pascal) {
  return {
    [`${camel}.store.ts`]: `import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { ${pascal}State, ${pascal}Actions } from './${camel}.types';

type ${pascal}Store = ${pascal}State & ${pascal}Actions;

const initialState: ${pascal}State = {
  isLoading: false,
  error: null,
};

export const use${pascal}Store = create<${pascal}Store>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setLoading: (isLoading) => set({ isLoading }, false, '${camel}/setLoading'),
        setError:   (error)     => set({ error },     false, '${camel}/setError'),
        reset:      ()          => set(initialState,  false, '${camel}/reset'),
      }),
      { name: '${camel}-store' },
    ),
    { name: '${pascal}Store' },
  ),
);
`,
    [`${camel}.types.ts`]: `export interface ${pascal}State {
  isLoading: boolean;
  error: string | null;
}

export interface ${pascal}Actions {
  setLoading: (isLoading: boolean) => void;
  setError:   (error: string | null) => void;
  reset:      () => void;
}
`,
    ["index.ts"]: `export { use${pascal}Store } from './${camel}.store';
export type { ${pascal}State, ${pascal}Actions } from './${camel}.types';
`
  };
}

// src/generators/store/adapters/redux-toolkit.ts
function reduxToolkitAdapter(camel, pascal) {
  return {
    [`${camel}.slice.ts`]: `import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ${pascal}State } from './${camel}.types';

const initialState: ${pascal}State = {
  isLoading: false,
  error: null,
};

export const fetch${pascal} = createAsyncThunk(
  '${camel}/fetch',
  async (_: void, { rejectWithValue }) => {
    try {
      // TODO: replace with real API call
      return {};
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

export const ${camel}Slice = createSlice({
  name: '${camel}',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    reset: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetch${pascal}.pending,  (state) => { state.isLoading = true;  state.error = null; })
      .addCase(fetch${pascal}.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      })
      .addCase(fetch${pascal}.fulfilled, (state) => { state.isLoading = false; });
  },
});

export const ${camel}Reducer  = ${camel}Slice.reducer;
export const ${camel}Actions  = ${camel}Slice.actions;
`,
    [`${camel}.types.ts`]: `export interface ${pascal}State {
  isLoading: boolean;
  error: string | null;
}
`,
    ["index.ts"]: `export { ${camel}Reducer, ${camel}Actions, fetch${pascal} } from './${camel}.slice';
export type { ${pascal}State } from './${camel}.types';
`
  };
}

// src/generators/store/adapters/jotai.ts
function jotaiAdapter(camel, pascal) {
  return {
    [`${camel}.atoms.ts`]: `import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { ${pascal}State } from './${camel}.types';

const defaultState: ${pascal}State = {
  isLoading: false,
  error: null,
};

/** Persistent atom \u2014 survives page refresh via localStorage. */
export const ${camel}Atom = atomWithStorage<${pascal}State>('${camel}', defaultState);

/** Derived loading atom. */
export const ${camel}LoadingAtom = atom(
  (get) => get(${camel}Atom).isLoading,
  (_get, set, isLoading: boolean) =>
    set(${camel}Atom, (prev) => ({ ...prev, isLoading })),
);

/** Derived error atom. */
export const ${camel}ErrorAtom = atom(
  (get) => get(${camel}Atom).error,
  (_get, set, error: string | null) =>
    set(${camel}Atom, (prev) => ({ ...prev, error })),
);

/** Reset atom to its default state. */
export const reset${pascal}Atom = atom(null, (_get, set) => {
  set(${camel}Atom, defaultState);
});
`,
    [`${camel}.types.ts`]: `export interface ${pascal}State {
  isLoading: boolean;
  error: string | null;
}
`,
    ["index.ts"]: `export {
  ${camel}Atom,
  ${camel}LoadingAtom,
  ${camel}ErrorAtom,
  reset${pascal}Atom,
} from './${camel}.atoms';
export type { ${pascal}State } from './${camel}.types';
`
  };
}

// src/generators/store/adapters/mobx.ts
function mobxAdapter(camel, pascal) {
  return {
    [`${camel}.store.ts`]: `import { makeAutoObservable, runInAction } from 'mobx';
import type { I${pascal}Store } from './${camel}.types';

class ${pascal}Store implements I${pascal}Store {
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  reset() {
    runInAction(() => {
      this.isLoading = false;
      this.error = null;
    });
  }

  async fetchData() {
    runInAction(() => { this.isLoading = true; this.error = null; });
    try {
      // TODO: replace with real API call
      runInAction(() => { this.isLoading = false; });
    } catch (err) {
      runInAction(() => {
        this.isLoading = false;
        this.error = (err as Error).message;
      });
    }
  }
}

export const ${camel}Store = new ${pascal}Store();
`,
    [`${camel}.types.ts`]: `export interface I${pascal}Store {
  isLoading: boolean;
  error: string | null;
  setLoading(isLoading: boolean): void;
  setError(error: string | null): void;
  reset(): void;
}
`,
    ["index.ts"]: `export { ${camel}Store } from './${camel}.store';
export type { I${pascal}Store } from './${camel}.types';
`
  };
}

// src/generators/store/adapters/index.ts
var ADAPTERS = {
  "zustand": zustandAdapter,
  "redux-toolkit": reduxToolkitAdapter,
  "jotai": jotaiAdapter,
  "mobx": mobxAdapter
};
function getStoreAdapter(sm) {
  if (sm === "none" || !(sm in ADAPTERS)) return zustandAdapter;
  return ADAPTERS[sm];
}

// src/generators/store/index.ts
import chalk5 from "chalk";
var storeGenerator = {
  type: "store",
  defaultBaseDir: "src/store",
  async generate(ctx) {
    const { camelName, pascalName, outDir } = ctx;
    const cwd = process.cwd();
    const sm = await resolveStateManagement();
    log.info(chalk5.dim(`Using ${chalk5.white(sm)} adapter`));
    const adapter = getStoreAdapter(sm);
    const fileMap = adapter(camelName, pascalName);
    return Object.entries(fileMap).map(([name, content]) => {
      const fullPath = path11.join(outDir, name);
      return { fullPath, relativePath: path11.relative(cwd, fullPath), content };
    });
  }
};
var store_default = storeGenerator;

// src/generators/api/index.ts
import path12 from "path";

// src/generator-templates/api.ts
function buildImports(camel, pascal, useZod, mode) {
  const httpImport = `import { http } from '@/lib/http';`;
  if (mode === "custom") return httpImport;
  const source = useZod ? `./${camel}.schemas` : `./${camel}.types`;
  const names = [pascal];
  if (mode === "crud" || mode === "action") names.push(`Create${pascal}`, `Update${pascal}`);
  return `${httpImport}
import type { ${names.join(", ")} } from '${source}';`;
}
function crudMethods(camel, pascal) {
  return `export const ${camel}Api = {
  list:   ()                             => http.get<${pascal}[]>('/${camel}'),
  get:    (id: string)                   => http.get<${pascal}>(\`/${camel}/\${id}\`),
  create: (body: Create${pascal})        => http.post<${pascal}>('/${camel}', body),
  update: (id: string, body: Update${pascal}) =>
    http.patch<${pascal}>(\`/${camel}/\${id}\`, body),
  remove: (id: string)                   => http.delete<void>(\`/${camel}/\${id}\`),
} as const;`;
}
function queryMethods(camel, pascal) {
  return `export const ${camel}Api = {
  list: ()             => http.get<${pascal}[]>('/${camel}'),
  get:  (id: string)   => http.get<${pascal}>(\`/${camel}/\${id}\`),
} as const;`;
}
function actionMethods(camel, pascal) {
  return `export const ${camel}Api = {
  execute: (body: Create${pascal}) => http.post<${pascal}>('/${camel}', body),
} as const;`;
}
function customMethods(camel) {
  return `export const ${camel}Api = {
  // TODO: add your API methods here
} as const;`;
}
function apiTs(camel, pascal, mode, useZod) {
  const imports = buildImports(camel, pascal, useZod, mode);
  let methods;
  switch (mode) {
    case "query":
      methods = queryMethods(camel, pascal);
      break;
    case "action":
      methods = actionMethods(camel, pascal);
      break;
    case "custom":
      methods = customMethods(camel);
      break;
    default:
      methods = crudMethods(camel, pascal);
  }
  return `${imports}

${methods}
`;
}
function apiSchemasTs(camel, pascal) {
  return `import { z } from 'zod';

export const ${camel}Schema = z.object({
  id:        z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const create${pascal}Schema = ${camel}Schema.omit({ id: true, createdAt: true, updatedAt: true });
export const update${pascal}Schema = create${pascal}Schema.partial();

export type ${pascal}       = z.infer<typeof ${camel}Schema>;
export type Create${pascal} = z.infer<typeof create${pascal}Schema>;
export type Update${pascal} = z.infer<typeof update${pascal}Schema>;
`;
}
function apiTypesTs(pascal) {
  return `export interface ${pascal} {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type Create${pascal} = Omit<${pascal}, 'id' | 'createdAt' | 'updatedAt'>;
export type Update${pascal} = Partial<Create${pascal}>;
`;
}
function apiIndexTs(camel, pascal, useZod) {
  const typesSource = useZod ? `./${camel}.schemas` : `./${camel}.types`;
  return `export { ${camel}Api } from './${camel}.api';
export type { ${pascal}, Create${pascal}, Update${pascal} } from '${typesSource}';
`;
}

// src/generators/api/index.ts
var apiGenerator = {
  type: "api",
  defaultBaseDir: "src/api",
  generate(ctx) {
    const { camelName, pascalName, outDir } = ctx;
    const mode = ctx.extra?.mode ?? "crud";
    const useZod = detectZod();
    const cwd = process.cwd();
    const files = [
      [`${camelName}.api.ts`, apiTs(camelName, pascalName, mode, useZod)],
      useZod ? [`${camelName}.schemas.ts`, apiSchemasTs(camelName, pascalName)] : [`${camelName}.types.ts`, apiTypesTs(pascalName)],
      ["index.ts", apiIndexTs(camelName, pascalName, useZod)]
    ];
    return files.map(([name, content]) => {
      const fullPath = path12.join(outDir, name);
      return { fullPath, relativePath: path12.relative(cwd, fullPath), content };
    });
  }
};
var api_default = apiGenerator;

// src/generators/registry.ts
var REGISTRY = /* @__PURE__ */ new Map([
  ["component", component_default],
  ["atom", atom_default],
  ["molecule", molecule_default],
  ["organism", organism_default],
  ["template", template_default],
  ["page", page_default],
  ["feature", feature_default],
  ["store", store_default],
  ["api", api_default]
]);
var GENERATOR_TYPES = [...REGISTRY.keys()];
function getGenerator(type) {
  const gen = REGISTRY.get(type);
  if (!gen) throw new Error(`Unknown generator type: "${type}". Valid types: ${GENERATOR_TYPES.join(", ")}`);
  return gen;
}
function isValidGeneratorType(value) {
  return REGISTRY.has(value);
}

// src/utils/file-utils.ts
import fs4 from "fs";
import path13 from "path";
import * as p2 from "@clack/prompts";
import chalk6 from "chalk";
function fileExists(filePath) {
  return fs4.existsSync(filePath);
}
async function writeGeneratedFiles(files, { dry, force }) {
  let created = 0;
  let skipped = 0;
  let overwritten = 0;
  for (const file of files) {
    if (dry) {
      log.dryFile(file.relativePath);
      created++;
      continue;
    }
    const exists = fileExists(file.fullPath);
    if (exists && !force) {
      const isTTY = Boolean(process.stdin.isTTY);
      if (!isTTY) {
        log.file("skip", file.relativePath);
        skipped++;
        continue;
      }
      const answer = await p2.confirm({
        message: chalk6.yellow(`${file.relativePath} already exists. Overwrite?`),
        initialValue: false
      });
      if (p2.isCancel(answer) || !answer) {
        log.file("skip", file.relativePath);
        skipped++;
        continue;
      }
    }
    fs4.mkdirSync(path13.dirname(file.fullPath), { recursive: true });
    fs4.writeFileSync(file.fullPath, file.content, "utf-8");
    if (exists) {
      log.file("overwrite", file.relativePath);
      overwritten++;
    } else {
      log.file("create", file.relativePath);
      created++;
    }
  }
  return { created, skipped, overwritten };
}

// src/utils/path-utils.ts
import path14 from "path";
function toPascalCase(str) {
  return str.replace(/[-_/](.)/g, (_, c) => c.toUpperCase()).replace(/^(.)/, (_, c) => c.toUpperCase());
}
function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
function toKebabCase(str) {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "").replace(/[_/]/g, "-");
}
function getBaseName(name) {
  return path14.basename(name.replace(/\\/g, "/"));
}
function resolveCwd(...segments) {
  return path14.resolve(process.cwd(), ...segments);
}

// src/commands/add.ts
var FEATURE_SUBDIRS = ["components", "hooks", "services", "store", "utils", "types"];
function parseAddArgs(argv) {
  const positional = [];
  let dir;
  let name;
  let dry = false;
  let force = false;
  const extra = {};
  for (const arg of argv) {
    if (arg.startsWith("--dir=")) {
      dir = arg.slice("--dir=".length);
    } else if (arg.startsWith("--name=")) {
      name = arg.slice("--name=".length);
    } else if (arg === "--dry") {
      dry = true;
    } else if (arg === "--force") {
      force = true;
    } else if (arg.startsWith("--with=")) {
      extra.with = arg.slice("--with=".length).split(",").map((s) => s.trim()).filter(Boolean);
    } else if (arg === "--with-test") {
      extra.withTest = true;
    } else if (arg === "--with-styles") {
      extra.withStyles = true;
    } else if (arg === "--with-story") {
      extra.withStory = true;
    } else if (arg === "--variants") {
      extra.withVariants = true;
    } else if (arg === "--crud") {
      extra.mode = "crud";
    } else if (arg === "--action") {
      extra.mode = "action";
    } else if (arg === "--query") {
      extra.mode = "query";
    } else if (arg === "--custom") {
      extra.mode = "custom";
    } else if (!arg.startsWith("--")) {
      positional.push(arg);
    }
  }
  return {
    type: positional[0],
    name: name ?? positional[1],
    dir,
    dry,
    force,
    extra: Object.keys(extra).length > 0 ? extra : void 0
  };
}
function printAddUsage() {
  console.log();
  console.log(chalk7.bold("  create-atom-stack add") + chalk7.dim(" <type> <name> [options]"));
  console.log();
  console.log(chalk7.dim("  Atomic Design generators:"));
  console.log("    " + chalk7.cyan("atom") + chalk7.dim("        Smallest reusable unit        src/components/atoms/"));
  console.log("    " + chalk7.cyan("molecule") + chalk7.dim("    Composed of atoms              src/components/molecules/"));
  console.log("    " + chalk7.cyan("organism") + chalk7.dim("    Self-contained section         src/components/organisms/"));
  console.log("    " + chalk7.cyan("template") + chalk7.dim("    Page layout / structural       src/components/templates/"));
  console.log("    " + chalk7.cyan("component") + chalk7.dim("   Generic \u2014 not Atomic Design     src/components/"));
  console.log();
  console.log(chalk7.dim("  App generators:"));
  console.log("    " + chalk7.cyan("page") + chalk7.dim("        Next.js App Router page          src/app/"));
  console.log("    " + chalk7.cyan("feature") + chalk7.dim("     Feature-first module dir        src/features/"));
  console.log("    " + chalk7.cyan("store") + chalk7.dim("       State store (auto-detects SM)   src/store/"));
  console.log("    " + chalk7.cyan("api") + chalk7.dim("         API module + types + schemas   src/api/"));
  console.log();
  console.log(chalk7.dim("  Component flags (atom / molecule / organism / template / component):"));
  console.log("    " + chalk7.dim("--variants       Add variant prop + data-variant attribute"));
  console.log("    " + chalk7.dim("--with-test      Generate a .test.tsx file"));
  console.log("    " + chalk7.dim("--with-styles    Generate a .styles.ts file"));
  console.log("    " + chalk7.dim("--with-story     Generate a .stories.tsx file"));
  console.log();
  console.log(chalk7.dim("  Feature flags:"));
  console.log("    " + chalk7.dim("--with=<dirs>    Comma-separated subdirs to scaffold (components,hooks,store,services,utils,types)"));
  console.log();
  console.log(chalk7.dim("  API flags:"));
  console.log("    " + chalk7.dim("--crud           Full CRUD (list, get, create, update, remove)   [default]"));
  console.log("    " + chalk7.dim("--query          Read-only (list, get)"));
  console.log("    " + chalk7.dim("--action         Single mutation (execute)"));
  console.log("    " + chalk7.dim("--custom         Empty shell \u2014 fill in your own methods"));
  console.log();
  console.log(chalk7.dim("  General options:"));
  console.log("    " + chalk7.dim("--dry           Show what would be generated without writing files"));
  console.log("    " + chalk7.dim("--force         Overwrite existing files without prompting"));
  console.log("    " + chalk7.dim("--dir=<path>    Override the default output directory"));
  console.log("    " + chalk7.dim("--name=<value>  Pass the name as a flag (avoids zsh bracket glob issues)"));
  console.log();
  console.log(chalk7.dim("  Examples:"));
  console.log("    npx create-atom-stack add atom Button");
  console.log("    npx create-atom-stack add atom Button --variants --with-test");
  console.log("    npx create-atom-stack add molecule SearchBar --with-story");
  console.log("    npx create-atom-stack add organism Navbar");
  console.log("    npx create-atom-stack add template DashboardLayout");
  console.log("    npx create-atom-stack add page dashboard/reports");
  console.log('    npx create-atom-stack add page "dashboard/[id]"                   ' + chalk7.dim("\u2190 quoted"));
  console.log('    npx create-atom-stack add page --name="dashboard/[id]"            ' + chalk7.dim("\u2190 flag form (no quoting needed in zsh)"));
  console.log("    npx create-atom-stack add feature billing                         " + chalk7.dim("\u2190 minimal index.ts only"));
  console.log("    npx create-atom-stack add feature billing --with=components,hooks  " + chalk7.dim("\u2190 with subdirs"));
  console.log("    npx create-atom-stack add store auth                " + chalk7.dim("\u2190 auto-detects Zustand/RTK/Jotai/MobX"));
  console.log("    npx create-atom-stack add api users                 " + chalk7.dim("\u2190 prompted for mode, auto-detects Zod"));
  console.log("    npx create-atom-stack add api users --crud");
  console.log("    npx create-atom-stack add api payments --action");
  console.log();
  console.log(chalk7.dim("  Shell note:"));
  console.log("    Dynamic route segments contain brackets: " + chalk7.yellow("[id]"));
  console.log("    zsh/bash treat brackets as glob chars \u2014 always quote them:");
  console.log("      " + chalk7.cyan('npx create-atom-stack add page "dashboard/[id]"'));
  console.log();
}
async function promptType() {
  const result = await p3.select({
    message: "What do you want to generate?",
    options: [
      { value: "atom", label: "atom", hint: "Atomic Design \u2014 smallest unit" },
      { value: "molecule", label: "molecule", hint: "Atomic Design \u2014 composed of atoms" },
      { value: "organism", label: "organism", hint: "Atomic Design \u2014 self-contained section" },
      { value: "template", label: "template", hint: "Atomic Design \u2014 page layout" },
      { value: "component", label: "component", hint: "Generic component" },
      { value: "page", label: "page", hint: "Next.js App Router page" },
      { value: "feature", label: "feature", hint: "Feature module directory" },
      { value: "store", label: "store", hint: "State store (auto-detects SM)" },
      { value: "api", label: "api", hint: "API module + types + schemas" }
    ]
  });
  if (p3.isCancel(result)) {
    p3.cancel("Cancelled.");
    process.exit(0);
  }
  return result;
}
async function promptName(type) {
  const placeholders = {
    component: "Button",
    atom: "Button",
    molecule: "SearchBar",
    organism: "Navbar",
    template: "DashboardLayout",
    page: "dashboard/reports",
    feature: "billing",
    store: "auth",
    api: "users"
  };
  const isPage = type === "page";
  const result = await p3.text({
    message: `Name for the ${type}?` + (isPage ? chalk7.dim('  (dynamic routes: dashboard/[id]  or  --name="dashboard/[id]")') : ""),
    placeholder: placeholders[type],
    validate: (v) => v.trim() ? void 0 : "Name is required."
  });
  if (p3.isCancel(result)) {
    p3.cancel("Cancelled.");
    process.exit(0);
  }
  return result;
}
async function promptFeatureDirs() {
  const result = await p3.multiselect({
    message: "Scaffold extra subdirectories? " + chalk7.dim("(optional \u2014 space to toggle)"),
    options: FEATURE_SUBDIRS.map((d) => ({ value: d, label: d })),
    required: false
  });
  if (p3.isCancel(result)) {
    p3.cancel("Cancelled.");
    process.exit(0);
  }
  return result;
}
async function promptApiMode() {
  const result = await p3.select({
    message: "API mode?",
    options: [
      { value: "crud", label: "crud", hint: "list \xB7 get \xB7 create \xB7 update \xB7 remove" },
      { value: "query", label: "query", hint: "list \xB7 get  (read-only)" },
      { value: "action", label: "action", hint: "single mutation (execute)" },
      { value: "custom", label: "custom", hint: "empty shell \u2014 fill in your own methods" }
    ]
  });
  if (p3.isCancel(result)) {
    p3.cancel("Cancelled.");
    process.exit(0);
  }
  return result;
}
function importHint(type, pascal, camel, outDir) {
  const rel = path15.relative(resolveCwd("src"), outDir).replace(/\\/g, "/");
  const alias = `@/${rel}`;
  switch (type) {
    case "component":
    case "atom":
    case "molecule":
    case "organism":
    case "template":
      return `import ${pascal} from '${alias}';`;
    case "page":
      return `// File-system route \u2014 no manual import needed.`;
    case "feature":
      return chalk7.dim(`# Add exports to src/${rel}/index.ts, then:`) + `
    import { ... } from '${alias}';`;
    case "store":
      return `import { use${pascal}Store } from '${alias}';  // Zustand
    import { ${camel}Actions } from '${alias}';           // RTK
    import { ${camel}Atom } from '${alias}';              // Jotai`;
    case "api":
      return `import { ${camel}Api } from '${alias}';`;
  }
}
async function runAddCommand(argv) {
  if (argv.includes("--help") || argv[0] === "--help") {
    printAddUsage();
    return;
  }
  let { type, name, dir, dry, force, extra } = parseAddArgs(argv);
  const isTTY = Boolean(process.stdin.isTTY);
  let introShown = false;
  const showIntro = () => {
    if (!introShown) {
      console.log();
      p3.intro(chalk7.bold.cyan("create-atom-stack") + chalk7.dim("  add generator"));
      introShown = true;
    }
  };
  if (!type || !isValidGeneratorType(type)) {
    if (!isTTY) {
      log.error(`Generator type is required. Valid types: ${GENERATOR_TYPES.join(", ")}`);
      process.exit(1);
    }
    showIntro();
    type = await promptType();
  }
  if (!name?.trim()) {
    if (!isTTY) {
      log.error("Name is required.");
      process.exit(1);
    }
    showIntro();
    name = await promptName(type);
  }
  if (type === "feature" && !extra?.with && isTTY) {
    showIntro();
    const dirs = await promptFeatureDirs();
    if (dirs.length > 0) {
      extra = { ...extra, with: dirs };
    }
  }
  if (type === "api" && !extra?.mode && isTTY) {
    showIntro();
    const mode = await promptApiMode();
    extra = { ...extra, mode };
  }
  const generator = getGenerator(type);
  const baseName = getBaseName(name);
  const pascalName = toPascalCase(baseName);
  const camelName = toCamelCase(baseName);
  const kebabName = toKebabCase(baseName);
  const baseDir = resolveCwd(dir ?? generator.defaultBaseDir);
  const outDir = path15.join(baseDir, name);
  const ctx = { rawName: name, pascalName, camelName, kebabName, outDir, dry, force, extra };
  const typeLabel = chalk7.bold.cyan(type);
  const nameLabel = chalk7.bold(name);
  if (dry) {
    log.section(`Dry run \u2014 ${typeLabel} ${nameLabel}`);
  } else {
    log.section(`Generating ${typeLabel} ${nameLabel}`);
  }
  const files = await Promise.resolve(generator.generate(ctx));
  const { created, skipped, overwritten } = await writeGeneratedFiles(files, { dry, force });
  console.log();
  if (dry) {
    log.warn(`No files written (dry run). Remove ${chalk7.bold("--dry")} to generate for real.`);
    console.log();
    return;
  }
  const parts = [];
  if (created) parts.push(chalk7.green(`${created} created`));
  if (overwritten) parts.push(chalk7.blue(`${overwritten} overwritten`));
  if (skipped) parts.push(chalk7.yellow(`${skipped} skipped`));
  log.success(`Done! ${parts.join(", ")}`);
  console.log();
  console.log("  " + chalk7.dim("Import:"));
  console.log("    " + chalk7.cyan(importHint(type, pascalName, camelName, outDir)));
  console.log();
}

// src/index.ts
var [, , rawName, ...flags] = process.argv;
function validateName(v) {
  if (!v) return "Project name is required.";
  if (!/^[a-z0-9][a-z0-9-_]*$/i.test(v))
    return "Must start with a letter/digit and contain only letters, numbers, hyphens, or underscores.";
}
function printUsage() {
  console.log();
  console.log(chalk8.bold("  create-atom-stack") + chalk8.dim(" <command> [options]"));
  console.log();
  console.log(chalk8.dim("  Commands:"));
  console.log("    " + chalk8.cyan("[project-name]") + chalk8.dim("       Scaffold a new Next.js project (default)"));
  console.log("    " + chalk8.cyan("add <type> <name>") + chalk8.dim("    Generate a component, page, feature, store, or api"));
  console.log();
  console.log(chalk8.dim("  Scaffold options:"));
  console.log(chalk8.dim("    --pm=<npm|pnpm|yarn|bun>                     Package manager (default: npm)"));
  console.log(chalk8.dim("    --state=<zustand|jotai|react-query|none>     State management (default: zustand)"));
  console.log(chalk8.dim("    --e2e=<playwright|cypress|none>              E2E framework (default: none)"));
  console.log(chalk8.dim("    --rxjs                                       Add RxJS (Observables + useObservable hook)"));
  console.log(chalk8.dim("    --xstate                                     Add XState (state machines + useMachine)"));
  console.log(chalk8.dim("    --skip-install                               Skip dependency install"));
  console.log(chalk8.dim("    --no-git                                     Skip git init"));
  console.log(chalk8.dim("    --help                                       Show this help"));
  console.log();
  console.log(chalk8.dim("  Examples:"));
  console.log("    npx create-atom-stack                       " + chalk8.dim("(interactive)"));
  console.log("    npx create-atom-stack my-app");
  console.log("    npx create-atom-stack my-app --pm=pnpm --state=react-query");
  console.log("    npx create-atom-stack add component Button");
  console.log("    npx create-atom-stack add page dashboard/reports");
  console.log("    npx create-atom-stack add --help            " + chalk8.dim("(generator help)"));
  console.log();
}
async function main() {
  if (rawName === "add") {
    await runAddCommand(flags);
    process.exit(0);
  }
  let projectName;
  let pm;
  let stateManagement;
  let e2e;
  let conventionalCommits;
  let advancedAddons;
  let skipInstall;
  let noGit;
  if (flags.includes("--help") || rawName === "--help") {
    printUsage();
    process.exit(0);
  }
  const hasDirectName = rawName && !rawName.startsWith("-");
  const isTTY = Boolean(process.stdin.isTTY);
  if (!hasDirectName && !isTTY) {
    console.error(chalk8.red("\n  Error: Project name is required in non-interactive mode.\n"));
    printUsage();
    process.exit(1);
  }
  if (hasDirectName) {
    const nameError = validateName(rawName);
    if (nameError) {
      console.error(chalk8.red(`
  Error: ${nameError}
`));
      process.exit(1);
    }
    projectName = rawName;
    pm = flags.find((f) => f.startsWith("--pm="))?.split("=")[1] ?? "npm";
    stateManagement = flags.find((f) => f.startsWith("--state="))?.split("=")[1] ?? "zustand";
    e2e = flags.find((f) => f.startsWith("--e2e="))?.split("=")[1] ?? "none";
    conventionalCommits = !flags.includes("--no-conventional-commits");
    advancedAddons = [
      ...flags.includes("--rxjs") ? ["rxjs"] : [],
      ...flags.includes("--xstate") ? ["xstate"] : []
    ];
    skipInstall = flags.includes("--skip-install");
    noGit = flags.includes("--no-git");
  } else {
    console.log();
    p4.intro(chalk8.bold.cyan("create-atom-stack") + chalk8.dim("  Atomic Next.js scaffold"));
    const nameAnswer = await p4.text({
      message: "Project name?",
      placeholder: "my-app",
      validate: validateName
    });
    if (p4.isCancel(nameAnswer)) {
      p4.cancel("Cancelled.");
      process.exit(0);
    }
    projectName = nameAnswer;
    const pmAnswer = await p4.select({
      message: "Package manager?",
      options: [
        { value: "npm", label: "npm" },
        { value: "pnpm", label: "pnpm" },
        { value: "yarn", label: "yarn" },
        { value: "bun", label: "bun" }
      ]
    });
    if (p4.isCancel(pmAnswer)) {
      p4.cancel("Cancelled.");
      process.exit(0);
    }
    pm = pmAnswer;
    const useDefaults = await p4.confirm({
      message: "Use recommended defaults?" + chalk8.dim("  (Zustand \xB7 no E2E \xB7 conventional commits \xB7 install now)"),
      initialValue: true
    });
    if (p4.isCancel(useDefaults)) {
      p4.cancel("Cancelled.");
      process.exit(0);
    }
    if (useDefaults) {
      stateManagement = "zustand";
      e2e = "none";
      conventionalCommits = true;
      advancedAddons = [];
      skipInstall = false;
      noGit = false;
    } else {
      const smAnswer = await p4.select({
        message: "State management?",
        options: [
          { value: "zustand", label: "Zustand", hint: "recommended" },
          { value: "jotai", label: "Jotai" },
          { value: "react-query", label: "TanStack Query", hint: "server state" },
          { value: "none", label: "none" }
        ]
      });
      if (p4.isCancel(smAnswer)) {
        p4.cancel("Cancelled.");
        process.exit(0);
      }
      stateManagement = smAnswer;
      const e2eAnswer = await p4.select({
        message: "E2E testing?",
        options: [
          { value: "none", label: "none" },
          { value: "playwright", label: "Playwright", hint: "recommended" },
          { value: "cypress", label: "Cypress" }
        ]
      });
      if (p4.isCancel(e2eAnswer)) {
        p4.cancel("Cancelled.");
        process.exit(0);
      }
      e2e = e2eAnswer;
      const ccAnswer = await p4.confirm({
        message: "Conventional commits? (husky + commitlint)",
        initialValue: true
      });
      if (p4.isCancel(ccAnswer)) {
        p4.cancel("Cancelled.");
        process.exit(0);
      }
      conventionalCommits = ccAnswer;
      const addonsAnswer = await p4.multiselect({
        message: "Advanced add-ons? (optional \u2014 space to select)",
        options: [
          { value: "rxjs", label: "RxJS", hint: "Observable streams + useObservable hook" },
          { value: "xstate", label: "XState", hint: "State machines + useMachine integration" }
        ],
        required: false
      });
      if (p4.isCancel(addonsAnswer)) {
        p4.cancel("Cancelled.");
        process.exit(0);
      }
      advancedAddons = addonsAnswer;
      const skipInstallAnswer = await p4.confirm({
        message: "Skip install?",
        initialValue: false
      });
      if (p4.isCancel(skipInstallAnswer)) {
        p4.cancel("Cancelled.");
        process.exit(0);
      }
      skipInstall = skipInstallAnswer;
      const noGitAnswer = await p4.confirm({
        message: "Skip git init?",
        initialValue: false
      });
      if (p4.isCancel(noGitAnswer)) {
        p4.cancel("Cancelled.");
        process.exit(0);
      }
      noGit = noGitAnswer;
    }
    p4.outro(chalk8.dim("Scaffolding\u2026"));
    console.log();
  }
  const spinner = ora2({ prefixText: "  " }).start("Scaffolding project...");
  createProject(projectName, { skipInstall, noGit, pm, stateManagement, e2e, conventionalCommits, advancedAddons, spinner }).catch((err) => {
    spinner.fail(chalk8.red("Failed: " + err.message));
    console.log();
    process.exit(1);
  });
}
main();
