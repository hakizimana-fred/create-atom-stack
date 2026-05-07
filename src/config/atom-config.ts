import fs from 'fs';
import path from 'path';
import type { SupportedStateManagement } from '../types/generator.js';

export interface AtomConfig {
  framework?: 'nextjs' | 'vite' | 'remix';
  router?: 'app' | 'pages';
  stateManagement?: SupportedStateManagement;
  styling?: 'tailwind' | 'css-modules' | 'styled-components';
  typescript?: boolean;
}

const CONFIG_FILE = 'atom.config.json';

export function readAtomConfig(cwd = process.cwd()): AtomConfig | null {
  const configPath = path.join(cwd, CONFIG_FILE);
  if (!fs.existsSync(configPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8')) as AtomConfig;
  } catch {
    return null;
  }
}

export function writeAtomConfig(config: AtomConfig, cwd = process.cwd()): void {
  const configPath = path.join(cwd, CONFIG_FILE);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf-8');
}

export function patchAtomConfig(updates: Partial<AtomConfig>, cwd = process.cwd()): void {
  const existing = readAtomConfig(cwd) ?? {};
  writeAtomConfig({ ...existing, ...updates }, cwd);
}
