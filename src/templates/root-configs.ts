export const tsconfigJson = JSON.stringify(
  {
    compilerOptions: {
      target: 'ES2017',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'react-jsx',
      incremental: true,
      plugins: [{ name: 'next' }],
      paths: { '@/*': ['./src/*'] },
    },
    include: [
      'next-env.d.ts',
      '**/*.ts',
      '**/*.tsx',
      '.next/types/**/*.ts',
      '.next/dev/types/**/*.ts',
      '**/*.mts',
    ],
    exclude: ['node_modules'],
  },
  null,
  2,
);

export const nextConfig = `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

export default nextConfig;
`;

export const postCssConfig = `const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
`;

export const prettierRc = JSON.stringify(
  {
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    tabWidth: 2,
    printWidth: 100,
    arrowParens: 'always',
    bracketSpacing: true,
    endOfLine: 'lf',
  },
  null,
  2,
);

export const prettierIgnore = `.next
node_modules
dist
out
build
public
*.min.js
*.min.css
`;

export const gitIgnore = `# Dependencies
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

export const nvmrc = `22.19.0
`;

export const npmrc = `engine-strict=true
`;

export const envExample = `# API base URL (server-side)
API_URL=http://localhost:3001

# API base URL (client-side)
NEXT_PUBLIC_API_URL=http://localhost:3001
`;

export const nextEnvDts = `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.
`;

export const jestConfig = `import type { Config } from 'jest';
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

export const jestSetup = `import '@testing-library/jest-dom';
`;
