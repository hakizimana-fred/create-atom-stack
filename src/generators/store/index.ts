import path from 'path';
import type { Generator, GeneratorContext, GeneratedFile } from '../../types/generator.js';
import { storeTs, storeTypesTs, storeIndexTs } from '../../generator-templates/store.js';

const storeGenerator: Generator = {
  type: 'store',
  defaultBaseDir: 'src/store',

  generate(ctx: GeneratorContext): GeneratedFile[] {
    const { camelName, pascalName, outDir } = ctx;
    const cwd = process.cwd();

    const files: Array<[string, string]> = [
      [`${camelName}.store.ts`, storeTs(camelName, pascalName)],
      [`${camelName}.types.ts`, storeTypesTs(pascalName)],
      ['index.ts',              storeIndexTs(camelName, pascalName)],
    ];

    return files.map(([name, content]) => {
      const fullPath = path.join(outDir, name);
      return { fullPath, relativePath: path.relative(cwd, fullPath), content };
    });
  },
};

export default storeGenerator;
