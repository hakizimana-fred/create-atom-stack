export function storeTs(camel: string, pascal: string): string {
  return `import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { ${pascal}State, ${pascal}Actions } from './${camel}.types';

type ${pascal}Store = ${pascal}State & ${pascal}Actions;

const initialState: ${pascal}State = {
  isLoading: false,
  error: null,
};

export const use${pascal}Store = create<${pascal}Store>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setLoading: (isLoading) =>
          set({ isLoading }, false, '${camel}/setLoading'),

        setError: (error) =>
          set({ error }, false, '${camel}/setError'),

        reset: () =>
          set(initialState, false, '${camel}/reset'),
      }),
      { name: '${camel}-store' },
    ),
    { name: '${pascal}Store' },
  ),
);
`;
}

export function storeTypesTs(pascal: string): string {
  return `export interface ${pascal}State {
  isLoading: boolean;
  error: string | null;
}

export interface ${pascal}Actions {
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}
`;
}

export function storeIndexTs(camel: string, pascal: string): string {
  return `export { use${pascal}Store } from './${camel}.store';
export type { ${pascal}State, ${pascal}Actions } from './${camel}.types';
`;
}
