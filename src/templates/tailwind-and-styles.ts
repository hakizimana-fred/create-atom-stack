export const tailwindConfig = `import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],

  darkMode: ['class', '[data-theme="dark"]'],

  theme: {
    extend: {
      colors: {
        glass: {
          DEFAULT: 'var(--glass-surface)',
          raised: 'var(--glass-raised)',
          overlay: 'var(--glass-overlay)',
          subtle: 'var(--glass-subtle)',
          border: 'var(--glass-border)',
          'border-strong': 'var(--glass-border-strong)',
          glow: 'var(--glass-glow)',
        },
        surface: {
          DEFAULT: 'var(--surface-raised)',
          base: 'var(--surface-base)',
          overlay: 'var(--surface-overlay)',
          sunken: 'var(--surface-sunken)',
          page: 'var(--page-bg)',
          soft: 'var(--surface-soft)',
        },
        txt: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          disabled: 'var(--text-disabled)',
          inverse: 'var(--text-inverse)',
          link: 'var(--text-link)',
        },
        border: {
          DEFAULT: 'var(--border-default)',
          strong: 'var(--border-strong)',
          focus: 'var(--border-focus)',
          light: 'var(--border-light)',
          divider: 'var(--border-divider)',
        },
        brand: {
          DEFAULT: 'var(--brand)',
          hover: 'var(--brand-hover)',
          subtle: 'var(--brand-subtle)',
          muted: 'var(--brand-muted)',
          glow: 'var(--brand-glow)',
        },
        success: {
          DEFAULT: 'var(--success)',
          subtle: 'var(--success-subtle)',
          text: 'var(--success-text)',
        },
        error: {
          DEFAULT: 'var(--error)',
          subtle: 'var(--error-subtle)',
          text: 'var(--error-text)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          subtle: 'var(--warning-subtle)',
          text: 'var(--warning-text)',
        },
        status: {
          success: {
            DEFAULT: 'var(--status-success)',
            bg: 'var(--status-success-bg)',
            text: 'var(--status-success-text)',
          },
          error: {
            DEFAULT: 'var(--status-error)',
            bg: 'var(--status-error-bg)',
            text: 'var(--status-error-text)',
          },
          info: {
            DEFAULT: 'var(--status-info)',
            bg: 'var(--status-info-bg)',
            text: 'var(--status-info-text)',
          },
          warning: {
            DEFAULT: 'var(--status-warning)',
            bg: 'var(--status-warning-bg)',
            text: 'var(--status-warning-text)',
          },
        },
      },

      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', '"Fira Code"', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        xs:   ['0.75rem',  { lineHeight: '1rem' }],
        sm:   ['0.8125rem',{ lineHeight: '1.25rem' }],
        base: ['0.875rem', { lineHeight: '1.375rem' }],
        md:   ['0.9375rem',{ lineHeight: '1.5rem' }],
        lg:   ['1rem',     { lineHeight: '1.5rem' }],
        xl:   ['1.125rem', { lineHeight: '1.75rem' }],
        '2xl':['1.25rem',  { lineHeight: '1.75rem' }],
        '3xl':['1.5rem',   { lineHeight: '2rem' }],
        '4xl':['1.875rem', { lineHeight: '2.25rem' }],
        '5xl':['2.25rem',  { lineHeight: '2.5rem' }],
      },

      borderRadius: {
        none: '0',
        xs:   '0.125rem',
        sm:   '0.25rem',
        md:   '0.375rem',
        lg:   '0.5rem',
        xl:   '0.75rem',
        '2xl':'1rem',
        '3xl':'1.5rem',
        pill: '9999px',
      },

      boxShadow: {
        xs: '0 1px 2px rgba(0,0,0,0.05)',
        sm: '0 1px 3px rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)',
        md: '0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10)',
        lg: '0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)',
        xl: '0 20px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.10)',
        'glass-xs': '0 1px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glass-sm': '0 4px 16px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.09)',
        'glass-md': '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)',
        'glass-lg': '0 16px 48px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.15)',
        'glow-brand':   '0 0 20px var(--brand-glow), 0 0 40px var(--brand-glow)',
        'glow-success': '0 0 20px rgba(34,197,94,0.35), 0 0 40px rgba(34,197,94,0.15)',
        'glow-error':   '0 0 20px rgba(239,68,68,0.35), 0 0 40px rgba(239,68,68,0.15)',
        card:           '0 1px 3px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card-hover':   '0 8px 24px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.08)',
        dropdown:       '0 16px 48px rgba(0,0,0,0.60), 0 4px 16px rgba(0,0,0,0.30)',
        'tab-active':   '0 2px 12px var(--brand-glow)',
        none: 'none',
      },

      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
        '22':  '5.5rem',
        '30':  '7.5rem',
        '55':  '13.75rem',
        '60':  '15rem',
      },

      width: {
        sidebar: '64px',
        'sidebar-expanded': '240px',
        content: '1280px',
      },
      height: {
        header:  '56px',
        topbar:  '56px',
        'table-row': '52px',
      },
      maxWidth: {
        content: '1280px',
      },

      transitionDuration: {
        fast:   '100ms',
        base:   '200ms',
        slow:   '300ms',
        spring: '500ms',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.30, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        glass:  'cubic-bezier(0.40, 0, 0.20, 1)',
      },

      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%':   { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },

      animation: {
        'fade-in':    'fade-in 250ms cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-in-up': 'fade-in-up 350ms cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-in':   'slide-in 250ms cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in':   'scale-in 180ms cubic-bezier(0.34,1.56,0.64,1) forwards',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        shimmer:      'shimmer 2s linear infinite',
        float:        'float 4s ease-in-out infinite',
      },
    },
  },

  plugins: [],
};

export default config;
`;

export const globalsCss = `@import 'tailwindcss';

@config "../../tailwind.config.ts";

@layer base {
  button,
  a,
  [role='button'] {
    cursor: pointer;
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS  — dark theme default
──────────────────────────────────────────────────────────────────────────────*/

:root {
  --page-bg: #09090b;

  /* ── Surfaces ────────────────────────────────────────────────────────────── */
  --surface-base:    #0f0f13;
  --surface-raised:  #18181b;
  --surface-overlay: #27272a;
  --surface-sunken:  #05050a;
  --surface-soft:    #141418;

  /* ── Glass surfaces ──────────────────────────────────────────────────────── */
  --glass-surface:       rgba(24, 24, 27, 0.72);
  --glass-raised:        rgba(39, 39, 42, 0.90);
  --glass-overlay:       rgba(50, 50, 54, 0.98);
  --glass-subtle:        rgba(24, 24, 27, 0.50);
  --glass-border:        rgba(255, 255, 255, 0.07);
  --glass-border-strong: rgba(255, 255, 255, 0.12);
  --glass-glow:          rgba(255, 255, 255, 0.05);

  /* ── Text ────────────────────────────────────────────────────────────────── */
  --text-primary:   #fafafa;
  --text-secondary: #a1a1aa;
  --text-tertiary:  #52525b;
  --text-disabled:  #3f3f46;
  --text-inverse:   #09090b;
  --text-link:      #818cf8;

  /* ── Borders ─────────────────────────────────────────────────────────────── */
  --border-default: #27272a;
  --border-strong:  #3f3f46;
  --border-focus:   #6366f1;
  --border-light:   #18181b;
  --border-divider: #27272a;

  /* ── Brand (indigo) ──────────────────────────────────────────────────────── */
  --brand:        #6366f1;
  --brand-hover:  #4f46e5;
  --brand-subtle: rgba(99, 102, 241, 0.12);
  --brand-muted:  rgba(99, 102, 241, 0.20);
  --brand-glow:   rgba(99, 102, 241, 0.35);

  /* ── Semantic status ─────────────────────────────────────────────────────── */
  --success:        #22c55e;
  --success-subtle: rgba(34, 197, 94, 0.12);
  --success-text:   #4ade80;

  --error:          #ef4444;
  --error-subtle:   rgba(239, 68, 68, 0.12);
  --error-text:     #f87171;

  --warning:        #f59e0b;
  --warning-subtle: rgba(245, 158, 11, 0.12);
  --warning-text:   #fbbf24;

  /* ── Status chips ────────────────────────────────────────────────────────── */
  --status-success:       #22c55e;
  --status-success-bg:    rgba(34, 197, 94, 0.10);
  --status-success-text:  #4ade80;

  --status-error:         #ef4444;
  --status-error-bg:      rgba(239, 68, 68, 0.10);
  --status-error-text:    #f87171;

  --status-info:          #6366f1;
  --status-info-bg:       rgba(99, 102, 241, 0.10);
  --status-info-text:     #818cf8;

  --status-warning:       #f59e0b;
  --status-warning-bg:    rgba(245, 158, 11, 0.10);
  --status-warning-text:  #fbbf24;
}

/* Light theme override */
[data-theme='light'] {
  --page-bg: #fafafa;

  --surface-base:    #ffffff;
  --surface-raised:  #f4f4f5;
  --surface-overlay: #e4e4e7;
  --surface-sunken:  #f1f1f3;
  --surface-soft:    #f9f9fb;

  --glass-surface:       rgba(255, 255, 255, 0.70);
  --glass-raised:        rgba(255, 255, 255, 0.95);
  --glass-overlay:       rgba(255, 255, 255, 0.99);
  --glass-subtle:        rgba(255, 255, 255, 0.50);
  --glass-border:        rgba(0, 0, 0, 0.06);
  --glass-border-strong: rgba(0, 0, 0, 0.12);
  --glass-glow:          rgba(255, 255, 255, 0.80);

  --text-primary:   #09090b;
  --text-secondary: #52525b;
  --text-tertiary:  #a1a1aa;
  --text-disabled:  #d4d4d8;
  --text-inverse:   #fafafa;
  --text-link:      #4f46e5;

  --border-default: #e4e4e7;
  --border-strong:  #d4d4d8;
  --border-focus:   #6366f1;
  --border-light:   #f4f4f5;
  --border-divider: #e4e4e7;

  --brand:        #6366f1;
  --brand-hover:  #4f46e5;
  --brand-subtle: rgba(99, 102, 241, 0.08);
  --brand-muted:  rgba(99, 102, 241, 0.15);
  --brand-glow:   rgba(99, 102, 241, 0.25);

  --success:        #16a34a;
  --success-subtle: rgba(22, 163, 74, 0.08);
  --success-text:   #15803d;

  --error:          #dc2626;
  --error-subtle:   rgba(220, 38, 38, 0.08);
  --error-text:     #b91c1c;

  --warning:        #d97706;
  --warning-subtle: rgba(217, 119, 6, 0.08);
  --warning-text:   #b45309;

  --status-success:       #16a34a;
  --status-success-bg:    #dcfce7;
  --status-success-text:  #15803d;

  --status-error:         #dc2626;
  --status-error-bg:      #fee2e2;
  --status-error-text:    #b91c1c;

  --status-info:          #4f46e5;
  --status-info-bg:       #ede9fe;
  --status-info-text:     #4338ca;

  --status-warning:       #d97706;
  --status-warning-bg:    #fef3c7;
  --status-warning-text:  #92400e;
}

/* ─────────────────────────────────────────────────────────────────────────────
   BASE STYLES
──────────────────────────────────────────────────────────────────────────────*/

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  text-rendering: optimizeLegibility;
  scroll-behavior: smooth;
}

:focus-visible {
  outline: none;
}

/* ─────────────────────────────────────────────────────────────────────────────
   GLASS COMPOUND UTILITIES
──────────────────────────────────────────────────────────────────────────────*/

@layer utilities {
  .glass-panel {
    background: var(--glass-surface);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border: 1px solid var(--glass-border);
  }

  .glass-panel-raised {
    background: var(--glass-raised);
    backdrop-filter: blur(20px) saturate(200%);
    -webkit-backdrop-filter: blur(20px) saturate(200%);
    border: 1px solid var(--glass-border-strong);
  }

  .glass-panel-overlay {
    background: var(--glass-overlay);
    backdrop-filter: blur(28px) saturate(220%);
    -webkit-backdrop-filter: blur(28px) saturate(220%);
    border: 1px solid var(--glass-border-strong);
  }

  .glass-topbar {
    background: var(--glass-surface);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid var(--glass-border);
  }

  .bg-grid {
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .bg-dots {
    background-image:
      radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.06) 1px, transparent 0);
    background-size: 32px 32px;
  }

  .gradient-text {
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }

  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }

  .glow-brand {
    box-shadow: 0 0 24px var(--brand-glow), 0 0 48px var(--brand-glow);
  }
}
`;
