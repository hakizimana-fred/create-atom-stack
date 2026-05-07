/** Generic component template — no element opinions. */

export function componentTsx(pascal: string, _kebab: string): string {
  return `import type { FC, HTMLAttributes } from 'react';

export interface ${pascal}Props extends HTMLAttributes<HTMLDivElement> {}

const ${pascal}: FC<${pascal}Props> = ({ className, children, ...props }) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

export default ${pascal};
`;
}

export function componentVariantsTsx(pascal: string, kebab: string): string {
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
});
`;
}

export function componentStoryTsx(pascal: string, storyTitle: string, withVariants = false): string {
  const secondaryStory = withVariants
    ? `\nexport const Secondary: Story = { args: { variant: 'secondary' } };\n`
    : '';
  return `import type { Meta, StoryObj } from '@storybook/react';
import ${pascal} from './${pascal}';

const meta: Meta<typeof ${pascal}> = {
  title: '${storyTitle}',
  component: ${pascal},
};
export default meta;

type Story = StoryObj<typeof ${pascal}>;

export const Default: Story = {};
${secondaryStory}`;
}

export function componentIndexTs(pascal: string): string {
  return `export { default } from './${pascal}';
export type { ${pascal}Props } from './${pascal}';
`;
}
