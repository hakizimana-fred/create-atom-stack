export const colorsToken = `function token(variable: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

export const glass = {
  surface:      () => token('--glass-surface'),
  raised:       () => token('--glass-raised'),
  overlay:      () => token('--glass-overlay'),
  subtle:       () => token('--glass-subtle'),
  border:       () => token('--glass-border'),
  borderStrong: () => token('--glass-border-strong'),
} as const;

export const surface = {
  base:    () => token('--surface-base'),
  raised:  () => token('--surface-raised'),
  overlay: () => token('--surface-overlay'),
  sunken:  () => token('--surface-sunken'),
  page:    () => token('--page-bg'),
} as const;

export const text = {
  primary:   () => token('--text-primary'),
  secondary: () => token('--text-secondary'),
  tertiary:  () => token('--text-tertiary'),
  disabled:  () => token('--text-disabled'),
  inverse:   () => token('--text-inverse'),
} as const;

export const brand = {
  DEFAULT: () => token('--brand'),
  hover:   () => token('--brand-hover'),
  subtle:  () => token('--brand-subtle'),
  muted:   () => token('--brand-muted'),
  glow:    () => token('--brand-glow'),
} as const;

export const semantic = {
  success: () => token('--success'),
  error:   () => token('--error'),
  warning: () => token('--warning'),
} as const;
`;

export const typographyToken = `export const fontFamily = {
  sans: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  mono: "var(--font-geist-mono), ui-monospace, 'Fira Code', monospace",
} as const;

export const fontSize = {
  '2xs': ['0.625rem',  '1rem']      as const,
  xs:    ['0.75rem',   '1rem']      as const,
  sm:    ['0.8125rem', '1.25rem']   as const,
  base:  ['0.875rem',  '1.375rem']  as const,
  md:    ['0.9375rem', '1.5rem']    as const,
  lg:    ['1rem',      '1.5rem']    as const,
  xl:    ['1.125rem',  '1.75rem']   as const,
  '2xl': ['1.25rem',   '1.75rem']   as const,
  '3xl': ['1.5rem',    '2rem']      as const,
  '4xl': ['1.875rem',  '2.25rem']   as const,
  '5xl': ['2.25rem',   '2.5rem']    as const,
} as const;

export const fontWeight = {
  normal:   '400',
  medium:   '500',
  semibold: '600',
  bold:     '700',
} as const;
`;

export const spacingToken = `export const spacing = {
  '4.5': '1.125rem',
  '13':  '3.25rem',
  '15':  '3.75rem',
  '18':  '4.5rem',
  '22':  '5.5rem',
  '30':  '7.5rem',
  '55':  '13.75rem',
  '60':  '15rem',
} as const;

export const layout = {
  sidebar:         '64px',
  sidebarExpanded: '240px',
  header:          '56px',
  maxContent:      '1280px',
} as const;
`;

export const radiusToken = `export const radius = {
  none:  '0',
  xs:    '0.125rem',
  sm:    '0.25rem',
  md:    '0.375rem',
  lg:    '0.5rem',
  xl:    '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  pill:  '9999px',
} as const;
`;

export const shadowsToken = `export const shadow = {
  xs: '0 1px 2px rgba(0,0,0,0.05)',
  sm: '0 1px 3px rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)',
  md: '0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10)',
  lg: '0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)',
  xl: '0 20px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.10)',
} as const;

export const glassShadow = {
  xs: '0 1px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
  sm: '0 4px 16px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.09)',
  md: '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)',
  lg: '0 16px 48px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.15)',
} as const;

export const glow = {
  brand:   '0 0 20px rgba(99,102,241,0.40), 0 0 40px rgba(99,102,241,0.15)',
  success: '0 0 20px rgba(34,197,94,0.35),  0 0 40px rgba(34,197,94,0.15)',
  error:   '0 0 20px rgba(239,68,68,0.35),  0 0 40px rgba(239,68,68,0.15)',
} as const;
`;
