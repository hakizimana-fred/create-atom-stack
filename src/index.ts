#!/usr/bin/env node
import * as p from '@clack/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { createProject } from './create.js';
import type { PackageManager, StateManagement, E2EFramework } from './create.js';

const [,, rawName, ...flags] = process.argv;

function validateName(v: string): string | undefined {
  if (!v) return 'Project name is required.';
  if (!/^[a-z0-9][a-z0-9-_]*$/i.test(v))
    return 'Must start with a letter/digit and contain only letters, numbers, hyphens, or underscores.';
}

function printUsage() {
  console.log();
  console.log(chalk.bold('  create-atom-stack') + chalk.dim(' [project-name] [options]'));
  console.log();
  console.log(chalk.dim('  Options:'));
  console.log(chalk.dim('    --pm=<npm|pnpm|yarn|bun>              Package manager (default: npm)'));
  console.log(chalk.dim('    --state=<zustand|jotai|none>          State management (default: zustand)'));
  console.log(chalk.dim('    --e2e=<playwright|cypress|none>       E2E framework (default: none)'));
  console.log(chalk.dim('    --skip-install                        Skip dependency install'));
  console.log(chalk.dim('    --help                                Show this help'));
  console.log();
  console.log(chalk.dim('  Examples:'));
  console.log('    npx create-atom-stack                ' + chalk.dim('(interactive)'));
  console.log('    npx create-atom-stack my-app');
  console.log('    npx create-atom-stack my-app --pm=pnpm --state=jotai --e2e=playwright');
  console.log();
}

async function main() {
  let projectName: string;
  let pm: PackageManager;
  let stateManagement: StateManagement;
  let e2e: E2EFramework;
  let conventionalCommits: boolean;
  let skipInstall: boolean;

  if (flags.includes('--help') || rawName === '--help') {
    printUsage();
    process.exit(0);
  }

  const hasDirectName = rawName && !rawName.startsWith('-');
  const isTTY = Boolean(process.stdin.isTTY);

  if (!hasDirectName && !isTTY) {
    console.error(chalk.red('\n  Error: Project name is required in non-interactive mode.\n'));
    printUsage();
    process.exit(1);
  }

  if (hasDirectName) {
    /* ── Direct (non-interactive) mode ── */
    const nameError = validateName(rawName);
    if (nameError) {
      console.error(chalk.red(`\n  Error: ${nameError}\n`));
      process.exit(1);
    }

    projectName     = rawName;
    pm              = (flags.find((f) => f.startsWith('--pm='))?.split('=')[1] as PackageManager) ?? 'npm';
    stateManagement = (flags.find((f) => f.startsWith('--state='))?.split('=')[1] as StateManagement) ?? 'zustand';
    e2e                 = (flags.find((f) => f.startsWith('--e2e='))?.split('=')[1] as E2EFramework) ?? 'none';
    conventionalCommits = !flags.includes('--no-conventional-commits');
    skipInstall         = flags.includes('--skip-install');
  } else {
    /* ── Interactive mode ── */
    console.log();
    p.intro(chalk.bold.cyan('create-atom-stack') + chalk.dim('  Atomic Next.js scaffold'));

    const answers = await p.group(
      {
        projectName: () =>
          p.text({
            message: 'Project name?',
            placeholder: 'my-app',
            validate: validateName,
          }),

        pm: () =>
          p.select({
            message: 'Package manager?',
            options: [
              { value: 'npm'  as const, label: 'npm' },
              { value: 'pnpm' as const, label: 'pnpm' },
              { value: 'yarn' as const, label: 'yarn' },
              { value: 'bun'  as const, label: 'bun' },
            ],
          }),

        stateManagement: () =>
          p.select({
            message: 'State management?',
            options: [
              { value: 'zustand' as const, label: 'Zustand', hint: 'recommended' },
              { value: 'jotai'   as const, label: 'Jotai' },
              { value: 'none'    as const, label: 'none' },
            ],
          }),

        e2e: () =>
          p.select({
            message: 'E2E testing?',
            options: [
              { value: 'none'        as const, label: 'none' },
              { value: 'playwright'  as const, label: 'Playwright', hint: 'recommended' },
              { value: 'cypress'     as const, label: 'Cypress' },
            ],
          }),

        conventionalCommits: () =>
          p.confirm({
            message: 'Conventional commits? (husky + commitlint)',
            initialValue: true,
          }),

        skipInstall: () =>
          p.confirm({
            message: 'Skip install?',
            initialValue: false,
          }),
      },
      {
        onCancel: () => {
          p.cancel('Cancelled.');
          process.exit(0);
        },
      },
    );

    projectName     = answers.projectName as string;
    pm              = answers.pm as PackageManager;
    stateManagement = answers.stateManagement as StateManagement;
    e2e                 = answers.e2e as E2EFramework;
    conventionalCommits = answers.conventionalCommits as boolean;
    skipInstall         = answers.skipInstall as boolean;

    p.outro(chalk.dim('Scaffolding…'));
    console.log();
  }

  const spinner = ora({ prefixText: '  ' }).start('Scaffolding project...');

  createProject(projectName, { skipInstall, pm, stateManagement, e2e, conventionalCommits, spinner }).catch((err: Error) => {
    spinner.fail(chalk.red('Failed: ' + err.message));
    console.log();
    process.exit(1);
  });
}

main();
