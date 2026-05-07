import path from 'path';
import type { Generator, GeneratorContext, GeneratedFile } from '../../types/generator.js';
import {
  componentTsx,
  componentStylesTs,
  componentTestTsx,
  componentIndexTs,
} from '../../generator-templates/component.js';

const componentGenerator: Generator = {
  type: 'component',
  defaultBaseDir: 'src/components',

  generate(ctx: GeneratorContext): GeneratedFile[] {
    const { pascalName, outDir } = ctx;
    const cwd = process.cwd();

    const files: Array<[string, string]> = [
      [`${pascalName}.tsx`,       componentTsx(pascalName)],
      [`${pascalName}.styles.ts`, componentStylesTs(pascalName)],
      [`${pascalName}.test.tsx`,  componentTestTsx(pascalName)],
      ['index.ts',                componentIndexTs(pascalName)],
    ];

    return files.map(([name, content]) => {
      const fullPath = path.join(outDir, name);
      return { fullPath, relativePath: path.relative(cwd, fullPath), content };
    });
  },
};

export default componentGenerator;
