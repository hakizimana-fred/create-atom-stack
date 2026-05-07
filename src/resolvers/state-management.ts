import { spawn } from 'child_process';
import * as p from '@clack/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { readAtomConfig, patchAtomConfig } from '../config/atom-config.js';
import { detectStateManagement, detectPackageManager } from '../config/project-detector.js';
import { log } from '../utils/logger.js';
import type { SupportedStateManagement } from '../types/generator.js';

/* ── Package names per SM ────────────────────────────────────────────────── */

const SM_PACKAGES: Record<Exclude<SupportedStateManagement, 'none'>, string[]> = {
  'zustand':       ['zustand'],
  'redux-toolkit': ['@reduxjs/toolkit', 'react-redux'],
  'jotai':         ['jotai'],
  'mobx':          ['mobx', 'mobx-react-lite'],
};

const PM_ADD: Record<string, string> = {
  npm:  'install',
  pnpm: 'add',
  yarn: 'add',
  bun:  'add',
};

function installPackages(packages: string[], pm: string): Promise<void> {
  const cmd = `${pm} ${PM_ADD[pm] ?? 'install'} ${packages.join(' ')}`;
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, [], {
      cwd: process.cwd(),
      stdio: 'pipe',
      shell: true,
    });
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`Exit ${code}`))));
    child.on('error', reject);
  });
}

/* ── Main resolver ───────────────────────────────────────────────────────── */

/**
 * Resolution order:
 *   1. atom.config.json  — explicit project config
 *   2. package.json deps — auto-detect installed SM
 *   3. Interactive prompt — ask in TTY, then install the package
 *   4. Fallback: zustand  — silent default in non-TTY
 */
export async function resolveStateManagement(): Promise<SupportedStateManagement> {
  // 1. Explicit config
  const config = readAtomConfig();
  if (config?.stateManagement && config.stateManagement !== 'none') {
    return config.stateManagement;
  }

  // 2. Auto-detect from installed packages
  const detected = detectStateManagement();
  if (detected) {
    patchAtomConfig({ stateManagement: detected });
    return detected;
  }

  // 3. Interactive prompt
  const isTTY = Boolean(process.stdin.isTTY);
  if (!isTTY) {
    log.warn('No state management detected — defaulting to Zustand.');
    return 'zustand';
  }

  log.blank();
  log.warn('No state management detected in this project.');

  const result = await p.select<SupportedStateManagement>({
    message: chalk.bold('Which state management solution do you want to use?'),
    options: [
      { value: 'zustand',       label: 'Zustand',       hint: 'lightweight — recommended' },
      { value: 'redux-toolkit', label: 'Redux Toolkit',  hint: 'scalable — enterprise' },
      { value: 'jotai',         label: 'Jotai',          hint: 'atomic — minimal' },
      { value: 'mobx',          label: 'MobX',           hint: 'reactive — OOP-friendly' },
    ],
  });

  if (p.isCancel(result)) {
    p.cancel('Cancelled.');
    process.exit(0);
  }

  patchAtomConfig({ stateManagement: result });

  // Auto-install the chosen package
  const packages = SM_PACKAGES[result as Exclude<SupportedStateManagement, 'none'>];
  if (packages) {
    const pm = detectPackageManager();
    const spinner = ora({ prefixText: '  ' }).start(
      `Installing ${chalk.cyan(packages.join(' '))} via ${chalk.dim(pm)}…`,
    );
    try {
      await installPackages(packages, pm);
      spinner.succeed(chalk.green(`Installed ${packages.join(', ')}`));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      spinner.warn(
        chalk.yellow(`Install failed (${msg}). Run manually: `) +
        chalk.cyan(`${pm} ${PM_ADD[pm]} ${packages.join(' ')}`),
      );
    }
  }

  return result;
}
