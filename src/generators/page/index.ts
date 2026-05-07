import path from 'path';
import type { Generator, GeneratorContext, GeneratedFile } from '../../types/generator.js';
import { pageTsx, loadingTsx, pageIndexTs } from '../../generator-templates/page.js';

const pageGenerator: Generator = {
  type: 'page',
  defaultBaseDir: 'src/app',

  generate(ctx: GeneratorContext): GeneratedFile[] {
    const { pascalName, rawName, outDir } = ctx;
    const cwd = process.cwd();

    const files: Array<[string, string]> = [
      ['page.tsx',    pageTsx(pascalName, rawName)],
      ['loading.tsx', loadingTsx(pascalName)],
      ['index.ts',    pageIndexTs(pascalName)],
    ];

    return files.map(([name, content]) => {
      const fullPath = path.join(outDir, name);
      return { fullPath, relativePath: path.relative(cwd, fullPath), content };
    });
  },
};

export default pageGenerator;
