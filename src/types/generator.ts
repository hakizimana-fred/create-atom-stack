export type GeneratorType = 'component' | 'page' | 'feature' | 'store' | 'api';

export interface GeneratorContext {
  /** Raw name as given by user (e.g. "Button" or "dashboard/reports") */
  rawName: string;
  /** PascalCase of the last path segment (e.g. "Button", "Reports") */
  pascalName: string;
  /** camelCase of the last path segment (e.g. "button", "reports") */
  camelName: string;
  /** kebab-case of the last path segment (e.g. "button", "user-profile") */
  kebabName: string;
  /** Absolute resolved output directory for this generator */
  outDir: string;
  /** Whether to skip writing and only log what would be created */
  dry: boolean;
  /** Whether to overwrite existing files without prompting */
  force: boolean;
}

export interface GeneratedFile {
  /** Absolute path of the file to write */
  fullPath: string;
  /** Path relative to process.cwd() for display */
  relativePath: string;
  /** File contents */
  content: string;
}

export interface Generator {
  type: GeneratorType;
  /** Default base directory (relative to cwd) */
  defaultBaseDir: string;
  generate(ctx: GeneratorContext): GeneratedFile[];
}

export interface AddCommandOptions {
  type?: GeneratorType;
  name?: string;
  dir?: string;
  dry: boolean;
  force: boolean;
}
