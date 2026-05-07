export function mobxAdapter(camel: string, pascal: string): Record<string, string> {
  return {
    [`${camel}.store.ts`]: `import { makeAutoObservable, runInAction } from 'mobx';
import type { I${pascal}Store } from './${camel}.types';

class ${pascal}Store implements I${pascal}Store {
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  reset() {
    runInAction(() => {
      this.isLoading = false;
      this.error = null;
    });
  }

  async fetchData() {
    runInAction(() => { this.isLoading = true; this.error = null; });
    try {
      // TODO: replace with real API call
      runInAction(() => { this.isLoading = false; });
    } catch (err) {
      runInAction(() => {
        this.isLoading = false;
        this.error = (err as Error).message;
      });
    }
  }
}

export const ${camel}Store = new ${pascal}Store();
`,
    [`${camel}.types.ts`]: `export interface I${pascal}Store {
  isLoading: boolean;
  error: string | null;
  setLoading(isLoading: boolean): void;
  setError(error: string | null): void;
  reset(): void;
}
`,
    ['index.ts']: `export { ${camel}Store } from './${camel}.store';
export type { I${pascal}Store } from './${camel}.types';
`,
  };
}
