import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Nogit Test', template: '%s | Nogit Test' },
  description: 'Built with create-atom-stack — a production-ready Next.js starter.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={[
          GeistSans.variable,
          GeistMono.variable,
          'antialiased font-sans text-base text-txt-primary bg-surface-page min-h-dvh',
        ].join(' ')}
      >
        {children}
      </body>
    </html>
  );
}
