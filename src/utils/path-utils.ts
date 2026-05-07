import path from 'path';

export function toPascalCase(str: string): string {
  return str
    .replace(/[-_/](.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (_, c: string) => c.toUpperCase());
}

export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
    .replace(/[_/]/g, '-');
}

/** Returns the last segment of a path or name (e.g. "dashboard/reports" → "reports"). */
export function getBaseName(name: string): string {
  return path.basename(name.replace(/\\/g, '/'));
}

/** Resolves segments relative to cwd. */
export function resolveCwd(...segments: string[]): string {
  return path.resolve(process.cwd(), ...segments);
}
