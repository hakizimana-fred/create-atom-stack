#!/usr/bin/env node

// src/index.ts
import chalk2 from "chalk";
import ora from "ora";

// src/create.ts
import path from "path";
import fs from "fs";
import { execSync, spawn } from "child_process";
import chalk from "chalk";

// src/templates/package-json.ts
function packageJsonTemplate(name) {
  return JSON.stringify(
    {
      name,
      version: "0.1.0",
      private: true,
      engines: {
        node: ">=18.0.0",
        npm: ">=9.0.0"
      },
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "eslint",
        prettier: "prettier --write .",
        prepare: "husky",
        test: "jest",
        "test:watch": "jest --watch"
      },
      dependencies: {
        "lucide-react": "^0.474.0",
        next: "15.3.2",
        react: "19.1.0",
        "react-dom": "19.1.0",
        zustand: "^5.0.11"
      },
      devDependencies: {
        "@commitlint/cli": "^20.4.2",
        "@commitlint/config-conventional": "^20.4.2",
        "@commitlint/types": "^20.4.0",
        "@tailwindcss/postcss": "^4",
        "@testing-library/jest-dom": "^6.9.1",
        "@testing-library/react": "^16.3.2",
        "@testing-library/user-event": "^14.6.1",
        "@types/jest": "^30.0.0",
        "@types/node": "^20",
        "@types/react": "^19",
        "@types/react-dom": "^19",
        eslint: "^9",
        "eslint-config-next": "15.3.2",
        husky: "^9.1.7",
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
`;
var envExample = `# API base URL (server-side)
API_URL=http://localhost:3001

# API base URL (client-side)
NEXT_PUBLIC_API_URL=http://localhost:3001
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
};

export default createJestConfig(config);
`;
var jestSetup = `import '@testing-library/jest-dom';
`;

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
var huskyPreCommit = `npm run lint
`;
var huskyCommitMsg = `#!/usr/bin/env sh
npx --no -- commitlint --edit "$1"
`;
var huskyPrePush = `npm run build
`;
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
function rootLayout(projectName) {
  const title = projectName.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return `import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
          geistSans.variable,
          geistMono.variable,
          'antialiased font-sans text-base text-txt-primary bg-surface-page min-h-dvh',
        ].join(' ')}
      >
        {children}
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
\u2502   \u251C\u2500\u2500 api/client.ts        # typed fetch wrapper
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
\u2502   \u2502   \u251C\u2500\u2500 api/client.ts       Typed fetch wrapper (get/post/put/patch/delete)
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
var apiClient = `const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...init } = options;

  let url = BASE_URL + path;
  if (params) {
    const query = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    );
    url += '?' + query.toString();
  }

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...headers },
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error(body?.message ?? res.statusText), {
      status: res.status,
      code: body?.code,
    });
  }

  return res.json() as Promise<T>;
}

export const api = {
  get:    <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { method: 'GET', ...opts }),

  post:   <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body), ...opts }),

  put:    <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body), ...opts }),

  patch:  <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body), ...opts }),

  delete: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { method: 'DELETE', ...opts }),
};
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

// src/templates/index.ts
function getFileMap(projectName) {
  return {
    /* ── Root config files ─────────────────────────────────────────────── */
    "package.json": packageJsonTemplate(projectName),
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
    "next-env.d.ts": nextEnvDts,
    "jest.config.ts": jestConfig,
    "jest.setup.ts": jestSetup,
    /* ── Tooling ───────────────────────────────────────────────────────── */
    "eslint.config.mjs": eslintConfig,
    "commitlint.config.ts": commitlintConfig,
    ".releaserc": releaserc,
    /* ── Husky hooks ───────────────────────────────────────────────────── */
    ".husky/pre-commit": huskyPreCommit,
    ".husky/commit-msg": huskyCommitMsg,
    ".husky/pre-push": huskyPrePush,
    /* ── VSCode ────────────────────────────────────────────────────────── */
    ".vscode/settings.json": vsCodeSettings,
    ".vscode/launch.json": vsCodeLaunch,
    ".vscode/extensions.json": vsCodeExtensions,
    /* ── App ───────────────────────────────────────────────────────────── */
    "src/app/globals.css": globalsCss,
    "src/app/layout.tsx": rootLayout(projectName),
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
    /* ── Store ─────────────────────────────────────────────────────────── */
    "src/store/ui.store.ts": uiStore,
    /* ── Types ─────────────────────────────────────────────────────────── */
    "src/types/common.ts": commonTypes,
    "src/types/index.ts": typesIndex,
    /* ── Lib ───────────────────────────────────────────────────────────── */
    "src/lib/utils/cn.ts": cnUtil,
    "src/lib/utils/format.ts": formatUtil,
    "src/lib/api/client.ts": apiClient,
    /* ── Hooks ─────────────────────────────────────────────────────────── */
    "src/hooks/use-scroll-state.ts": useScrollState,
    /* ── Data ──────────────────────────────────────────────────────────── */
    "src/data/constants/navigation.ts": navigationConstants,
    /* ── Docs ──────────────────────────────────────────────────────────── */
    "ARCHITECTURE.md": architectureMd(projectName),
    "docs/getting-started.md": gettingStartedMd(projectName),
    "docs/design-system.md": designSystemMd()
  };
}

// src/create.ts
var INSTALL_PHASES = [
  "Resolving dependency tree",
  "Fetching packages from registry",
  "Verifying package integrity",
  "Linking dependencies",
  "Building package graph",
  "Running lifecycle scripts"
];
function npmInstall(cwd, spinner2) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let phaseIdx = 0;
    const elapsed = () => chalk.dim(` \xB7 ${Math.round((Date.now() - startTime) / 1e3)}s`);
    spinner2.text = INSTALL_PHASES[0] + elapsed();
    const phaseTick = setInterval(() => {
      phaseIdx = (phaseIdx + 1) % INSTALL_PHASES.length;
      spinner2.text = INSTALL_PHASES[phaseIdx] + elapsed();
    }, 3e3);
    const child = spawn("npm", ["install"], {
      cwd,
      stdio: ["ignore", "pipe", "pipe"]
    });
    let lastPkgUpdate = 0;
    const onChunk = (chunk) => {
      const text = chunk.toString();
      const now = Date.now();
      const summary = text.match(/added (\d+) packages/i);
      if (summary) {
        clearInterval(phaseTick);
        spinner2.text = chalk.white(`Added ${summary[1]} packages`) + elapsed();
        return;
      }
      if (now - lastPkgUpdate < 400) return;
      const pkg = text.match(/reify:(@?[a-z][a-z0-9._-]*(?:\/[a-z0-9._-]+)?)/i);
      if (pkg) {
        lastPkgUpdate = now;
        spinner2.text = chalk.dim("\u21B3 ") + chalk.white(pkg[1]) + elapsed();
      }
    };
    child.stdout?.on("data", onChunk);
    child.stderr?.on("data", onChunk);
    child.on("close", (code) => {
      clearInterval(phaseTick);
      if (code === 0) resolve();
      else reject(new Error(`npm install exited with code ${code}`));
    });
    child.on("error", (err) => {
      clearInterval(phaseTick);
      reject(err);
    });
  });
}
async function createProject(projectName, { skipInstall: skipInstall2, spinner: spinner2 }) {
  const projectDir = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(projectDir)) {
    throw new Error(
      `Directory "${projectName}" already exists. Choose a different name or remove it first.`
    );
  }
  spinner2.text = "Creating project directory...";
  fs.mkdirSync(projectDir, { recursive: true });
  const fileMap = getFileMap(projectName);
  const entries = Object.entries(fileMap);
  const total = entries.length;
  let written = 0;
  spinner2.text = `Writing files... [0/${total}]`;
  for (const [filePath, content] of entries) {
    const fullPath = path.join(projectDir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, "utf-8");
    written++;
    spinner2.text = `Writing files... [${written}/${total}]`;
  }
  for (const hook of [".husky/pre-commit", ".husky/commit-msg", ".husky/pre-push"]) {
    const hookPath = path.join(projectDir, hook);
    if (fs.existsSync(hookPath)) fs.chmodSync(hookPath, 493);
  }
  spinner2.succeed(chalk.green(`${written} files written`));
  if (!skipInstall2) {
    spinner2.start(INSTALL_PHASES[0]);
    try {
      await npmInstall(projectDir, spinner2);
      spinner2.succeed(chalk.green("Dependencies installed"));
    } catch {
      spinner2.warn(chalk.yellow("npm install failed \u2014 run it manually inside the project"));
    }
    spinner2.start("Initializing git repository...");
    try {
      execSync("git init", { cwd: projectDir, stdio: "pipe" });
      spinner2.text = "Installing git hooks (husky)...";
      execSync("npm run prepare", { cwd: projectDir, stdio: "pipe" });
      spinner2.succeed(chalk.green("Git initialized + hooks installed"));
    } catch {
      spinner2.warn(
        chalk.yellow('Git setup skipped \u2014 run "git init && npm run prepare" manually')
      );
    }
  }
  const nextStep = skipInstall2 ? [`cd ${projectName}`, "npm install", "npm run dev"] : [`cd ${projectName}`, "npm run dev"];
  console.log();
  console.log(
    "  " + chalk.bold.green("\u2713 Ready!") + "  " + chalk.dim(`${projectName} is scaffolded.`)
  );
  console.log();
  console.log("  " + chalk.dim("Stack:  ") + chalk.white("Next.js 15 \xB7 TypeScript \xB7 Tailwind CSS v4 \xB7 Zustand"));
  console.log("  " + chalk.dim("Design: ") + chalk.white("Atomic Design (atoms \u2192 molecules \u2192 organisms)"));
  console.log("  " + chalk.dim("DX:     ") + chalk.white("ESLint \xB7 Prettier \xB7 Husky \xB7 Commitlint \xB7 Jest"));
  console.log();
  console.log("  " + chalk.dim("Next steps:"));
  for (const step of nextStep) {
    console.log("    " + chalk.cyan("$ " + step));
  }
  console.log();
}

// src/index.ts
var [, , rawName, ...flags] = process.argv;
function printUsage() {
  console.log();
  console.log(chalk2.bold("  create-atom-stack") + chalk2.dim(" <project-name> [options]"));
  console.log();
  console.log(chalk2.dim("  Options:"));
  console.log(chalk2.dim("    --skip-install   Skip npm install"));
  console.log();
  console.log(chalk2.dim("  Example:"));
  console.log("    npx create-atom-stack my-app");
  console.log();
}
if (!rawName || rawName.startsWith("-")) {
  console.error(chalk2.red("\n  Error: Project name is required.\n"));
  printUsage();
  process.exit(1);
}
if (!/^[a-z0-9][a-z0-9-_]*$/i.test(rawName)) {
  console.error(chalk2.red("\n  Error: Project name must start with a letter/digit and contain only letters, numbers, hyphens, and underscores.\n"));
  process.exit(1);
}
var skipInstall = flags.includes("--skip-install");
console.log();
console.log("  " + chalk2.bold.cyan("create-atom-stack"));
console.log("  " + chalk2.dim("Atomic Next.js scaffold"));
console.log();
var spinner = ora({ prefixText: "  " }).start("Scaffolding project...");
createProject(rawName, { skipInstall, spinner }).catch((err) => {
  spinner.fail(chalk2.red("Failed: " + err.message));
  console.log();
  process.exit(1);
});
