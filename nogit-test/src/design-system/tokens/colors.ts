function token(variable: string): string {
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
