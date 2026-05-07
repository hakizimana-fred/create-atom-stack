/**
 * Route parser for Next.js App Router conventions.
 *
 * Handles:
 *   dashboard/[id]          — dynamic segment
 *   blog/[...slug]          — catch-all
 *   docs/[[...all]]         — optional catch-all
 *   (marketing)/about       — route group (folded out of URL)
 *
 * Shell note: brackets are glob characters in zsh/bash.
 * Users MUST quote dynamic paths:
 *   create-atom-stack add page "dashboard/[id]"
 */

export type SegmentKind =
  | 'static'
  | 'dynamic'
  | 'catch-all'
  | 'optional-catch-all'
  | 'group';

export interface RouteSegment {
  raw: string;
  kind: SegmentKind;
  /** The bare param name — "id" from "[id]", "slug" from "[...slug]" */
  name: string;
}

export interface DynamicParam {
  name: string;
  tsType: string; // 'string' | 'string[]' | 'string[] | undefined'
}

export interface ParsedRoute {
  /** Cleaned input path, forward-slash normalized */
  rawPath: string;
  /** Path used for directory creation (same as rawPath) */
  outputPath: string;
  /** PascalCase component name derived from last non-group segment */
  componentName: string;
  /** Human-readable page title */
  pageTitle: string;
  /** True when any dynamic/catch-all segment is present */
  isDynamic: boolean;
  /** Dynamic params for the TypeScript Params interface */
  dynamicParams: DynamicParam[];
}

/* ── Segment parser ───────────────────────────────────────────────────────── */

function parseSegment(seg: string): RouteSegment {
  // Route group: (name)
  if (/^\(.+\)$/.test(seg)) {
    return { raw: seg, kind: 'group', name: seg.slice(1, -1) };
  }
  // Optional catch-all: [[...name]]
  if (/^\[\[\.\.\..+\]\]$/.test(seg)) {
    const name = seg.slice(5, -2);
    return { raw: seg, kind: 'optional-catch-all', name };
  }
  // Catch-all: [...name]
  if (/^\[\.\.\..+\]$/.test(seg)) {
    const name = seg.slice(4, -1);
    return { raw: seg, kind: 'catch-all', name };
  }
  // Dynamic: [name]
  if (/^\[.+\]$/.test(seg)) {
    const name = seg.slice(1, -1);
    return { raw: seg, kind: 'dynamic', name };
  }
  return { raw: seg, kind: 'static', name: seg };
}

/* ── Public API ───────────────────────────────────────────────────────────── */

export function parseRoute(rawInput: string): ParsedRoute {
  const rawPath = rawInput.trim().replace(/\\/g, '/').replace(/^\/|\/$/g, '');
  const parts = rawPath.split('/').filter(Boolean);
  const segments = parts.map(parseSegment);

  // Component name comes from the last non-group segment
  const meaningfulSegs = segments.filter((s) => s.kind !== 'group');
  const last = meaningfulSegs[meaningfulSegs.length - 1] ?? segments[segments.length - 1];
  const componentName = toPascal(last.name);

  // Build page title from all non-group segments
  const titleParts = segments
    .filter((s) => s.kind !== 'group')
    .map((s) => s.name.charAt(0).toUpperCase() + s.name.slice(1));
  const pageTitle = titleParts.join(' ');

  // Collect dynamic params
  const dynamicParams: DynamicParam[] = segments
    .filter((s) => s.kind !== 'static' && s.kind !== 'group')
    .map((s) => ({
      name: s.name,
      tsType:
        s.kind === 'optional-catch-all' ? 'string[] | undefined'
        : s.kind === 'catch-all'        ? 'string[]'
        : 'string',
    }));

  return {
    rawPath,
    outputPath: rawPath,
    componentName,
    pageTitle,
    isDynamic: dynamicParams.length > 0,
    dynamicParams,
  };
}

function toPascal(s: string): string {
  return s
    .replace(/[-_](.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (_, c: string) => c.toUpperCase());
}
