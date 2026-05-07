export const rxCounterService = `import { BehaviorSubject, map } from 'rxjs';

const _count$ = new BehaviorSubject(0);

export const count$ = _count$.asObservable();
export const doubled$ = count$.pipe(map((n) => n * 2));

export const counterService = {
  increment: () => _count$.next(_count$.getValue() + 1),
  decrement: () => _count$.next(_count$.getValue() - 1),
  reset:     () => _count$.next(0),
};
`;

export const useObservable = `'use client';

import { useEffect, useState } from 'react';
import type { Observable } from 'rxjs';

export function useObservable<T>(observable: Observable<T>, initialValue: T): T {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const sub = observable.subscribe(setValue);
    return () => sub.unsubscribe();
  }, [observable]);

  return value;
}
`;

export const toggleMachineTemplate = `import { createMachine } from 'xstate';

export const toggleMachine = createMachine({
  id: 'toggle',
  initial: 'off',
  states: {
    off: { on: { TOGGLE: 'on'  } },
    on:  { on: { TOGGLE: 'off' } },
  },
});
`;

export const useToggleMachine = `'use client';

import { useMachine } from '@xstate/react';
import { toggleMachine } from '@/lib/machines/toggle.machine';

export function useToggleMachine() {
  const [state, send] = useMachine(toggleMachine);
  return {
    isOn:   state.matches('on'),
    toggle: () => send({ type: 'TOGGLE' }),
  };
}
`;
