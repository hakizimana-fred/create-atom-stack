#!/usr/bin/env node
import chalk from 'chalk';
import ora from 'ora';
import { createProject } from './create.js';

const [,, rawName, ...flags] = process.argv;

function printUsage() {
  console.log();
  console.log(chalk.bold('  create-atom-stack') + chalk.dim(' <project-name> [options]'));
  console.log();
  console.log(chalk.dim('  Options:'));
  console.log(chalk.dim('    --skip-install   Skip npm install'));
  console.log();
  console.log(chalk.dim('  Example:'));
  console.log('    npx create-atom-stack my-app');
  console.log();
}

if (!rawName || rawName.startsWith('-')) {
  console.error(chalk.red('\n  Error: Project name is required.\n'));
  printUsage();
  process.exit(1);
}

if (!/^[a-z0-9][a-z0-9-_]*$/i.test(rawName)) {
  console.error(chalk.red('\n  Error: Project name must start with a letter/digit and contain only letters, numbers, hyphens, and underscores.\n'));
  process.exit(1);
}

const skipInstall = flags.includes('--skip-install');

console.log();
console.log('  ' + chalk.bold.cyan('create-atom-stack'));
console.log('  ' + chalk.dim('Atomic Next.js scaffold'));
console.log();

const spinner = ora({ prefixText: '  ' }).start('Scaffolding project...');

createProject(rawName, { skipInstall, spinner }).catch((err: Error) => {
  spinner.fail(chalk.red('Failed: ' + err.message));
  console.log();
  process.exit(1);
});
