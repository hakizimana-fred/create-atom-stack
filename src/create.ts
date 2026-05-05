import path from 'path';
import fs from 'fs';
import { execSync, spawn } from 'child_process';
import chalk from 'chalk';
import type { Ora } from 'ora';
import { getFileMap } from './templates/index.js';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';
export type StateManagement = 'zustand' | 'jotai' | 'none';
export type E2EFramework = 'playwright' | 'cypress' | 'none';

interface CreateOptions {
  skipInstall: boolean;
  pm: PackageManager;
  stateManagement: StateManagement;
  e2e: E2EFramework;
  conventionalCommits: boolean;
  spinner: Ora;
}

/* ─── PM config ──────────────────────────────────────────────────────────── */

const PM_INSTALL: Record<PackageManager, string[]> = {
  npm:  ['npm', 'install'],
  pnpm: ['pnpm', 'install'],
  yarn: ['yarn', 'install'],
  bun:  ['bun', 'install'],
};

const PM_RUN: Record<PackageManager, (script: string) => string[]> = {
  npm:  (s) => ['npm', 'run', s],
  pnpm: (s) => ['pnpm', s],
  yarn: (s) => ['yarn', s],
  bun:  (s) => ['bun', 'run', s],
};

const PM_SUMMARY_RE: Record<PackageManager, RegExp> = {
  npm:  /added (\d+) packages/i,
  pnpm: /packages are hard linked|Packages: \+(\d+)/i,
  yarn: /success Saved (\d+) new packages|Done in/i,
  bun:  /(\d+) packages? installed/i,
};

function isPMAvailable(pm: PackageManager): boolean {
  try {
    execSync(`${pm} --version`, { stdio: 'pipe', shell: true });
    return true;
  } catch {
    return false;
  }
}

const INSTALL_PHASES = [
  'Resolving dependency tree',
  'Fetching packages from registry',
  'Verifying package integrity',
  'Linking dependencies',
  'Building package graph',
  'Running lifecycle scripts',
];

/* ─── Streaming install ──────────────────────────────────────────────────── */

function runInstall(pm: PackageManager, cwd: string, spinner: Ora): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let phaseIdx = 0;

    const elapsed = () => chalk.dim(` · ${Math.round((Date.now() - startTime) / 1000)}s`);

    spinner.text = INSTALL_PHASES[0] + elapsed();

    const phaseTick = setInterval(() => {
      phaseIdx = (phaseIdx + 1) % INSTALL_PHASES.length;
      spinner.text = INSTALL_PHASES[phaseIdx] + elapsed();
    }, 3_000);

    const [bin, ...args] = PM_INSTALL[pm];
    // shell:true ensures PATH is resolved through the user's shell,
    // so pnpm/yarn/bun installed via corepack or custom locations are found.
    const child = spawn(`${bin} ${args.join(' ')}`, [], {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    });

    const errorLines: string[] = [];
    let lastPkgUpdate = 0;

    const onChunk = (chunk: Buffer) => {
      const text = chunk.toString();
      const now = Date.now();

      // Collect error lines for better failure reporting
      for (const line of text.split('\n')) {
        if (/ERR_|error|Error/i.test(line) && line.trim()) {
          errorLines.push(line.trim());
        }
      }

      const summary = text.match(PM_SUMMARY_RE[pm]);
      if (summary) {
        clearInterval(phaseTick);
        const count = summary[1] ?? '';
        spinner.text = chalk.white(count ? `Installed ${count} packages` : 'Packages installed') + elapsed();
        return;
      }

      if (pm === 'npm') {
        if (now - lastPkgUpdate < 400) return;
        const pkg = text.match(/reify:(@?[a-z][a-z0-9._-]*(?:\/[a-z0-9._-]+)?)/i);
        if (pkg) {
          lastPkgUpdate = now;
          spinner.text = chalk.dim('↳ ') + chalk.white(pkg[1]) + elapsed();
        }
      }
    };

    child.stdout?.on('data', onChunk);
    child.stderr?.on('data', onChunk);

    child.on('close', (code) => {
      clearInterval(phaseTick);
      if (code === 0) {
        resolve();
      } else {
        const detail = errorLines.slice(-3).join(' | ');
        reject(new Error(detail || `${pm} install exited with code ${code}`));
      }
    });

    child.on('error', (err) => {
      clearInterval(phaseTick);
      reject(err);
    });
  });
}

/* ─── Playwright browser install ─────────────────────────────────────────── */

function installPlaywrightBrowsers(cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'node',
      ['node_modules/.bin/playwright', 'install', 'chromium'],
      { cwd, stdio: 'pipe' },
    );
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`playwright install exited with code ${code}`))));
    child.on('error', reject);
  });
}

/* ─── Main scaffold ──────────────────────────────────────────────────────── */

export async function createProject(
  projectName: string,
  { skipInstall, pm, stateManagement, e2e, conventionalCommits, spinner }: CreateOptions,
) {
  const projectDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(projectDir)) {
    throw new Error(
      `Directory "${projectName}" already exists. Choose a different name or remove it first.`,
    );
  }

  // ── Step 1: Write template files ─────────────────────────────────────────
  spinner.text = 'Creating project directory...';
  fs.mkdirSync(projectDir, { recursive: true });

  const fileMap = getFileMap(projectName, { pm, stateManagement, e2e, conventionalCommits });
  const entries = Object.entries(fileMap);
  const total = entries.length;
  let written = 0;

  spinner.text = `Writing files... [0/${total}]`;

  for (const [filePath, content] of entries) {
    const fullPath = path.join(projectDir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf-8');
    written++;
    spinner.text = `Writing files... [${written}/${total}]`;
  }

  for (const hook of ['.husky/pre-commit', '.husky/commit-msg', '.husky/pre-push']) {
    const hookPath = path.join(projectDir, hook);
    if (fs.existsSync(hookPath)) fs.chmodSync(hookPath, 0o755);
  }

  spinner.succeed(chalk.green(`${written} files written`));

  if (skipInstall) {
    printDone(projectName, pm, stateManagement, e2e, conventionalCommits, true);
    return;
  }

  // ── Step 2: Install dependencies ─────────────────────────────────────────
  if (!isPMAvailable(pm)) {
    spinner.warn(
      chalk.yellow(
        `"${pm}" is not installed or not in PATH. Install it first: https://` +
        (pm === 'pnpm' ? 'pnpm.io/installation'
        : pm === 'yarn' ? 'yarnpkg.com/getting-started/install'
        : 'bun.sh/docs/installation'),
      ),
    );
    printDone(projectName, pm, stateManagement, e2e, conventionalCommits, true);
    return;
  }

  spinner.start(INSTALL_PHASES[0]);
  try {
    await runInstall(pm, projectDir, spinner);
    spinner.succeed(chalk.green('Dependencies installed'));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    spinner.fail(chalk.red(`${pm} install failed`));
    console.log();
    console.log('  ' + chalk.yellow('⚠ Install error:') + chalk.dim(' ' + msg));
    console.log('  ' + chalk.dim('Retry from inside the project:'));
    console.log('    ' + chalk.cyan(`$ cd ${projectName}`));
    console.log('    ' + chalk.cyan(`$ ${pm === 'npm' ? 'npm install' : `${pm} install`}`));
    console.log();
    process.exit(1);
  }

  // ── Step 3: Playwright browser install (only when chosen) ────────────────
  if (e2e === 'playwright') {
    spinner.start('Installing Playwright browsers (chromium)...');
    try {
      await installPlaywrightBrowsers(projectDir);
      spinner.succeed(chalk.green('Playwright browsers installed'));
    } catch {
      spinner.warn(chalk.yellow('Playwright browser install failed — run "npx playwright install chromium" manually'));
    }
  }

  // ── Step 4: Git init + hooks ──────────────────────────────────────────────
  spinner.start('Initializing git repository...');
  try {
    execSync('git init', { cwd: projectDir, stdio: 'pipe' });
    spinner.text = 'Installing git hooks (husky)...';
    const [bin, ...args] = PM_RUN[pm]('prepare');
    execSync(`${bin} ${args.join(' ')}`, { cwd: projectDir, stdio: 'pipe' });
    spinner.succeed(chalk.green('Git initialized + hooks installed'));
  } catch {
    spinner.warn(
      chalk.yellow('Git setup skipped — run "git init && npm run prepare" manually'),
    );
  }

  printDone(projectName, pm, stateManagement, e2e, conventionalCommits, false);
}

/* ─── Done output ────────────────────────────────────────────────────────── */

function printDone(
  projectName: string,
  pm: PackageManager,
  stateManagement: StateManagement,
  e2e: E2EFramework,
  conventionalCommits: boolean,
  skipInstall: boolean,
) {
  const stateLabel =
    stateManagement === 'none' ? 'none' : stateManagement === 'jotai' ? 'Jotai' : 'Zustand';
  const e2eLabel =
    e2e === 'playwright' ? 'Playwright' : e2e === 'cypress' ? 'Cypress' : 'none';

  const devCmd = pm === 'npm' ? 'npm run dev' : `${pm} dev`;
  const installCmd = pm === 'npm' ? 'npm install' : `${pm} install`;

  const nextSteps = skipInstall
    ? [`cd ${projectName}`, installCmd, devCmd]
    : [`cd ${projectName}`, devCmd];

  console.log();
  console.log(
    '  ' + chalk.bold.green('✓ Ready!') + '  ' + chalk.dim(`${projectName} is scaffolded.`),
  );
  console.log();
  console.log('  ' + chalk.dim('Stack:  ') + chalk.white('Next.js 15 · TypeScript · Tailwind CSS v4 · ' + stateLabel));
  console.log('  ' + chalk.dim('Design: ') + chalk.white('Atomic Design (atoms → molecules → organisms)'));
  const dxParts = ['ESLint', 'Prettier', 'Jest'];
  if (conventionalCommits) dxParts.push('Husky', 'Commitlint');
  if (e2e !== 'none') dxParts.push(e2eLabel);
  console.log('  ' + chalk.dim('DX:     ') + chalk.white(dxParts.join(' · ')));
  console.log('  ' + chalk.dim('PM:     ') + chalk.white(pm));
  console.log();
  console.log('  ' + chalk.dim('Next steps:'));
  for (const step of nextSteps) {
    console.log('    ' + chalk.cyan('$ ' + step));
  }
  console.log();
}
