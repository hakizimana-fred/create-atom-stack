/** Generic component template — no element opinions. The developer picks the HTML tag. */

export function componentTsx(pascal: string, kebab: string): string {
  return `import type { FC, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

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

export function componentStylesTs(pascal: string): string {
  return `export const ${pascal}Styles = {
  root: '',
  variants: {
    default:   '',
    secondary: '',
  },
} as const;
`;
}

export function componentTestTsx(pascal: string): string {
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

  it('forwards additional props', () => {
    render(<${pascal} data-testid="el">test</${pascal}>);
    expect(screen.getByTestId('el')).toBeInTheDocument();
  });

  it('sets secondary variant attribute', () => {
    const { container } = render(<${pascal} variant="secondary">test</${pascal}>);
    expect(container.firstChild).toHaveAttribute('data-variant', 'secondary');
  });
});
`;
}

export function componentIndexTs(pascal: string): string {
  return `export { default } from './${pascal}';
export type { ${pascal}Props } from './${pascal}';
`;
}
