import path from 'path';
import type { Generator, GeneratorContext, GeneratedFile } from '../../types/generator.js';
import { parseRoute } from '../../parsers/route-parser.js';
import { buildPageTsx, loadingTsx, pageIndexTs } from '../../generator-templates/page.js';
import { log } from '../../utils/logger.js';
import chalk from 'chalk';

const pageGenerator: Generator = {
  type: 'page',
  defaultBaseDir: 'src/app',

  generate(ctx: GeneratorContext): GeneratedFile[] {
    const { rawName, outDir } = ctx;
    const cwd = process.cwd();

    const route = parseRoute(rawName);

    // Warn about shell quoting when a dynamic segment is detected
    if (route.isDynamic) {
      log.info(
        chalk.dim('Dynamic route detected — if you see shell errors, quote the path: ') +
        chalk.cyan(`"${rawName}"`),
      );
    }

    const files: Array<[string, string]> = [
      ['page.tsx',    buildPageTsx(route)],
      ['loading.tsx', loadingTsx(route.componentName)],
      ['index.ts',    pageIndexTs(route.componentName)],
    ];

    return files.map(([name, content]) => {
      const fullPath = path.join(outDir, name);
      return { fullPath, relativePath: path.relative(cwd, fullPath), content };
    });
  },
};

export default pageGenerator;
