import { useDashboardKPIs } from '@/lib/crm/metrics';
import { NavigationDashboardCards } from '@/components/admin/NavigationDashboardCards';
import { TopPagesChart } from '@/components/admin/TopPagesChart';
import { DeviceBreakdownChart } from '@/components/admin/DeviceBreakdownChart';

// New modular dashboard components
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { KPIGrid } from '@/components/dashboard/KPIGrid';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentCampaigns } from '@/components/dashboard/RecentCampaigns';
import { OptInRate } from '@/components/dashboard/OptInRate';

export default function Dashboard() {
  const { data: kpis, isLoading } = useDashboardKPIs();

  return (
    <div className="p-8 space-y-8">
      <DashboardHeader />
      
      <KPIGrid kpis={kpis} isLoading={isLoading} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <OptInRate rate={kpis?.pctOptIn} />
        <RecentCampaigns />
      </div>
      
      <QuickActions />
      
      {/* Navigation Analytics Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Análise de Navegação</h2>
          <p className="text-muted-foreground">Comportamento dos clientes no site</p>
        </div>
        
        <NavigationDashboardCards />
        
        <div className="grid gap-6 md:grid-cols-2">
          <TopPagesChart />
          <DeviceBreakdownChart />
        </div>
      </section>
    </div>
  );
}
