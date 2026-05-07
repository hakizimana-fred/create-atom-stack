import type { AtomicLevel } from '../types/generator.js';

const LEVEL_COMMENT: Record<AtomicLevel, string> = {
  atom:      '// Atom — smallest reusable unit; no composed sub-components',
  molecule:  '// Molecule — composes atoms into a focused, single-purpose unit',
  organism:  '// Organism — self-contained section composed of molecules and atoms',
  template:  '// Template — structural layout; handles slot composition and spacing',
};

export function atomicComponentTsx(pascal: string, kebab: string, level: AtomicLevel): string {
  const isTemplate = level === 'template';

  // Templates use PropsWithChildren; all others extend HTMLAttributes for max flexibility
  if (isTemplate) {
    return `import type { FC, PropsWithChildren } from 'react';
import { cn } from '@/lib/utils/cn';

${LEVEL_COMMENT[level]}
export interface ${pascal}Props extends PropsWithChildren {
  className?: string;
}

const ${pascal}: FC<${pascal}Props> = ({ className, children }) => {
  return (
    <div className={cn('${kebab}', className)}>
      {children}
    </div>
  );
};

export default ${pascal};
`;
  }

  return `import type { FC, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

${LEVEL_COMMENT[level]}
export interface ${pascal}Props extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary';
}

const ${pascal}: FC<${pascal}Props> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  return (
    <div
      data-variant={variant}
      className={cn('${kebab}', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default ${pascal};
`;
}

export function atomicStylesTs(pascal: string): string {
  return `export const ${pascal}Styles = {
  root: '',
  variants: {
    default:   '',
    secondary: '',
  },
} as const;
`;
}

export function atomicTestTsx(pascal: string): string {
  return `import { render, screen } from '@testing-library/react';
import ${pascal} from './${pascal}';

describe('${pascal}', () => {
  it('renders children', () => {
    render(<${pascal}>content</${pascal}>);
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<${pascal} className="custom">test</${pascal}>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards props to root element', () => {
    render(<${pascal} data-testid="el">test</${pascal}>);
    expect(screen.getByTestId('el')).toBeInTheDocument();
  });
});
`;
}

export function atomicIndexTs(pascal: string): string {
  return `export { default } from './${pascal}';
export type { ${pascal}Props } from './${pascal}';
`;
}
