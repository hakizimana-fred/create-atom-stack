import path from 'path';
import type { Generator, GeneratorContext, GeneratedFile } from '../../types/generator.js';
import { apiTs, apiTypesTs, apiSchemasTs, apiIndexTs } from '../../generator-templates/api.js';

const apiGenerator: Generator = {
  type: 'api',
  defaultBaseDir: 'src/api',

  generate(ctx: GeneratorContext): GeneratedFile[] {
    const { camelName, pascalName, outDir } = ctx;
    const cwd = process.cwd();

    const files: Array<[string, string]> = [
      [`${camelName}.api.ts`,     apiTs(camelName, pascalName)],
      [`${camelName}.types.ts`,   apiTypesTs(pascalName)],
      [`${camelName}.schemas.ts`, apiSchemasTs(camelName, pascalName)],
      ['index.ts',                apiIndexTs(camelName, pascalName)],
    ];

    return files.map(([name, content]) => {
      const fullPath = path.join(outDir, name);
      return { fullPath, relativePath: path.relative(cwd, fullPath), content };
    });
  },
};

export default apiGenerator;
