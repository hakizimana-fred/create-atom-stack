# Design System

## Overview

The design system is **token-driven**: all visual decisions are CSS custom
properties in `src/app/globals.css`, mapped to Tailwind utilities via
`tailwind.config.ts`. Switching themes requires only changing `data-theme`
on `<html>`.

Dark mode is the **default**. Light mode is available by setting `data-theme="light"`.

---

## Color Tokens

### Surfaces

| Token | Tailwind | Usage |
|---|---|---|
| `--page-bg` | `bg-surface-page` | HTML background |
| `--surface-base` | `bg-surface-base` | Page content area |
| `--surface-raised` | `bg-surface` | Cards, panels |
| `--glass-surface` | `bg-glass` | Frosted glass overlays |

### Text

| Token | Tailwind | Usage |
|---|---|---|
| `--text-primary` | `text-txt-primary` | Main body text |
| `--text-secondary` | `text-txt-secondary` | Supporting text |
| `--text-tertiary` | `text-txt-tertiary` | Placeholders, hints |
| `--text-inverse` | `text-txt-inverse` | Text on colored bg |

### Interactive

| Token | Tailwind | Usage |
|---|---|---|
| `--brand` | `bg-brand / text-brand` | Primary actions |
| `--brand-hover` | `hover:bg-brand-hover` | Hover state |
| `--brand-subtle` | `bg-brand-subtle` | Active state chips |
| `--brand-glow` | — | Glow shadow accent |

### Semantic Status

| Token | Tailwind | Usage |
|---|---|---|
| `--success` | `text-success / bg-success` | Positive outcomes |
| `--error` | `text-error / bg-error` | Errors, destructive actions |
| `--warning` | `text-warning / bg-warning` | Caution states |

---

## Typography

The `Heading`, `Body`, `Label`, and `Caption` components from
`src/components/atoms/typography` cover all text patterns.

```tsx
<Heading level={1}>Page Title</Heading>
<Body size="lg" secondary>Supporting text</Body>
<Label tertiary>SECTION LABEL</Label>
<Caption>Small note</Caption>
```

---

## Glass Utilities

```html
<!-- Standard frosted panel -->
<div class="glass-panel rounded-xl p-4">...</div>

<!-- Elevated panel (modals, dropdowns) -->
<div class="glass-panel-raised rounded-2xl p-6">...</div>

<!-- Sticky header that activates on scroll -->
<header class="glass-topbar">...</header>
```

---

## Background Patterns

```html
<!-- Subtle grid lines (great for hero sections) -->
<div class="bg-grid">...</div>

<!-- Dot grid pattern -->
<div class="bg-dots">...</div>
```

---

## Layout Constants

| Token | Value | Tailwind |
|---|---|---|
| Sidebar (collapsed) | 64px | `w-sidebar` |
| Sidebar (expanded) | 240px | `w-sidebar-expanded` |
| Header height | 56px | `h-header` |
| Max content width | 1280px | `max-w-content` |
