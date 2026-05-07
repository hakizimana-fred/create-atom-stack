import { packageJsonTemplate, type ScaffoldOptions } from './package-json.js';
import {
  rxCounterService,
  useObservable,
  toggleMachineTemplate,
  useToggleMachine,
} from './advanced.js';
import {
  tsconfigJson,
  nextConfig,
  postCssConfig,
  prettierRc,
  prettierIgnore,
  gitIgnore,
  nvmrc,
  npmrc,
  envExample,
  nextEnvDts,
  jestConfig,
  jestSetup,
  playwrightConfig,
} from './root-configs.js';
import {
  eslintConfig,
  commitlintConfig,
  releaserc,
  huskyPreCommit,
  huskyCommitMsg,
  huskyPrePush,
  vsCodeSettings,
  vsCodeLaunch,
  vsCodeExtensions,
} from './tooling.js';

import { tailwindConfig, globalsCss } from './tailwind-and-styles.js';
import { rootLayout, rootPage, docsPage } from './app-files.js';
import { buttonAtom, badgeAtom, cardAtom, inputAtom, loadingAtom, typographyAtom } from './atoms.js';
import { codeBlockMolecule, featureCardMolecule, paginationMolecule } from './molecules.js';
import { headerOrganism, footerOrganism } from './organisms.js';
import {
  colorsToken,
  typographyToken,
  spacingToken,
  radiusToken,
  shadowsToken,
} from './design-tokens.js';
import {
  uiStore,
  jotaiStore,
  reactQueryProviders,
  usePostsQuery,
  commonTypes,
  typesIndex,
  cnUtil,
  formatUtil,
  apiClient,
  useScrollState,
  navigationConstants,
} from './state-and-utils.js';
import { architectureMd, gettingStartedMd, designSystemMd } from './docs.js';
import {
  homeSpec,
  docsSpec,
  cypressConfig,
  cypressSupport,
  cypressHomeSpec,
  cypressDocsSpec,
} from './e2e.js';

export type { ScaffoldOptions };
export type FileMap = Record<string, string>;

export function getFileMap(projectName: string, opts: ScaffoldOptions): FileMap {
  const storeFile =
    opts.stateManagement === 'zustand' ? uiStore
    : opts.stateManagement === 'jotai'  ? jotaiStore
    : null;

  const withRxjs   = opts.advancedAddons.includes('rxjs');
  const withXstate = opts.advancedAddons.includes('xstate');

  return {
    /* ── Root config files ─────────────────────────────────────────────── */
    'package.json':            packageJsonTemplate(projectName, opts),
    'tsconfig.json':           tsconfigJson,
    'next.config.ts':          nextConfig,
    'postcss.config.mjs':      postCssConfig,
    'tailwind.config.ts':      tailwindConfig,
    '.prettierrc':             prettierRc,
    '.prettierignore':         prettierIgnore,
    '.gitignore':              gitIgnore,
    '.nvmrc':                  nvmrc,
    '.npmrc':                  npmrc,
    '.env.example':            envExample,
    /* yarn berry requires a lockfile at the project root to stop upward traversal,
       and nodeLinker: node-modules for Next.js / jest compatibility */
    ...(opts.pm === 'yarn' ? {
      'yarn.lock':    '',
      '.yarnrc.yml':  [
        'nodeLinker: node-modules',
        'npmRegistryServer: "https://registry.npmjs.org"',
        'httpTimeout: 300000',
        'httpRetry: 5',
        'networkConcurrency: 4',
        '',
      ].join('\n'),
    } : {}),
    'next-env.d.ts':           nextEnvDts,
    'jest.config.ts':          jestConfig,
    'jest.setup.ts':           jestSetup,

    /* ── Tooling ───────────────────────────────────────────────────────── */
    'eslint.config.mjs':       eslintConfig,
    ...(opts.conventionalCommits ? {
      'commitlint.config.ts':  commitlintConfig,
      '.releaserc':            releaserc,
      '.husky/pre-commit':     huskyPreCommit(opts.pm),
      '.husky/commit-msg':     huskyCommitMsg,
      '.husky/pre-push':       huskyPrePush(opts.pm),
    } : {}),

    /* ── VSCode ────────────────────────────────────────────────────────── */
    '.vscode/settings.json':   vsCodeSettings,
    '.vscode/launch.json':     vsCodeLaunch,
    '.vscode/extensions.json': vsCodeExtensions,

    /* ── App ───────────────────────────────────────────────────────────── */
    'src/app/globals.css':       globalsCss,
    'src/app/layout.tsx':        rootLayout(projectName, opts.stateManagement === 'react-query'),
    'src/app/page.tsx':          rootPage,
    'src/app/docs/page.tsx':     docsPage,

    /* ── Atoms ─────────────────────────────────────────────────────────── */
    'src/components/atoms/button/index.tsx':     buttonAtom,
    'src/components/atoms/badge/index.tsx':      badgeAtom,
    'src/components/atoms/card/index.tsx':       cardAtom,
    'src/components/atoms/input/index.tsx':      inputAtom,
    'src/components/atoms/loading/index.tsx':    loadingAtom,
    'src/components/atoms/typography/index.tsx': typographyAtom,

    /* ── Molecules ─────────────────────────────────────────────────────── */
    'src/components/molecules/code-block/index.tsx':   codeBlockMolecule,
    'src/components/molecules/feature-card/index.tsx': featureCardMolecule,
    'src/components/molecules/pagination/index.tsx':   paginationMolecule,

    /* ── Organisms ─────────────────────────────────────────────────────── */
    'src/components/organisms/header/index.tsx': headerOrganism,
    'src/components/organisms/footer/index.tsx': footerOrganism,

    /* ── Design tokens ─────────────────────────────────────────────────── */
    'src/design-system/tokens/colors.ts':     colorsToken,
    'src/design-system/tokens/typography.ts': typographyToken,
    'src/design-system/tokens/spacing.ts':    spacingToken,
    'src/design-system/tokens/radius.ts':     radiusToken,
    'src/design-system/tokens/shadows.ts':    shadowsToken,

    /* ── Store / server-state ─────────────────────────────────────────── */
    ...(storeFile ? { 'src/store/ui.store.ts': storeFile } : {}),
    ...(opts.stateManagement === 'react-query' ? {
      'src/lib/providers.tsx':        reactQueryProviders,
      'src/hooks/use-posts.ts':        usePostsQuery,
    } : {}),

    /* ── Types ─────────────────────────────────────────────────────────── */
    'src/types/common.ts': commonTypes,
    'src/types/index.ts':  typesIndex,

    /* ── Lib ───────────────────────────────────────────────────────────── */
    'src/lib/utils/cn.ts':     cnUtil,
    'src/lib/utils/format.ts': formatUtil,
    'src/lib/api/client.ts':   apiClient,

    /* ── Hooks ─────────────────────────────────────────────────────────── */
    'src/hooks/use-scroll-state.ts': useScrollState,
    ...(withRxjs   ? { 'src/hooks/use-observable.ts': useObservable } : {}),
    ...(withXstate ? { 'src/hooks/use-toggle-machine.ts': useToggleMachine } : {}),

    /* ── Advanced add-ons ─────────────────────────────────────────────── */
    ...(withRxjs ? {
      'src/lib/rx/counter.service.ts': rxCounterService,
    } : {}),
    ...(withXstate ? {
      'src/lib/machines/toggle.machine.ts': toggleMachineTemplate,
    } : {}),

    /* ── Data ──────────────────────────────────────────────────────────── */
    'src/data/constants/navigation.ts': navigationConstants,

    /* ── E2E tests ─────────────────────────────────────────────────────── */
    ...(opts.e2e === 'playwright' ? {
      'playwright.config.ts': playwrightConfig(opts.pm),
      'e2e/home.spec.ts':     homeSpec,
      'e2e/docs.spec.ts':     docsSpec,
    } : {}),
    ...(opts.e2e === 'cypress' ? {
      'cypress.config.ts':       cypressConfig,
      'cypress/support/e2e.ts':  cypressSupport,
      'cypress/e2e/home.cy.ts':  cypressHomeSpec,
      'cypress/e2e/docs.cy.ts':  cypressDocsSpec,
    } : {}),

    /* ── Docs ──────────────────────────────────────────────────────────── */
    'ARCHITECTURE.md':         architectureMd(projectName),
    'docs/getting-started.md': gettingStartedMd(projectName),
    'docs/design-system.md':   designSystemMd(),
  };
}
