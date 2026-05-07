export function featureIndexTs(pascal: string): string {
  return `// ${pascal} feature — public API
// Export only what consumers outside this feature need.
export * from './types';
`;
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
