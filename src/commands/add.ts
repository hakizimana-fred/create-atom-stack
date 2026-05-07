import path from 'path';
import * as p from '@clack/prompts';
import chalk from 'chalk';
import { getGenerator, GENERATOR_TYPES, isValidGeneratorType } from '../generators/registry.js';
import { writeGeneratedFiles } from '../utils/file-utils.js';
import { toPascalCase, toCamelCase, toKebabCase, getBaseName, resolveCwd } from '../utils/path-utils.js';
import { log } from '../utils/logger.js';
import type { GeneratorType, AddCommandOptions } from '../types/generator.js';

/* ── Argument parsing ────────────────────────────────────────────────────── */

function parseAddArgs(argv: string[]): AddCommandOptions {
  const positional: string[] = [];
  let dir: string | undefined;
  let dry   = false;
  let force = false;

  for (const arg of argv) {
    if (arg.startsWith('--dir=')) {
      dir = arg.slice('--dir='.length);
    } else if (arg === '--dry') {
      dry = true;
    } else if (arg === '--force') {
      force = true;
    } else if (!arg.startsWith('--')) {
      positional.push(arg);
    }
  }

  return {
    type:  positional[0] as GeneratorType | undefined,
    name:  positional[1],
    dir,
    dry,
    force,
  };
}

/* ── Help ────────────────────────────────────────────────────────────────── */

export function printAddUsage() {
  console.log();
  console.log(chalk.bold('  create-atom-stack add') + chalk.dim(' <type> <name> [options]'));
  console.log();
  console.log(chalk.dim('  Atomic Design generators:'));
  console.log('    ' + chalk.cyan('atom')      + chalk.dim('        Smallest reusable unit        src/components/atoms/'));
  console.log('    ' + chalk.cyan('molecule')  + chalk.dim('    Composed of atoms              src/components/molecules/'));
  console.log('    ' + chalk.cyan('organism')  + chalk.dim('    Self-contained section         src/components/organisms/'));
  console.log('    ' + chalk.cyan('template')  + chalk.dim('    Page layout / structural       src/components/templates/'));
  console.log('    ' + chalk.cyan('component') + chalk.dim('   Generic — not Atomic Design     src/components/'));
  console.log();
  console.log(chalk.dim('  App generators:'));
  console.log('    ' + chalk.cyan('page')      + chalk.dim('        Next.js App Router page          src/app/'));
  console.log('    ' + chalk.cyan('feature')   + chalk.dim('     Feature-first module dir        src/features/'));
  console.log('    ' + chalk.cyan('store')     + chalk.dim('       State store (auto-detects SM)   src/store/'));
  console.log('    ' + chalk.cyan('api')       + chalk.dim('         API module + types + schemas   src/api/'));
  console.log();
  console.log(chalk.dim('  Options:'));
  console.log('    ' + chalk.dim('--dry         Show what would be generated without writing files'));
  console.log('    ' + chalk.dim('--force       Overwrite existing files without prompting'));
  console.log('    ' + chalk.dim('--dir=<path>  Override the default output directory'));
  console.log();
  console.log(chalk.dim('  Examples:'));
  console.log('    npx create-atom-stack add atom Button');
  console.log('    npx create-atom-stack add molecule SearchBar');
  console.log('    npx create-atom-stack add organism Navbar');
  console.log('    npx create-atom-stack add template DashboardLayout');
  console.log('    npx create-atom-stack add page dashboard/reports');
  console.log('    npx create-atom-stack add page "dashboard/[id]"     ' + chalk.dim('← quote dynamic routes'));
  console.log('    npx create-atom-stack add store auth                ' + chalk.dim('← auto-detects Zustand/RTK/Jotai/MobX'));
  console.log('    npx create-atom-stack add api users');
  console.log('    npx create-atom-stack add atom Button '             + chalk.dim('--dry'));
  console.log('    npx create-atom-stack add page admin/users '        + chalk.dim('--dir src/modules'));
  console.log('    npx create-atom-stack add api payments '            + chalk.dim('--force'));
  console.log();
  console.log(chalk.dim('  Shell note:'));
  console.log('    Dynamic route segments contain brackets: ' + chalk.yellow('[id]'));
  console.log('    zsh/bash treat brackets as glob chars — always quote them:');
  console.log('      ' + chalk.cyan('npx create-atom-stack add page "dashboard/[id]"'));
  console.log();
}

/* ── Interactive prompts ─────────────────────────────────────────────────── */

async function promptType(): Promise<GeneratorType> {
  const result = await p.select<GeneratorType>({
    message: 'What do you want to generate?',
    options: [
      { value: 'atom',      label: 'atom',      hint: 'Atomic Design — smallest unit' },
      { value: 'molecule',  label: 'molecule',  hint: 'Atomic Design — composed of atoms' },
      { value: 'organism',  label: 'organism',  hint: 'Atomic Design — self-contained section' },
      { value: 'template',  label: 'template',  hint: 'Atomic Design — page layout' },
      { value: 'component', label: 'component', hint: 'Generic component' },
      { value: 'page',      label: 'page',      hint: 'Next.js App Router page' },
      { value: 'feature',   label: 'feature',   hint: 'Feature module directory' },
      { value: 'store',     label: 'store',     hint: 'State store (auto-detects SM)' },
      { value: 'api',       label: 'api',       hint: 'API module + types + schemas' },
    ],
  });

  if (p.isCancel(result)) { p.cancel('Cancelled.'); process.exit(0); }
  return result;
}

async function promptName(type: GeneratorType): Promise<string> {
  const placeholders: Record<GeneratorType, string> = {
    component: 'Button',
    atom:      'Button',
    molecule:  'SearchBar',
    organism:  'Navbar',
    template:  'DashboardLayout',
    page:      'dashboard/reports',
    feature:   'billing',
    store:     'auth',
    api:       'users',
  };

  const result = await p.text({
    message: `Name for the ${type}?`,
    placeholder: placeholders[type],
    validate: (v) => (v.trim() ? undefined : 'Name is required.'),
  });

  if (p.isCancel(result)) { p.cancel('Cancelled.'); process.exit(0); }
  return result as string;
}

/* ── Import hint ─────────────────────────────────────────────────────────── */

function importHint(type: GeneratorType, pascal: string, camel: string, outDir: string): string {
  const rel   = path.relative(resolveCwd('src'), outDir).replace(/\\/g, '/');
  const alias = `@/${rel}`;

  switch (type) {
    case 'component':
    case 'atom':
    case 'molecule':
    case 'organism':
    case 'template':
      return `import ${pascal} from '${alias}';`;
    case 'page':
      return `// File-system route — no manual import needed.`;
    case 'feature':
      return `import { } from '${alias}';`;
    case 'store':
      return `import { use${pascal}Store } from '${alias}';  // Zustand\n` +
             `    import { ${camel}Actions } from '${alias}';           // RTK\n` +
             `    import { ${camel}Atom } from '${alias}';              // Jotai`;
    case 'api':
      return `import { ${camel}Api } from '${alias}';`;
  }
}

/* ── Main ────────────────────────────────────────────────────────────────── */

export async function runAddCommand(argv: string[]): Promise<void> {
  if (argv.includes('--help') || argv[0] === '--help') {
    printAddUsage();
    return;
  }

  let { type, name, dir, dry, force } = parseAddArgs(argv);

  const isTTY = Boolean(process.stdin.isTTY);

  /* Resolve type ---------------------------------------------------------- */
  if (!type || !isValidGeneratorType(type)) {
    if (!isTTY) {
      log.error(`Generator type is required. Valid types: ${GENERATOR_TYPES.join(', ')}`);
      process.exit(1);
    }
    console.log();
    p.intro(chalk.bold.cyan('create-atom-stack') + chalk.dim('  add generator'));
    type = await promptType();
  }

  /* Resolve name ---------------------------------------------------------- */
  if (!name?.trim()) {
    if (!isTTY) {
      log.error('Name is required.');
      process.exit(1);
    }
    if (!type) { console.log(); p.intro(chalk.bold.cyan('create-atom-stack') + chalk.dim('  add generator')); }
    name = await promptName(type);
  }

  /* Build context --------------------------------------------------------- */
  const generator  = getGenerator(type);
  const baseName   = getBaseName(name);
  const pascalName = toPascalCase(baseName);
  const camelName  = toCamelCase(baseName);
  const kebabName  = toKebabCase(baseName);

  const baseDir = resolveCwd(dir ?? generator.defaultBaseDir);
  const outDir  = path.join(baseDir, name);

  const ctx = { rawName: name, pascalName, camelName, kebabName, outDir, dry, force };

  /* Generate files (may be async — store resolves SM first) --------------- */
  const typeLabel = chalk.bold.cyan(type);
  const nameLabel = chalk.bold(name);

  if (dry) {
    log.section(`Dry run — ${typeLabel} ${nameLabel}`);
  } else {
    log.section(`Generating ${typeLabel} ${nameLabel}`);
  }

  const files = await Promise.resolve(generator.generate(ctx));

  const { created, skipped, overwritten } = await writeGeneratedFiles(files, { dry, force });

  console.log();

  if (dry) {
    log.warn(`No files written (dry run). Remove ${chalk.bold('--dry')} to generate for real.`);
    console.log();
    return;
  }

  const parts: string[] = [];
  if (created)     parts.push(chalk.green(`${created} created`));
  if (overwritten) parts.push(chalk.blue(`${overwritten} overwritten`));
  if (skipped)     parts.push(chalk.yellow(`${skipped} skipped`));

  log.success(`Done! ${parts.join(', ')}`);
  console.log();
  console.log('  ' + chalk.dim('Import:'));
  console.log('    ' + chalk.cyan(importHint(type, pascalName, camelName, outDir)));
  console.log();
}
