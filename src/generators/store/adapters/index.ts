import type { SupportedStateManagement } from '../../../types/generator.js';
import { zustandAdapter }       from './zustand.js';
import { reduxToolkitAdapter }  from './redux-toolkit.js';
import { jotaiAdapter }         from './jotai.js';
import { mobxAdapter }          from './mobx.js';

type AdapterFn = (camel: string, pascal: string) => Record<string, string>;

const ADAPTERS: Record<Exclude<SupportedStateManagement, 'none'>, AdapterFn> = {
  'zustand':       zustandAdapter,
  'redux-toolkit': reduxToolkitAdapter,
  'jotai':         jotaiAdapter,
  'mobx':          mobxAdapter,
};

export function getStoreAdapter(sm: SupportedStateManagement): AdapterFn {
  if (sm === 'none' || !(sm in ADAPTERS)) return zustandAdapter;
  return ADAPTERS[sm as Exclude<SupportedStateManagement, 'none'>];
}
