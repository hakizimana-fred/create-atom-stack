import Link from 'next/link';
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
