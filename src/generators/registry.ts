import type { Generator, GeneratorType } from '../types/generator.js';
import componentGenerator from './component/index.js';
import pageGenerator from './page/index.js';
import featureGenerator from './feature/index.js';
import storeGenerator from './store/index.js';
import apiGenerator from './api/index.js';

const REGISTRY = new Map<GeneratorType, Generator>([
  ['component', componentGenerator],
  ['page',      pageGenerator],
  ['feature',   featureGenerator],
  ['store',     storeGenerator],
  ['api',       apiGenerator],
]);

export const GENERATOR_TYPES = [...REGISTRY.keys()] as GeneratorType[];

export function getGenerator(type: GeneratorType): Generator {
  const gen = REGISTRY.get(type);
  if (!gen) throw new Error(`Unknown generator type: "${type}". Valid types: ${GENERATOR_TYPES.join(', ')}`);
  return gen;
}

export function isValidGeneratorType(value: string): value is GeneratorType {
  return REGISTRY.has(value as GeneratorType);
}
