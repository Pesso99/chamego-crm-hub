import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const variantStyles = {
  primary: {
    bg: 'bg-chamego-pink/10 dark:bg-chamego-pink/20',
    icon: 'text-chamego-pink',
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-950',
    icon: 'text-status-success',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    icon: 'text-status-warning',
  },
  danger: {
    bg: 'bg-red-50 dark:bg-red-950',
    icon: 'text-status-error',
  },
  info: {
    bg: 'bg-chamego-gold/10 dark:bg-chamego-gold/20',
    icon: 'text-chamego-gold',
  },
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'primary',
  trend,
}: KPICardProps) {
  const styles = variantStyles[variant];

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn('p-2 rounded-full', styles.bg)}>
          <Icon className={cn('h-4 w-4', styles.icon)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <span
              className={cn(
                'text-xs font-medium',
                trend.isPositive ? 'text-status-success' : 'text-status-error'
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
