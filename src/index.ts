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

    /* Step 1: project name */
    const nameAnswer = await p.text({
      message: 'Project name?',
      placeholder: 'my-app',
      validate: validateName,
    });
    if (p.isCancel(nameAnswer)) { p.cancel('Cancelled.'); process.exit(0); }
    projectName = nameAnswer as string;

    /* Step 2: package manager */
    const pmAnswer = await p.select<PackageManager>({
      message: 'Package manager?',
      options: [
        { value: 'npm',  label: 'npm' },
        { value: 'pnpm', label: 'pnpm' },
        { value: 'yarn', label: 'yarn' },
        { value: 'bun',  label: 'bun' },
      ],
    });
    if (p.isCancel(pmAnswer)) { p.cancel('Cancelled.'); process.exit(0); }
    pm = pmAnswer as PackageManager;

    /* Step 3: defaults fast-path */
    const useDefaults = await p.confirm({
      message: 'Use recommended defaults?' +
        chalk.dim('  (Zustand · no E2E · conventional commits · install now)'),
      initialValue: true,
    });
    if (p.isCancel(useDefaults)) { p.cancel('Cancelled.'); process.exit(0); }

    if (useDefaults) {
      stateManagement     = 'zustand';
      e2e                 = 'none';
      conventionalCommits = true;
      advancedAddons      = [];
      skipInstall         = false;
      noGit               = false;
    } else {
      /* Advanced questions */
      const smAnswer = await p.select<StateManagement>({
        message: 'State management?',
        options: [
          { value: 'zustand',     label: 'Zustand',       hint: 'recommended' },
          { value: 'jotai',       label: 'Jotai' },
          { value: 'react-query', label: 'TanStack Query', hint: 'server state' },
          { value: 'none',        label: 'none' },
        ],
      });
      if (p.isCancel(smAnswer)) { p.cancel('Cancelled.'); process.exit(0); }
      stateManagement = smAnswer as StateManagement;

      const e2eAnswer = await p.select<E2EFramework>({
        message: 'E2E testing?',
        options: [
          { value: 'none',       label: 'none' },
          { value: 'playwright', label: 'Playwright', hint: 'recommended' },
          { value: 'cypress',    label: 'Cypress' },
        ],
      });
      if (p.isCancel(e2eAnswer)) { p.cancel('Cancelled.'); process.exit(0); }
      e2e = e2eAnswer as E2EFramework;

      const ccAnswer = await p.confirm({
        message: 'Conventional commits? (husky + commitlint)',
        initialValue: true,
      });
      if (p.isCancel(ccAnswer)) { p.cancel('Cancelled.'); process.exit(0); }
      conventionalCommits = ccAnswer as boolean;

      const addonsAnswer = await p.multiselect<AdvancedAddon>({
        message: 'Advanced add-ons? (optional — space to select)',
        options: [
          { value: 'rxjs',   label: 'RxJS',   hint: 'Observable streams + useObservable hook' },
          { value: 'xstate', label: 'XState', hint: 'State machines + useMachine integration' },
        ],
        required: false,
      });
      if (p.isCancel(addonsAnswer)) { p.cancel('Cancelled.'); process.exit(0); }
      advancedAddons = addonsAnswer as AdvancedAddon[];

      const skipInstallAnswer = await p.confirm({
        message: 'Skip install?',
        initialValue: false,
      });
      if (p.isCancel(skipInstallAnswer)) { p.cancel('Cancelled.'); process.exit(0); }
      skipInstall = skipInstallAnswer as boolean;

      const noGitAnswer = await p.confirm({
        message: 'Skip git init?',
        initialValue: false,
      });
      if (p.isCancel(noGitAnswer)) { p.cancel('Cancelled.'); process.exit(0); }
      noGit = noGitAnswer as boolean;
    }

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
