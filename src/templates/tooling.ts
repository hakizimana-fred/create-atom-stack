export const eslintConfig = `import { defineConfig, globalIgnores } from 'eslint/config';
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

export const commitlintConfig = `import type { UserConfig } from '@commitlint/types';

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

export const releaserc = JSON.stringify(
  {
    branches: ['main', 'master', { name: 'v*-Alpha', prerelease: 'alpha' }],
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      '@semantic-release/changelog',
      '@semantic-release/github',
      [
        '@semantic-release/git',
        {
          assets: ['CHANGELOG.md', 'package.json'],
          message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
        },
      ],
    ],
  },
  null,
  2,
);

export const huskyPreCommit = `npm run lint
`;

export const huskyCommitMsg = `#!/usr/bin/env sh
npx --no -- commitlint --edit "$1"
`;

export const huskyPrePush = `npm run build
`;

export const vsCodeSettings = JSON.stringify(
  {
    'editor.defaultFormatter': 'esbenp.prettier-vscode',
    'editor.formatOnSave': true,
    'editor.formatOnPaste': true,
    'editor.codeActionsOnSave': {
      'source.fixAll': 'never',
      'source.fixAll.eslint': 'explicit',
      'source.organizeImports': 'never',
    },
    'files.trimTrailingWhitespace': true,
    'files.insertFinalNewline': true,
    'typescript.preferences.importModuleSpecifier': 'non-relative',
    'typescript.tsdk': 'node_modules/typescript/lib',
    'editor.rulers': [100],
  },
  null,
  2,
);

export const vsCodeLaunch = JSON.stringify(
  {
    version: '0.1.0',
    configurations: [
      {
        name: 'Next.js: debug server-side',
        type: 'node-terminal',
        request: 'launch',
        command: 'npm run dev',
      },
      {
        name: 'Next.js: debug client-side',
        type: 'pwa-chrome',
        request: 'launch',
        url: 'http://localhost:3000',
      },
      {
        name: 'Next.js: debug full stack',
        type: 'node-terminal',
        request: 'launch',
        command: 'npm run dev',
        console: 'integratedTerminal',
        serverReadyAction: {
          pattern: 'started server on .+, url: (https?://.+)',
          uriFormat: '%s',
          action: 'debugWithChrome',
        },
      },
    ],
  },
  null,
  2,
);

export const vsCodeExtensions = JSON.stringify(
  {
    recommendations: [
      'esbenp.prettier-vscode',
      'dbaeumer.vscode-eslint',
      'bradlc.vscode-tailwindcss',
      'ms-vscode.vscode-typescript-next',
      'formulahendry.auto-rename-tag',
    ],
  },
  null,
  2,
);
