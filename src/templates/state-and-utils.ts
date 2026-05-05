export const jotaiStore = `import { atom } from 'jotai';

type Theme = 'light' | 'dark';

export const themeAtom = atom<Theme>('dark');
export const sidebarOpenAtom = atom<boolean>(true);
`;

export const uiStore = `import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface UiState {
  theme: Theme;
  sidebarOpen: boolean;
}

interface UiActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState & UiActions>()((set) => ({
  theme: 'dark',
  sidebarOpen: true,

  setTheme: (theme) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    set({ theme });
  },

  toggleTheme: () =>
    set((state) => {
      const next: Theme = state.theme === 'dark' ? 'light' : 'dark';
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', next);
      }
      return { theme: next };
    }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
`;

export const commonTypes = `export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: ApiError };

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  column: string;
  direction: SortDirection;
}

export type ID = string | number;
`;

export const typesIndex = `export * from './common';
`;

export const cnUtil = `export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
`;

export const formatUtil = `const NUMBER_FORMATTER = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const COMPACT_FORMATTER = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const PERCENT_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric', month: 'short', day: '2-digit',
});

const DATETIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric', month: 'short', day: '2-digit',
  hour: '2-digit', minute: '2-digit',
});

export function formatNumber(value: number): string {
  return NUMBER_FORMATTER.format(value);
}

export function formatCompact(value: number): string {
  return COMPACT_FORMATTER.format(value);
}

export function formatPercent(value: number): string {
  return PERCENT_FORMATTER.format(value / 100);
}

export function formatDate(date: Date | string): string {
  return DATE_FORMATTER.format(new Date(date));
}

export function formatDatetime(date: Date | string): string {
  return DATETIME_FORMATTER.format(new Date(date));
}
`;

export const apiClient = `const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...init } = options;

  let url = BASE_URL + path;
  if (params) {
    const query = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    );
    url += '?' + query.toString();
  }

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...headers },
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error(body?.message ?? res.statusText), {
      status: res.status,
      code: body?.code,
    });
  }

  return res.json() as Promise<T>;
}

export const api = {
  get:    <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { method: 'GET', ...opts }),

  post:   <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body), ...opts }),

  put:    <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body), ...opts }),

  patch:  <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body), ...opts }),

  delete: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { method: 'DELETE', ...opts }),
};
`;

export const useScrollState = `'use client';

import { useEffect, useState } from 'react';

export function useScrollState(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
`;

export const navigationConstants = `export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Docs',   href: '/docs' },
  { label: 'GitHub', href: 'https://github.com/hakizimana-fred/create-atom-stack', external: true },
];
`;
