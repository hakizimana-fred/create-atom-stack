export function apiTs(camel: string, pascal: string): string {
  return `import type { ${pascal}, Create${pascal}Dto, Update${pascal}Dto } from './${camel}.types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api';

async function req<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(\`\${BASE}\${url}\`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    throw new Error(\`\${init?.method ?? 'GET'} \${url} → \${res.status} \${res.statusText}\`);
  }
  return res.json() as Promise<T>;
}

export const ${camel}Api = {
  list:   ()                               => req<${pascal}[]>('/${camel}'),
  get:    (id: string)                     => req<${pascal}>(\`/${camel}/\${id}\`),
  create: (body: Create${pascal}Dto)       => req<${pascal}>('/${camel}', { method: 'POST',  body: JSON.stringify(body) }),
  update: (id: string, body: Update${pascal}Dto) =>
    req<${pascal}>(\`/${camel}/\${id}\`,   { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id: string)                     => req<void>(\`/${camel}/\${id}\`, { method: 'DELETE' }),
} as const;
`;
}

export function apiTypesTs(pascal: string): string {
  return `export interface ${pascal} {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type Create${pascal}Dto = Omit<${pascal}, 'id' | 'createdAt' | 'updatedAt'>;
export type Update${pascal}Dto = Partial<Create${pascal}Dto>;
`;
}

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

export function apiIndexTs(camel: string, pascal: string): string {
  return `export { ${camel}Api } from './${camel}.api';
export type { ${pascal}, Create${pascal}Dto, Update${pascal}Dto } from './${camel}.types';
`;
}
