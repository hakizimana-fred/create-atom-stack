import { cn } from '@/lib/utils/cn';
import { Card } from '@/components/atoms/card';
import { Heading, Body } from '@/components/atoms/typography';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <Card
      variant="glass"
      padding="md"
      shadow="glass-sm"
      className={cn(
        'flex flex-col gap-3 transition-all duration-base',
        'hover:shadow-glass-md hover:border-brand/20',
        className,
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-xl bg-brand-subtle border border-brand/20 text-xl">
        {icon}
      </div>
      <div>
        <Heading level={3} className="text-sm font-semibold">
          {title}
        </Heading>
        <Body size="sm" secondary className="mt-1 leading-relaxed">
          {description}
        </Body>
      </div>
    </Card>
  );
}
