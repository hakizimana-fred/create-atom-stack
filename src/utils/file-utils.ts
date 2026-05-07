import fs from 'fs';
import path from 'path';
import * as p from '@clack/prompts';
import chalk from 'chalk';
import { log } from './logger.js';
import type { GeneratedFile } from '../types/generator.js';

export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

interface WriteResult {
  created: number;
  skipped: number;
  overwritten: number;
}

interface WriteOptions {
  dry: boolean;
  force: boolean;
}

export async function writeGeneratedFiles(
  files: GeneratedFile[],
  { dry, force }: WriteOptions,
): Promise<WriteResult> {
  let created = 0;
  let skipped = 0;
  let overwritten = 0;

  for (const file of files) {
    if (dry) {
      log.dryFile(file.relativePath);
      created++;
      continue;
    }

    const exists = fileExists(file.fullPath);

    if (exists && !force) {
      const isTTY = Boolean(process.stdin.isTTY);

      if (!isTTY) {
        log.file('skip', file.relativePath);
        skipped++;
        continue;
      }

      const answer = await p.confirm({
        message: chalk.yellow(`${file.relativePath} already exists. Overwrite?`),
        initialValue: false,
      });

      if (p.isCancel(answer) || !answer) {
        log.file('skip', file.relativePath);
        skipped++;
        continue;
      }
    }

    fs.mkdirSync(path.dirname(file.fullPath), { recursive: true });
    fs.writeFileSync(file.fullPath, file.content, 'utf-8');

    if (exists) {
      log.file('overwrite', file.relativePath);
      overwritten++;
    } else {
      log.file('create', file.relativePath);
      created++;
    }
  }

  return { created, skipped, overwritten };
}
