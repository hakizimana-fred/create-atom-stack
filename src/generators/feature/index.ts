import path from 'path';
import type { Generator, GeneratorContext, GeneratedFile } from '../../types/generator.js';
import { featureIndexTs, featureTypesIndexTs, featureBarrelTs } from '../../generator-templates/feature.js';

const VALID_SUBDIRS = ['components', 'hooks', 'services', 'store', 'utils', 'types'] as const;
type FeatureSubdir = (typeof VALID_SUBDIRS)[number];

const featureGenerator: Generator = {
  type: 'feature',
  defaultBaseDir: 'src/features',

  generate(ctx: GeneratorContext): GeneratedFile[] {
    const { pascalName, outDir } = ctx;
    const cwd = process.cwd();

    const extraDirs = ((ctx.extra?.with as string[] | undefined) ?? [])
      .filter((d): d is FeatureSubdir => (VALID_SUBDIRS as readonly string[]).includes(d));

    const files: GeneratedFile[] = [];
    const add = (rel: string, content: string) => {
      const fullPath = path.join(outDir, rel);
      files.push({ fullPath, relativePath: path.relative(cwd, fullPath), content });
    };

    add('index.ts', featureIndexTs(pascalName, extraDirs));

    for (const dir of extraDirs) {
      if (dir === 'types') {
        add('types/index.ts', featureTypesIndexTs(pascalName));
      } else {
        add(`${dir}/index.ts`, featureBarrelTs(dir));
      }
    }

    return files;
  },
};

export default featureGenerator;
