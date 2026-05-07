import path from 'path';
import type { Generator, GeneratorContext, GeneratedFile } from '../../types/generator.js';
import {
  atomicComponentTsx,
  atomicStylesTs,
  atomicTestTsx,
  atomicStoryTsx,
  atomicIndexTs,
} from '../../generator-templates/atomic.js';

const templateGenerator: Generator = {
  type: 'template',
  defaultBaseDir: 'src/components/templates',

  generate(ctx: GeneratorContext): GeneratedFile[] {
    const { pascalName, kebabName, outDir } = ctx;
    const cwd = process.cwd();

    const withTest   = Boolean(ctx.extra?.withTest);
    const withStyles = Boolean(ctx.extra?.withStyles);
    const withStory  = Boolean(ctx.extra?.withStory);

    const files: Array<[string, string]> = [
      [`${pascalName}.tsx`, atomicComponentTsx(pascalName, kebabName, 'template', false)],
      ['index.ts',          atomicIndexTs(pascalName)],
    ];

    if (withStyles) files.push([`${pascalName}.styles.ts`,   atomicStylesTs(pascalName)]);
    if (withTest)   files.push([`${pascalName}.test.tsx`,     atomicTestTsx(pascalName)]);
    if (withStory)  files.push([`${pascalName}.stories.tsx`,  atomicStoryTsx(pascalName, 'template', false)]);

    return files.map(([name, content]) => {
      const fullPath = path.join(outDir, name);
      return { fullPath, relativePath: path.relative(cwd, fullPath), content };
    });
  },
};

export default templateGenerator;
