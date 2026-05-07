export function reduxToolkitAdapter(camel: string, pascal: string): Record<string, string> {
  return {
    [`${camel}.slice.ts`]: `import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ${pascal}State } from './${camel}.types';

const initialState: ${pascal}State = {
  isLoading: false,
  error: null,
};

export const fetch${pascal} = createAsyncThunk(
  '${camel}/fetch',
  async (_: void, { rejectWithValue }) => {
    try {
      // TODO: replace with real API call
      return {};
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

export const ${camel}Slice = createSlice({
  name: '${camel}',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    reset: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetch${pascal}.pending,  (state) => { state.isLoading = true;  state.error = null; })
      .addCase(fetch${pascal}.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      })
      .addCase(fetch${pascal}.fulfilled, (state) => { state.isLoading = false; });
  },
});

export const ${camel}Reducer  = ${camel}Slice.reducer;
export const ${camel}Actions  = ${camel}Slice.actions;
`,
    [`${camel}.types.ts`]: `export interface ${pascal}State {
  isLoading: boolean;
  error: string | null;
}
`,
    ['index.ts']: `export { ${camel}Reducer, ${camel}Actions, fetch${pascal} } from './${camel}.slice';
export type { ${pascal}State } from './${camel}.types';
`,
  };
}
