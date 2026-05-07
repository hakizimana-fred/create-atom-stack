export type StateManagement = 'zustand' | 'jotai' | 'react-query' | 'none';
export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';
export type E2EFramework = 'playwright' | 'cypress' | 'none';
export type AdvancedAddon = 'rxjs' | 'xstate';

export interface ScaffoldOptions {
  pm: PackageManager;
  stateManagement: StateManagement;
  e2e: E2EFramework;
  conventionalCommits: boolean;
  advancedAddons: AdvancedAddon[];
}

export function packageJsonTemplate(name: string, opts: ScaffoldOptions): string {
  const expectedPackageManager = opts.pm;
  const packageManagerCheck =
    "node -e \"const ua=process.env.npm_config_user_agent||''; const pm='" +
    expectedPackageManager +
    "/'; if (!ua.startsWith(pm)) { console.error('Use " +
    expectedPackageManager +
    " to install dependencies.'); process.exit(1); }\"";

  const stateDep: Record<string, string> =
    opts.stateManagement === 'zustand'      ? { zustand: '^5.0.11' }
    : opts.stateManagement === 'jotai'      ? { jotai: '^2.11.3' }
    : opts.stateManagement === 'react-query' ? { '@tanstack/react-query': '^5.80.2' }
    : {};

  const advancedDeps: Record<string, string> = {
    ...(opts.advancedAddons.includes('rxjs')   ? { rxjs: '^7.8.2' } : {}),
    ...(opts.advancedAddons.includes('xstate') ? { xstate: '^5.19.4', '@xstate/react': '^4.1.3' } : {}),
  };

  const e2eDep: Record<string, string> =
    opts.e2e === 'playwright' ? { '@playwright/test': '^1.52.0' }
    : opts.e2e === 'cypress'  ? { cypress: '^13.17.0' }
    : {};

  const e2eScripts: Record<string, string> =
    opts.e2e === 'playwright'
      ? {
          'test:e2e':        'playwright test',
          'test:e2e:ui':     'playwright test --ui',
          'test:e2e:headed': 'playwright test --headed',
        }
    : opts.e2e === 'cypress'
      ? {
          'test:e2e':      'cypress run',
          'test:e2e:open': 'cypress open',
        }
    : {};

  const engines: Record<string, string> = { node: '>=18.0.0' };
  if (opts.pm === 'npm')  engines.npm  = '>=9.0.0';
  if (opts.pm === 'pnpm') engines.pnpm = '>=9.0.0';
  if (opts.pm === 'yarn') engines.yarn = '>=1.22.0';
  if (opts.pm === 'bun')  engines.bun  = '>=1.0.0';

  return JSON.stringify(
    {
      name,
      version: '0.1.0',
      private: true,
      engines,
      scripts: {
        preinstall: packageManagerCheck,
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'eslint',
        prettier: 'prettier --write .',
        ...(opts.conventionalCommits ? { prepare: 'husky' } : {}),
        test: 'jest',
        'test:watch': 'jest --watch',
        ...e2eScripts,
      },
      dependencies: {
        geist: '^1.3.1',
        'lucide-react': '^0.474.0',
        next: '15.3.8',
        react: '19.1.0',
        'react-dom': '19.1.0',
        ...stateDep,
        ...advancedDeps,
      },
      devDependencies: {
        ...(opts.conventionalCommits ? {
          '@commitlint/cli': '^20.4.2',
          '@commitlint/config-conventional': '^20.4.2',
          '@commitlint/types': '^20.4.0',
        } : {}),
        '@tailwindcss/postcss': '^4',
        '@testing-library/jest-dom': '^6.9.1',
        '@testing-library/react': '^16.3.2',
        '@testing-library/user-event': '^14.6.1',
        '@types/jest': '^30.0.0',
        '@types/node': '^20',
        '@types/react': '^19',
        '@types/react-dom': '^19',
        ...e2eDep,
        eslint: '^9',
        'eslint-config-next': '15.3.8',
        ...(opts.conventionalCommits ? { husky: '^9.1.7' } : {}),
        jest: '^30.0.0',
        'jest-environment-jsdom': '^30.0.0',
        prettier: '^3.8.1',
        tailwindcss: '^4',
        'ts-jest': '^29.4.9',
        typescript: '^5',
      },
    },
    null,
    2,
  );
}
