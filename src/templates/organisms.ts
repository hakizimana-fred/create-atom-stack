export const headerOrganism = `'use client';

import Link from 'next/link';
import { Moon, Sun, Github } from 'lucide-react';
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
      <Link href="/" className="group flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-lg border border-brand/20 bg-brand-subtle transition-colors duration-base group-hover:bg-brand-muted">
          <span className="text-xs font-bold text-brand">A</span>
        </div>
        <span className="hidden text-sm font-semibold text-txt-primary sm:block">
          create-atom-stack
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-0.5">
        {NAV_LINKS.map((link) =>
          link.label === 'GitHub' ? (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-txt-secondary transition-colors duration-base hover:bg-glass hover:text-txt-primary"
            >
              <Github className="size-4 shrink-0" />
              <span className="hidden sm:block">GitHub</span>
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className="group relative hidden px-3 py-1.5 text-sm text-txt-secondary transition-colors duration-base hover:text-txt-primary sm:block"
            >
              {link.label}
              {/* Slide-in underline */}
              <span className="absolute bottom-0.5 left-3 right-3 h-px origin-left scale-x-0 bg-brand/50 transition-transform duration-base group-hover:scale-x-100" />
            </Link>
          ),
        )}

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="ml-1"
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
import { Github } from 'lucide-react';
import { NAV_LINKS } from '@/data/constants/navigation';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md border border-brand/20 bg-brand-subtle">
            <span className="text-xs font-bold text-brand">A</span>
          </div>
          <span className="text-sm font-semibold text-txt-primary">create-atom-stack</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-5">
          {NAV_LINKS.map((link) =>
            link.label === 'GitHub' ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
                className="flex items-center gap-1.5 text-sm text-txt-tertiary transition-colors duration-base hover:text-txt-primary"
              >
                <Github className="size-3.5" />
                <span>GitHub</span>
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-txt-tertiary transition-colors duration-base hover:text-txt-primary"
              >
                {link.label}
              </Link>
            ),
          )}
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
