export const headerOrganism = `'use client';

import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { useUiStore } from '@/store/ui.store';
import { useScrollState } from '@/hooks/use-scroll-state';
import { NAV_LINKS } from '@/data/constants/navigation';
import { cn } from '@/lib/utils/cn';

export function Header() {
  const { theme, toggleTheme } = useUiStore();
  const scrolled = useScrollState();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex h-14 items-center justify-between px-4 sm:px-6',
        'transition-all duration-base',
        scrolled
          ? 'glass-topbar border-b border-border shadow-glass-xs'
          : 'bg-transparent',
      )}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="flex size-7 items-center justify-center rounded-lg border border-brand/20 bg-brand-subtle transition-colors duration-base group-hover:bg-brand-muted">
          <span className="text-xs font-bold text-brand">A</span>
        </div>
        <span className="hidden text-sm font-semibold text-txt-primary sm:block">
          create-atom-stack
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-1">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
            className="hidden px-3 py-1.5 text-sm text-txt-secondary transition-colors duration-base hover:text-txt-primary sm:block"
          >
            {link.label}
          </a>
        ))}

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>
      </nav>
    </header>
  );
}
`;

export const footerOrganism = `import Link from 'next/link';
import { NAV_LINKS } from '@/data/constants/navigation';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex size-6 items-center justify-center rounded-md border border-brand/20 bg-brand-subtle">
            <span className="text-xs font-bold text-brand">A</span>
          </div>
          <span className="text-sm font-semibold text-txt-primary">create-atom-stack</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="text-sm text-txt-tertiary transition-colors duration-base hover:text-txt-primary"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Legal */}
        <p className="text-xs text-txt-tertiary">
          © {year} create-atom-stack · MIT License
        </p>
      </div>
    </footer>
  );
}
`;
