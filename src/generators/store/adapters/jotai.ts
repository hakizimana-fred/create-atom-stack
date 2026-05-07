export function jotaiAdapter(camel: string, pascal: string): Record<string, string> {
  return {
    [`${camel}.atoms.ts`]: `import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { ${pascal}State } from './${camel}.types';

const defaultState: ${pascal}State = {
  isLoading: false,
  error: null,
};

/** Persistent atom — survives page refresh via localStorage. */
export const ${camel}Atom = atomWithStorage<${pascal}State>('${camel}', defaultState);

/** Derived loading atom. */
export const ${camel}LoadingAtom = atom(
  (get) => get(${camel}Atom).isLoading,
  (_get, set, isLoading: boolean) =>
    set(${camel}Atom, (prev) => ({ ...prev, isLoading })),
);

/** Derived error atom. */
export const ${camel}ErrorAtom = atom(
  (get) => get(${camel}Atom).error,
  (_get, set, error: string | null) =>
    set(${camel}Atom, (prev) => ({ ...prev, error })),
);

/** Reset atom to its default state. */
export const reset${pascal}Atom = atom(null, (_get, set) => {
  set(${camel}Atom, defaultState);
});
`,
    [`${camel}.types.ts`]: `export interface ${pascal}State {
  isLoading: boolean;
  error: string | null;
}
`,
    ['index.ts']: `export {
  ${camel}Atom,
  ${camel}LoadingAtom,
  ${camel}ErrorAtom,
  reset${pascal}Atom,
} from './${camel}.atoms';
export type { ${pascal}State } from './${camel}.types';
`,
  };
}
