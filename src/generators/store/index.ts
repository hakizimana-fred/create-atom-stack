import path from 'path';
import type { Generator, GeneratorContext, GeneratedFile } from '../../types/generator.js';
import { resolveStateManagement } from '../../resolvers/state-management.js';
import { getStoreAdapter } from './adapters/index.js';
import { log } from '../../utils/logger.js';
import chalk from 'chalk';

const storeGenerator: Generator = {
  type: 'store',
  defaultBaseDir: 'src/store',

  async generate(ctx: GeneratorContext): Promise<GeneratedFile[]> {
    const { camelName, pascalName, outDir } = ctx;
    const cwd = process.cwd();

    const sm = await resolveStateManagement();
    log.info(chalk.dim(`Using ${chalk.white(sm)} adapter`));

    const adapter = getStoreAdapter(sm);
    const fileMap = adapter(camelName, pascalName);

    return Object.entries(fileMap).map(([name, content]) => {
      const fullPath = path.join(outDir, name);
      return { fullPath, relativePath: path.relative(cwd, fullPath), content };
    });
  },
};

export default storeGenerator;
