export type ApiMode = 'crud' | 'query' | 'action' | 'custom';

/* ── Type import line ────────────────────────────────────────────────────── */

function buildImports(camel: string, pascal: string, useZod: boolean, mode: ApiMode): string {
  const httpImport = `import { http } from '@/lib/http';`;
  if (mode === 'custom') return httpImport;

  const source = useZod ? `./${camel}.schemas` : `./${camel}.types`;
  const names: string[] = [pascal];
  if (mode === 'crud' || mode === 'action') names.push(`Create${pascal}`, `Update${pascal}`);

  return `${httpImport}\nimport type { ${names.join(', ')} } from '${source}';`;
}

/* ── API method bodies per mode ──────────────────────────────────────────── */

function crudMethods(camel: string, pascal: string): string {
  return `export const ${camel}Api = {
  list:   ()                             => http.get<${pascal}[]>('/${camel}'),
  get:    (id: string)                   => http.get<${pascal}>(\`/${camel}/\${id}\`),
  create: (body: Create${pascal})        => http.post<${pascal}>('/${camel}', body),
  update: (id: string, body: Update${pascal}) =>
    http.patch<${pascal}>(\`/${camel}/\${id}\`, body),
  remove: (id: string)                   => http.delete<void>(\`/${camel}/\${id}\`),
} as const;`;
}

function queryMethods(camel: string, pascal: string): string {
  return `export const ${camel}Api = {
  list: ()             => http.get<${pascal}[]>('/${camel}'),
  get:  (id: string)   => http.get<${pascal}>(\`/${camel}/\${id}\`),
} as const;`;
}

function actionMethods(camel: string, pascal: string): string {
  return `export const ${camel}Api = {
  execute: (body: Create${pascal}) => http.post<${pascal}>('/${camel}', body),
} as const;`;
}

function customMethods(camel: string): string {
  return `export const ${camel}Api = {
  // TODO: add your API methods here
} as const;`;
}

/* ── Public factory ──────────────────────────────────────────────────────── */

export function apiTs(camel: string, pascal: string, mode: ApiMode, useZod: boolean): string {
  const imports = buildImports(camel, pascal, useZod, mode);
  let methods: string;
  switch (mode) {
    case 'query':  methods = queryMethods(camel, pascal);  break;
    case 'action': methods = actionMethods(camel, pascal); break;
    case 'custom': methods = customMethods(camel);         break;
    default:       methods = crudMethods(camel, pascal);
  }
  return `${imports}\n\n${methods}\n`;
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
