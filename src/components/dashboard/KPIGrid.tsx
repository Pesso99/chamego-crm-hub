import { KPICard } from './KPICard';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserCheck, UserMinus, AlertTriangle } from 'lucide-react';

interface KPIData {
  total: number;
  ativos: number;
  emRisco: number;
  inativos: number;
}

interface KPIGridProps {
  kpis?: KPIData;
  isLoading: boolean;
}

export function KPIGrid({ kpis, isLoading }: KPIGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Base Total',
      value: kpis?.total || 0,
      icon: Users,
      variant: 'primary' as const,
    },
    {
      title: 'Clientes Ativos',
      value: kpis?.ativos || 0,
      subtitle: '≤ 30 dias',
      icon: UserCheck,
      variant: 'success' as const,
    },
    {
      title: 'Em Risco',
      value: kpis?.emRisco || 0,
      subtitle: '31-90 dias',
      icon: AlertTriangle,
      variant: 'warning' as const,
    },
    {
      title: 'Inativos',
      value: kpis?.inativos || 0,
      subtitle: '> 90 dias',
      icon: UserMinus,
      variant: 'danger' as const,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <KPICard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
