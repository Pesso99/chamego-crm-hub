import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardKPIs } from '@/lib/crm/metrics';
import { Users, UserCheck, UserMinus, AlertTriangle, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { NavigationDashboardCards } from '@/components/admin/NavigationDashboardCards';
import { TopPagesChart } from '@/components/admin/TopPagesChart';
import { DeviceBreakdownChart } from '@/components/admin/DeviceBreakdownChart';

export default function Dashboard() {
  const { data: kpis, isLoading } = useDashboardKPIs();

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Base Total',
      value: kpis?.total || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Clientes Ativos',
      value: kpis?.ativos || 0,
      subtitle: '≤ 30 dias',
      icon: UserCheck,
      color: 'text-status-success',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Em Risco',
      value: kpis?.emRisco || 0,
      subtitle: '31-90 dias',
      icon: AlertTriangle,
      color: 'text-status-warning',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Inativos',
      value: kpis?.inativos || 0,
      subtitle: '> 90 dias',
      icon: UserMinus,
      color: 'text-status-error',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do CRM Chamego</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
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

      {/* Opt-in Rate & Navigation Analytics */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 chamego-icon-accent" />
              Taxa de Opt-in
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis?.pctOptIn.toFixed(1)}%</div>
            <p className="text-sm text-muted-foreground mt-2">
              Clientes que aceitam comunicações de marketing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campanhas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Crie sua primeira campanha em{' '}
              <a href="/admin/campanhas" className="text-primary hover:underline">
                Campanhas
              </a>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Analytics Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Análise de Navegação</h2>
          <p className="text-muted-foreground">Comportamento dos clientes no site</p>
        </div>
        
        <NavigationDashboardCards />
        
        <div className="grid gap-6 md:grid-cols-2">
          <TopPagesChart />
          <DeviceBreakdownChart />
        </div>
      </div>
    </div>
  );
}
