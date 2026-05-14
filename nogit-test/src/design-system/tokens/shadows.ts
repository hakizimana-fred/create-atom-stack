export const shadow = {
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
