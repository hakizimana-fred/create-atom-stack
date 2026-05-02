import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import chalk from 'chalk';
import type { Ora } from 'ora';
import { getFileMap } from './templates/index.js';

interface CreateOptions {
  skipInstall: boolean;
  spinner: Ora;
}

export async function createProject(projectName: string, { skipInstall, spinner }: CreateOptions) {
  const projectDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(projectDir)) {
    throw new Error(
      `Directory "${projectName}" already exists. Choose a different name or remove it first.`,
    );
  }

  // ── Step 1: Create directory ──────────────────────────────────────────────
  spinner.text = 'Creating project directory...';
  fs.mkdirSync(projectDir, { recursive: true });

  // ── Step 2: Write template files ─────────────────────────────────────────
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

  // Make husky hooks executable
  for (const hook of ['.husky/pre-commit', '.husky/commit-msg', '.husky/pre-push']) {
    const hookPath = path.join(projectDir, hook);
    if (fs.existsSync(hookPath)) {
      fs.chmodSync(hookPath, 0o755);
    }
  }

  spinner.succeed(chalk.green(`${written} files written`));

  // ── Step 3: Install dependencies ──────────────────────────────────────────
  if (!skipInstall) {
    spinner.start('Installing npm packages...');

    // Hint after 15 s so users know it is still running
    const installHint = setTimeout(() => {
      spinner.text = 'Still installing... (first install resolves the full dep tree)';
    }, 15_000);

    try {
      execSync('npm install', { cwd: projectDir, stdio: 'pipe' });
      clearTimeout(installHint);
      spinner.succeed(chalk.green('Dependencies installed'));
    } catch {
      clearTimeout(installHint);
      spinner.warn(chalk.yellow('npm install failed — run it manually inside the project'));
    }

    // ── Step 4: Git init + hooks ───────────────────────────────────────────
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
