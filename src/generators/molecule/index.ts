import path from 'path';
import type { Generator, GeneratorContext, GeneratedFile } from '../../types/generator.js';
import {
  atomicComponentTsx,
  atomicStylesTs,
  atomicTestTsx,
  atomicIndexTs,
} from '../../generator-templates/atomic.js';

const moleculeGenerator: Generator = {
  type: 'molecule',
  defaultBaseDir: 'src/components/molecules',

  generate(ctx: GeneratorContext): GeneratedFile[] {
    const { pascalName, kebabName, outDir } = ctx;
    const cwd = process.cwd();

    const files: Array<[string, string]> = [
      [`${pascalName}.tsx`,       atomicComponentTsx(pascalName, kebabName, 'molecule')],
      [`${pascalName}.styles.ts`, atomicStylesTs(pascalName)],
      [`${pascalName}.test.tsx`,  atomicTestTsx(pascalName)],
      ['index.ts',                atomicIndexTs(pascalName)],
    ];

    return files.map(([name, content]) => {
      const fullPath = path.join(outDir, name);
      return { fullPath, relativePath: path.relative(cwd, fullPath), content };
    });
  },
};

export default moleculeGenerator;
