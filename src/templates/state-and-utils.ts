/**
 * Standalone theme store — no external state library.
 * Used when stateManagement === 'none' | 'react-query'.
 */
export const uiStoreStandalone = `'use client';

import { useState, useCallback, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useUiStore() {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ui-theme') as Theme | null;
    const initial: Theme = stored ?? 'dark';
    setThemeState(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem('ui-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  }, []);

  const toggleTheme = useCallback(
    () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    [theme, setTheme],
  );

  const toggleSidebar = useCallback(() => setSidebarOpen((o) => !o), []);

  return { theme, sidebarOpen, setTheme, toggleTheme, toggleSidebar };
}
`;

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

/* ── Modular HTTP layer (src/lib/http/) ───────────────────────────────────── */

export const httpTypes = `export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: QueryParams;
  timeout?: number;
  body?: unknown;
}

export interface ApiErrorPayload {
  message?: string;
  code?: string;
  details?: unknown;
}

export interface RequestConfig {
  url: string;
  init: RequestInit;
}

export type RequestInterceptor  = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
export type ResponseInterceptor = (response: Response) => Response | Promise<Response>;
`;

export const httpErrors = `import type { ApiErrorPayload } from './types';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | undefined;
  readonly details: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export async function parseApiError(res: Response): Promise<ApiError> {
  const payload = await res.json().catch((): ApiErrorPayload => ({}));
  return new ApiError(
    payload.message ?? res.statusText,
    res.status,
    payload.code,
    payload.details,
  );
}
`;

export const httpInterceptors = `import type { RequestConfig, RequestInterceptor, ResponseInterceptor } from './types';

const requestInterceptors: RequestInterceptor[]  = [];
const responseInterceptors: ResponseInterceptor[] = [];

export function registerRequestInterceptor(fn: RequestInterceptor): () => void {
  requestInterceptors.push(fn);
  return () => {
    const i = requestInterceptors.indexOf(fn);
    if (i !== -1) requestInterceptors.splice(i, 1);
  };
}

export function registerResponseInterceptor(fn: ResponseInterceptor): () => void {
  responseInterceptors.push(fn);
  return () => {
    const i = responseInterceptors.indexOf(fn);
    if (i !== -1) responseInterceptors.splice(i, 1);
  };
}

export async function applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
  let current = config;
  for (const fn of requestInterceptors) current = await fn(current);
  return current;
}

export async function applyResponseInterceptors(response: Response): Promise<Response> {
  let current = response;
  for (const fn of responseInterceptors) current = await fn(current);
  return current;
}

/* ── Auth token injection ─────────────────────────────────────────────────── */

let authToken: string | null = null;

/** Inject a bearer token into every outgoing request. Call with null to clear. */
export function setAuthToken(token: string | null): void {
  authToken = token;
}

registerRequestInterceptor((config) => {
  if (!authToken) return config;
  const headers = new Headers(config.init.headers);
  headers.set('Authorization', \`Bearer \${authToken}\`);
  return { ...config, init: { ...config.init, headers } };
});
`;

export const httpClient = `import type { RequestOptions, RequestConfig } from './types';
import { parseApiError } from './errors';
import { applyRequestInterceptors, applyResponseInterceptors } from './interceptors';

// SSR-safe: server components need an absolute URL; browser can use relative paths.
const BASE_URL =
  typeof window === 'undefined'
    ? (process.env.API_URL ?? 'http://localhost:3000')
    : (process.env.NEXT_PUBLIC_API_URL ?? '');

function buildUrl(path: string, params?: RequestOptions['params']): string {
  if (!params) return BASE_URL + path;
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== null && v !== undefined) qs.append(k, String(v));
  }
  const query = qs.toString();
  return query ? \`\${BASE_URL}\${path}?\${query}\` : BASE_URL + path;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, timeout, body, headers, ...init } = options;

  // Skip Content-Type for FormData — browser sets multipart/form-data + boundary automatically.
  const resolvedHeaders: Record<string, string> = {};
  if (body !== undefined && !(body instanceof FormData)) {
    resolvedHeaders['Content-Type'] = 'application/json';
  }
  if (headers) Object.assign(resolvedHeaders, headers as Record<string, string>);

  const controller = new AbortController();
  const timer = timeout ? setTimeout(() => controller.abort(), timeout) : null;

  let config: RequestConfig = {
    url: buildUrl(path, params),
    init: {
      ...init,
      headers: resolvedHeaders,
      body: body instanceof FormData
        ? body
        : body !== undefined
          ? JSON.stringify(body)
          : undefined,
      signal: controller.signal,
    },
  };

  try {
    config = await applyRequestInterceptors(config);
    let response = await fetch(config.url, config.init);
    response = await applyResponseInterceptors(response);

    if (!response.ok) throw await parseApiError(response);

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  } finally {
    if (timer !== null) clearTimeout(timer);
  }
}

export const http = {
  get:    <T>(path: string, opts?: Omit<RequestOptions, 'body'>) =>
    request<T>(path, { method: 'GET', ...opts }),

  post:   <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { method: 'POST', body, ...opts }),

  put:    <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { method: 'PUT', body, ...opts }),

  patch:  <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { method: 'PATCH', body, ...opts }),

  delete: <T>(path: string, opts?: Omit<RequestOptions, 'body'>) =>
    request<T>(path, { method: 'DELETE', ...opts }),
};
`;

export const httpIndex = `export { http } from './client';
export { ApiError, isApiError } from './errors';
export { registerRequestInterceptor, registerResponseInterceptor, setAuthToken } from './interceptors';
export type {
  RequestOptions,
  QueryParams,
  ApiErrorPayload,
  RequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
} from './types';
`;

export const reactQueryProviders = `'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, retry: 1 },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
`;

export const usePostsQuery = `import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

interface Post {
  id: number;
  title: string;
  body: string;
}

export function usePosts() {
  return useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn:  () => http.get<Post[]>('/posts'),
  });
}
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
