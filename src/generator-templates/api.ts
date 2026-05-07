export type ApiMode = 'crud' | 'query' | 'action' | 'custom';

/* ── Request helper (shared across all modes) ────────────────────────────── */

const REQ_HELPER = `const BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api';

async function req<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(\`\${BASE}\${url}\`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    throw new Error(\`\${init?.method ?? 'GET'} \${url} → \${res.status} \${res.statusText}\`);
  }
  return res.json() as Promise<T>;
}`;

/* ── Type import line ────────────────────────────────────────────────────── */

function typeImport(camel: string, pascal: string, useZod: boolean, mode: ApiMode): string {
  const source = useZod ? `./${camel}.schemas` : `./${camel}.types`;
  if (mode === 'custom') return '';

  const names: string[] = [pascal];
  if (mode === 'crud' || mode === 'action') names.push(`Create${pascal}`, `Update${pascal}`);

  return `import type { ${names.join(', ')} } from '${source}';\n\n`;
}

/* ── API method bodies per mode ──────────────────────────────────────────── */

function crudMethods(camel: string, pascal: string): string {
  return `export const ${camel}Api = {
  list:   ()                             => req<${pascal}[]>('/${camel}'),
  get:    (id: string)                   => req<${pascal}>(\`/${camel}/\${id}\`),
  create: (body: Create${pascal})        => req<${pascal}>('/${camel}', { method: 'POST',  body: JSON.stringify(body) }),
  update: (id: string, body: Update${pascal}) =>
    req<${pascal}>(\`/${camel}/\${id}\`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id: string)                   => req<void>(\`/${camel}/\${id}\`, { method: 'DELETE' }),
} as const;`;
}

function queryMethods(camel: string, pascal: string): string {
  return `export const ${camel}Api = {
  list: ()             => req<${pascal}[]>('/${camel}'),
  get:  (id: string)   => req<${pascal}>(\`/${camel}/\${id}\`),
} as const;`;
}

function actionMethods(camel: string, pascal: string): string {
  return `export const ${camel}Api = {
  execute: (body: Create${pascal}) =>
    req<${pascal}>('/${camel}', { method: 'POST', body: JSON.stringify(body) }),
} as const;`;
}

function customMethods(camel: string): string {
  return `export const ${camel}Api = {
  // TODO: add your API methods here
} as const;`;
}

/* ── Public factory ──────────────────────────────────────────────────────── */

export function apiTs(camel: string, pascal: string, mode: ApiMode, useZod: boolean): string {
  const imp = typeImport(camel, pascal, useZod, mode);
  let methods: string;
  switch (mode) {
    case 'query':  methods = queryMethods(camel, pascal);  break;
    case 'action': methods = actionMethods(camel, pascal); break;
    case 'custom': methods = customMethods(camel);         break;
    default:       methods = crudMethods(camel, pascal);
  }
  return `${imp}${REQ_HELPER}\n\n${methods}\n`;
}

/* ── Type sources ────────────────────────────────────────────────────────── */

export function apiSchemasTs(camel: string, pascal: string): string {
  return `import { z } from 'zod';

export const ${camel}Schema = z.object({
  id:        z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const create${pascal}Schema = ${camel}Schema.omit({ id: true, createdAt: true, updatedAt: true });
export const update${pascal}Schema = create${pascal}Schema.partial();

export type ${pascal}       = z.infer<typeof ${camel}Schema>;
export type Create${pascal} = z.infer<typeof create${pascal}Schema>;
export type Update${pascal} = z.infer<typeof update${pascal}Schema>;
`;
}

export function apiTypesTs(pascal: string): string {
  return `export interface ${pascal} {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type Create${pascal} = Omit<${pascal}, 'id' | 'createdAt' | 'updatedAt'>;
export type Update${pascal} = Partial<Create${pascal}>;
`;
}

/* ── Barrel ──────────────────────────────────────────────────────────────── */

export function apiIndexTs(camel: string, pascal: string, useZod: boolean): string {
  const typesSource = useZod ? `./${camel}.schemas` : `./${camel}.types`;
  return `export { ${camel}Api } from './${camel}.api';
export type { ${pascal}, Create${pascal}, Update${pascal} } from '${typesSource}';
`;
}
