import path from 'path';
import type { Generator, GeneratorContext, GeneratedFile } from '../../types/generator.js';
import { featureIndexTs, featureTypesIndexTs, featureBarrelTs } from '../../generator-templates/feature.js';

const SUBDIRS = ['components', 'hooks', 'services', 'store', 'utils'] as const;

const featureGenerator: Generator = {
  type: 'feature',
  defaultBaseDir: 'src/features',

  generate(ctx: GeneratorContext): GeneratedFile[] {
    const { pascalName, outDir } = ctx;
    const cwd = process.cwd();

    const files: GeneratedFile[] = [];

    const add = (rel: string, content: string) => {
      const fullPath = path.join(outDir, rel);
      files.push({ fullPath, relativePath: path.relative(cwd, fullPath), content });
    };

    add('index.ts', featureIndexTs(pascalName));
    add('types/index.ts', featureTypesIndexTs(pascalName));

    for (const dir of SUBDIRS) {
      add(`${dir}/index.ts`, featureBarrelTs(dir));
    }

    return files;
  },
};

export default featureGenerator;
