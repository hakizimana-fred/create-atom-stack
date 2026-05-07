export function componentTsx(pascal: string): string {
  return `import type { FC } from 'react';
import { cn } from '@/lib/utils/cn';
import { ${pascal}Styles } from './${pascal}.styles';

export interface ${pascal}Props {
  children?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

const ${pascal}: FC<${pascal}Props> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={cn(${pascal}Styles.base, ${pascal}Styles[variant], ${pascal}Styles[size], className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ${pascal};
`;
}

export function componentStylesTs(pascal: string): string {
  return `export const ${pascal}Styles = {
  base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 py-2 text-sm',
  lg: 'h-11 px-8 text-base',
} as const;
`;
}

export function componentTestTsx(pascal: string): string {
  return `import { render, screen, fireEvent } from '@testing-library/react';
import ${pascal} from './${pascal}';

describe('${pascal}', () => {
  it('renders children', () => {
    render(<${pascal}>Click me</${pascal}>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<${pascal} onClick={handleClick}>Click</${pascal}>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<${pascal} onClick={handleClick} disabled>Click</${pascal}>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies variant classes', () => {
    const { container } = render(<${pascal} variant="secondary">Content</${pascal}>);
    expect(container.firstChild).toHaveClass('bg-secondary');
  });
});
`;
}

export function componentIndexTs(pascal: string): string {
  return `export { default } from './${pascal}';
export type { ${pascal}Props } from './${pascal}';
`;
}
