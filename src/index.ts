#!/usr/bin/env node
import * as p from '@clack/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { createProject } from './create.js';
import { runAddCommand, printAddUsage } from './commands/add.js';
import type { PackageManager, StateManagement, E2EFramework, AdvancedAddon } from './create.js';

const [,, rawName, ...flags] = process.argv;

function validateName(v: string): string | undefined {
  if (!v) return 'Project name is required.';
  if (!/^[a-z0-9][a-z0-9-_]*$/i.test(v))
    return 'Must start with a letter/digit and contain only letters, numbers, hyphens, or underscores.';
}

function printUsage() {
  console.log();
  console.log(chalk.bold('  create-atom-stack') + chalk.dim(' <command> [options]'));
  console.log();
  console.log(chalk.dim('  Commands:'));
  console.log('    ' + chalk.cyan('[project-name]') + chalk.dim('       Scaffold a new Next.js project (default)'));
  console.log('    ' + chalk.cyan('add <type> <name>') + chalk.dim('    Generate a component, page, feature, store, or api'));
  console.log();
  console.log(chalk.dim('  Scaffold options:'));
  console.log(chalk.dim('    --pm=<npm|pnpm|yarn|bun>                     Package manager (default: npm)'));
  console.log(chalk.dim('    --state=<zustand|jotai|react-query|none>     State management (default: zustand)'));
  console.log(chalk.dim('    --e2e=<playwright|cypress|none>              E2E framework (default: none)'));
  console.log(chalk.dim('    --rxjs                                       Add RxJS (Observables + useObservable hook)'));
  console.log(chalk.dim('    --xstate                                     Add XState (state machines + useMachine)'));
  console.log(chalk.dim('    --skip-install                               Skip dependency install'));
  console.log(chalk.dim('    --no-git                                     Skip git init'));
  console.log(chalk.dim('    --help                                       Show this help'));
  console.log();
  console.log(chalk.dim('  Examples:'));
  console.log('    npx create-atom-stack                       ' + chalk.dim('(interactive)'));
  console.log('    npx create-atom-stack my-app');
  console.log('    npx create-atom-stack my-app --pm=pnpm --state=react-query');
  console.log('    npx create-atom-stack add component Button');
  console.log('    npx create-atom-stack add page dashboard/reports');
  console.log('    npx create-atom-stack add --help            ' + chalk.dim('(generator help)'));
  console.log();
}

async function main() {
  /* ── Route 'add' subcommand ─────────────────────────────────────────────── */
  if (rawName === 'add') {
    await runAddCommand(flags);
    process.exit(0);
  }

  let projectName: string;
  let pm: PackageManager;
  let stateManagement: StateManagement;
  let e2e: E2EFramework;
  let conventionalCommits: boolean;
  let advancedAddons: AdvancedAddon[];
  let skipInstall: boolean;
  let noGit: boolean;

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

    projectName         = rawName;
    pm                  = (flags.find((f) => f.startsWith('--pm='))?.split('=')[1] as PackageManager) ?? 'npm';
    stateManagement     = (flags.find((f) => f.startsWith('--state='))?.split('=')[1] as StateManagement) ?? 'zustand';
    e2e                 = (flags.find((f) => f.startsWith('--e2e='))?.split('=')[1] as E2EFramework) ?? 'none';
    conventionalCommits = !flags.includes('--no-conventional-commits');
    advancedAddons      = [
      ...(flags.includes('--rxjs')   ? ['rxjs'   as const] : []),
      ...(flags.includes('--xstate') ? ['xstate' as const] : []),
    ];
    skipInstall         = flags.includes('--skip-install');
    noGit               = flags.includes('--no-git');
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
              { value: 'zustand'      as const, label: 'Zustand',        hint: 'recommended' },
              { value: 'jotai'        as const, label: 'Jotai' },
              { value: 'react-query'  as const, label: 'TanStack Query',  hint: 'server state' },
              { value: 'none'         as const, label: 'none' },
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

        advancedAddons: () =>
          p.multiselect<AdvancedAddon>({
            message: 'Advanced add-ons? (optional — space to select)',
            options: [
              { value: 'rxjs'   as const, label: 'RxJS',   hint: 'Observable streams + useObservable hook' },
              { value: 'xstate' as const, label: 'XState', hint: 'State machines + useMachine integration' },
            ],
            required: false,
          }),

        skipInstall: () =>
          p.confirm({
            message: 'Skip install?',
            initialValue: false,
          }),

        noGit: () =>
          p.confirm({
            message: 'Skip git init?',
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

    projectName         = answers.projectName as string;
    pm                  = answers.pm as PackageManager;
    stateManagement     = answers.stateManagement as StateManagement;
    e2e                 = answers.e2e as E2EFramework;
    conventionalCommits = answers.conventionalCommits as boolean;
    advancedAddons      = answers.advancedAddons as AdvancedAddon[];
    skipInstall         = answers.skipInstall as boolean;
    noGit               = answers.noGit as boolean;

    p.outro(chalk.dim('Scaffolding…'));
    console.log();
  }

  const spinner = ora({ prefixText: '  ' }).start('Scaffolding project...');

  createProject(projectName, { skipInstall, noGit, pm, stateManagement, e2e, conventionalCommits, advancedAddons, spinner }).catch((err: Error) => {
    spinner.fail(chalk.red('Failed: ' + err.message));
    console.log();
    process.exit(1);
  });
}

main();
