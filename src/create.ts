import path from 'path';
import fs from 'fs';
import { execSync, spawn } from 'child_process';
import chalk from 'chalk';
import type { Ora } from 'ora';
import { getFileMap } from './templates/index.js';

interface CreateOptions {
  skipInstall: boolean;
  spinner: Ora;
}

/* ─── Streaming npm install ──────────────────────────────────────────────── */

const INSTALL_PHASES = [
  'Resolving dependency tree',
  'Fetching packages from registry',
  'Verifying package integrity',
  'Linking dependencies',
  'Building package graph',
  'Running lifecycle scripts',
];

function npmInstall(cwd: string, spinner: Ora): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let phaseIdx = 0;

    const elapsed = () => chalk.dim(` · ${Math.round((Date.now() - startTime) / 1000)}s`);

    spinner.text = INSTALL_PHASES[0] + elapsed();

    // Cycle through phases so the user always sees movement
    const phaseTick = setInterval(() => {
      phaseIdx = (phaseIdx + 1) % INSTALL_PHASES.length;
      spinner.text = INSTALL_PHASES[phaseIdx] + elapsed();
    }, 3_000);

    const child = spawn('npm', ['install'], {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let lastPkgUpdate = 0;

    const onChunk = (chunk: Buffer) => {
      const text = chunk.toString();
      const now = Date.now();

      // npm's final summary line: "added 142 packages in 38s"
      const summary = text.match(/added (\d+) packages/i);
      if (summary) {
        clearInterval(phaseTick);
        spinner.text = chalk.white(`Added ${summary[1]} packages`) + elapsed();
        return;
      }

      // During the reify step npm emits the package it is currently writing.
      // Throttle to avoid spinner flicker (one update per 400 ms max).
      if (now - lastPkgUpdate < 400) return;
      const pkg = text.match(/reify:(@?[a-z][a-z0-9._-]*(?:\/[a-z0-9._-]+)?)/i);
      if (pkg) {
        lastPkgUpdate = now;
        spinner.text = chalk.dim('↳ ') + chalk.white(pkg[1]) + elapsed();
      }
    };

    child.stdout?.on('data', onChunk);
    child.stderr?.on('data', onChunk);

    child.on('close', (code) => {
      clearInterval(phaseTick);
      if (code === 0) resolve();
      else reject(new Error(`npm install exited with code ${code}`));
    });

    child.on('error', (err) => {
      clearInterval(phaseTick);
      reject(err);
    });
  });
}

/* ─── Main scaffold ──────────────────────────────────────────────────────── */

export async function createProject(projectName: string, { skipInstall, spinner }: CreateOptions) {
  const projectDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(projectDir)) {
    throw new Error(
      `Directory "${projectName}" already exists. Choose a different name or remove it first.`,
    );
  }

  // ── Step 1: Write template files ─────────────────────────────────────────
  spinner.text = 'Creating project directory...';
  fs.mkdirSync(projectDir, { recursive: true });

  const fileMap = getFileMap(projectName);
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

  // ── Step 2: npm install (streaming) ──────────────────────────────────────
  if (!skipInstall) {
    spinner.start(INSTALL_PHASES[0]);
    try {
      await npmInstall(projectDir, spinner);
      spinner.succeed(chalk.green('Dependencies installed'));
    } catch {
      spinner.warn(chalk.yellow('npm install failed — run it manually inside the project'));
    }

    // ── Step 3: Git init + hooks ────────────────────────────────────────────
    spinner.start('Initializing git repository...');
    try {
      execSync('git init', { cwd: projectDir, stdio: 'pipe' });
      spinner.text = 'Installing git hooks (husky)...';
      execSync('npm run prepare', { cwd: projectDir, stdio: 'pipe' });
      spinner.succeed(chalk.green('Git initialized + hooks installed'));
    } catch {
      spinner.warn(
        chalk.yellow('Git setup skipped — run "git init && npm run prepare" manually'),
      );
    }
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  const nextStep = skipInstall
    ? [`cd ${projectName}`, 'npm install', 'npm run dev']
    : [`cd ${projectName}`, 'npm run dev'];

  console.log();
  console.log(
    '  ' + chalk.bold.green('✓ Ready!') + '  ' + chalk.dim(`${projectName} is scaffolded.`),
  );
  console.log();
  console.log('  ' + chalk.dim('Stack:  ') + chalk.white('Next.js 15 · TypeScript · Tailwind CSS v4 · Zustand'));
  console.log('  ' + chalk.dim('Design: ') + chalk.white('Atomic Design (atoms → molecules → organisms)'));
  console.log('  ' + chalk.dim('DX:     ') + chalk.white('ESLint · Prettier · Husky · Commitlint · Jest'));
  console.log();
  console.log('  ' + chalk.dim('Next steps:'));
  for (const step of nextStep) {
    console.log('    ' + chalk.cyan('$ ' + step));
  }
  console.log();
}
