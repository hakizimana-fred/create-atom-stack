export function featureIndexTs(pascal: string, extraDirs: string[] = []): string {
  const typeReexport = extraDirs.includes('types') ? `export * from './types';\n` : '';
  const placeholder  = typeReexport ? '' : 'export {};\n';
  return `// ${pascal} feature — public API\n${placeholder}${typeReexport}`;
}

export function featureTypesIndexTs(pascal: string): string {
  return `export interface ${pascal}Entity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ${pascal}State {
  isLoading: boolean;
  error: string | null;
}
`;
}

export function featureBarrelTs(dirName: string): string {
  return `// ${dirName} — add exports here\n`;
}
