export const fontFamily = {
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
