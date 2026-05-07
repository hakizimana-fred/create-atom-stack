import path from 'path';
import type { Generator, GeneratorContext, GeneratedFile } from '../../types/generator.js';
import { apiTs, apiSchemasTs, apiTypesTs, apiIndexTs, type ApiMode } from '../../generator-templates/api.js';
import { detectZod } from '../../config/project-detector.js';

const apiGenerator: Generator = {
  type: 'api',
  defaultBaseDir: 'src/api',

  generate(ctx: GeneratorContext): GeneratedFile[] {
    const { camelName, pascalName, outDir } = ctx;
    const mode   = (ctx.extra?.mode as ApiMode | undefined) ?? 'crud';
    const useZod = detectZod();
    const cwd    = process.cwd();

    const files: Array<[string, string]> = [
      [`${camelName}.api.ts`, apiTs(camelName, pascalName, mode, useZod)],
      useZod
        ? [`${camelName}.schemas.ts`, apiSchemasTs(camelName, pascalName)]
        : [`${camelName}.types.ts`,   apiTypesTs(pascalName)],
      ['index.ts', apiIndexTs(camelName, pascalName, useZod)],
    ];

    return files.map(([name, content]) => {
      const fullPath = path.join(outDir, name);
      return { fullPath, relativePath: path.relative(cwd, fullPath), content };
    });
  },
};

export default apiGenerator;
