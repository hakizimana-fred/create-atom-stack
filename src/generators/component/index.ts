import path from 'path';
import type { Generator, GeneratorContext, GeneratedFile } from '../../types/generator.js';
import {
  componentTsx,
  componentVariantsTsx,
  componentStylesTs,
  componentTestTsx,
  componentStoryTsx,
  componentIndexTs,
} from '../../generator-templates/component.js';

const componentGenerator: Generator = {
  type: 'component',
  defaultBaseDir: 'src/components',

  generate(ctx: GeneratorContext): GeneratedFile[] {
    const { pascalName, kebabName, outDir } = ctx;
    const cwd = process.cwd();

    const withVariants = Boolean(ctx.extra?.withVariants);
    const withTest     = Boolean(ctx.extra?.withTest);
    const withStyles   = Boolean(ctx.extra?.withStyles);
    const withStory    = Boolean(ctx.extra?.withStory);

    const files: Array<[string, string]> = [
      [`${pascalName}.tsx`, withVariants
        ? componentVariantsTsx(pascalName, kebabName)
        : componentTsx(pascalName, kebabName)],
      ['index.ts', componentIndexTs(pascalName)],
    ];

    if (withStyles) files.push([`${pascalName}.styles.ts`, componentStylesTs(pascalName)]);
    if (withTest)   files.push([`${pascalName}.test.tsx`,  componentTestTsx(pascalName)]);
    if (withStory)  files.push([`${pascalName}.stories.tsx`, componentStoryTsx(pascalName, `components/${pascalName}`, withVariants)]);

    return files.map(([name, content]) => {
      const fullPath = path.join(outDir, name);
      return { fullPath, relativePath: path.relative(cwd, fullPath), content };
    });
  },
};

export default componentGenerator;
