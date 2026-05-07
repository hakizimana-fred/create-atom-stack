import * as p from '@clack/prompts';
import chalk from 'chalk';
import { readAtomConfig, patchAtomConfig } from '../config/atom-config.js';
import { detectStateManagement } from '../config/project-detector.js';
import { log } from '../utils/logger.js';
import type { SupportedStateManagement } from '../types/generator.js';

/**
 * Resolution order:
 *   1. atom.config.json  — explicit project config
 *   2. package.json deps — auto-detect installed SM
 *   3. Interactive prompt — ask in TTY
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
  return result;
}
