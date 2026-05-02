import { packageJsonTemplate } from './package-json.js';
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
  commonTypes,
  typesIndex,
  cnUtil,
  formatUtil,
  apiClient,
  useScrollState,
  navigationConstants,
} from './state-and-utils.js';
import { architectureMd, gettingStartedMd, designSystemMd } from './docs.js';

export type FileMap = Record<string, string>;

export function getFileMap(projectName: string): FileMap {
  return {
    /* ── Root config files ─────────────────────────────────────────────── */
    'package.json':            packageJsonTemplate(projectName),
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
    'next-env.d.ts':           nextEnvDts,
    'jest.config.ts':          jestConfig,
    'jest.setup.ts':           jestSetup,

    /* ── Tooling ───────────────────────────────────────────────────────── */
    'eslint.config.mjs':       eslintConfig,
    'commitlint.config.ts':    commitlintConfig,
    '.releaserc':              releaserc,

    /* ── Husky hooks ───────────────────────────────────────────────────── */
    '.husky/pre-commit':       huskyPreCommit,
    '.husky/commit-msg':       huskyCommitMsg,
    '.husky/pre-push':         huskyPrePush,

    /* ── VSCode ────────────────────────────────────────────────────────── */
    '.vscode/settings.json':   vsCodeSettings,
    '.vscode/launch.json':     vsCodeLaunch,
    '.vscode/extensions.json': vsCodeExtensions,

    /* ── App ───────────────────────────────────────────────────────────── */
    'src/app/globals.css':       globalsCss,
    'src/app/layout.tsx':        rootLayout(projectName),
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

    /* ── Store ─────────────────────────────────────────────────────────── */
    'src/store/ui.store.ts': uiStore,

    /* ── Types ─────────────────────────────────────────────────────────── */
    'src/types/common.ts': commonTypes,
    'src/types/index.ts':  typesIndex,

    /* ── Lib ───────────────────────────────────────────────────────────── */
    'src/lib/utils/cn.ts':     cnUtil,
    'src/lib/utils/format.ts': formatUtil,
    'src/lib/api/client.ts':   apiClient,

    /* ── Hooks ─────────────────────────────────────────────────────────── */
    'src/hooks/use-scroll-state.ts': useScrollState,

    /* ── Data ──────────────────────────────────────────────────────────── */
    'src/data/constants/navigation.ts': navigationConstants,

    /* ── Docs ──────────────────────────────────────────────────────────── */
    'ARCHITECTURE.md':         architectureMd(projectName),
    'docs/getting-started.md': gettingStartedMd(projectName),
    'docs/design-system.md':   designSystemMd(),
  };
}
