export type GeneratorType =
  | 'component'
  | 'atom'
  | 'molecule'
  | 'organism'
  | 'template'
  | 'page'
  | 'feature'
  | 'store'
  | 'api';

export type AtomicLevel = 'atom' | 'molecule' | 'organism' | 'template';

export type SupportedStateManagement =
  | 'zustand'
  | 'redux-toolkit'
  | 'jotai'
  | 'mobx'
  | 'none';

export interface GeneratorContext {
  /** Raw name as given by user (e.g. "Button" or "dashboard/[id]") */
  rawName: string;
  /** PascalCase of the last path segment */
  pascalName: string;
  /** camelCase of the last path segment */
  camelName: string;
  /** kebab-case of the last path segment */
  kebabName: string;
  /** Absolute resolved output directory */
  outDir: string;
  /** Skip writing, only log what would be created */
  dry: boolean;
  /** Overwrite existing files without prompting */
  force: boolean;
}

export interface GeneratedFile {
  fullPath: string;
  /** Relative to process.cwd() — shown to the user */
  relativePath: string;
  content: string;
}

export interface Generator {
  type: GeneratorType;
  /** Default base directory (relative to cwd) */
  defaultBaseDir: string;
  generate(ctx: GeneratorContext): GeneratedFile[] | Promise<GeneratedFile[]>;
}

export interface AddCommandOptions {
  type?: GeneratorType;
  name?: string;
  dir?: string;
  dry: boolean;
  force: boolean;
}
