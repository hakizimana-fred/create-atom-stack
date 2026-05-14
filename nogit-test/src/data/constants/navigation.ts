export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Docs',   href: '/docs' },
  { label: 'GitHub', href: 'https://github.com/hakizimana-fred/create-atom-stack', external: true },
];
