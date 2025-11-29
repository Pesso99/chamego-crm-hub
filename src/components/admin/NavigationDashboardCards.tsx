import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigationMetrics } from '@/hooks/useNavigationAnalytics';
import { Eye, Users, Activity, TrendingUp } from 'lucide-react';
import { calculateEngagementRate } from '@/lib/navigation-utils';

export function NavigationDashboardCards() {
  const { data: metrics, isLoading } = useNavigationMetrics(30);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  const engagementRate = calculateEngagementRate(metrics.totalViews, metrics.uniqueUsers);

  const stats = [
    {
      title: 'Page Views',
      value: metrics.totalViews.toLocaleString('pt-BR'),
      subtitle: 'Últimos 30 dias',
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Usuários Ativos',
      value: metrics.activeUsersLast7d,
      subtitle: 'Últimos 7 dias',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Sessões Médias',
      value: Math.round(metrics.uniqueSessions / Math.max(metrics.uniqueUsers, 1) * 10) / 10,
      subtitle: 'Por usuário',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Taxa de Engajamento',
      value: engagementRate,
      subtitle: 'Views por usuário',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
