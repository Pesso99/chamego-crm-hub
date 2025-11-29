import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, AlertTriangle, UserX, CheckCircle } from "lucide-react";
import NavigationDashboardCards from "@/components/analytics/NavigationDashboardCards";
import TopPagesChart from "@/components/analytics/TopPagesChart";
import DeviceBreakdownChart from "@/components/analytics/DeviceBreakdownChart";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalClients: 0,
    activeClients: 0,
    atRiskClients: 0,
    inactiveClients: 0,
    optInRate: 0,
  });

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    const { data: clients } = await supabase
      .from("clientes_crm")
      .select("dias_sem_comprar, marketing_emails");

    if (clients) {
      const total = clients.length;
      const active = clients.filter((c) => c.dias_sem_comprar <= 30).length;
      const atRisk = clients.filter((c) => c.dias_sem_comprar > 30 && c.dias_sem_comprar <= 90).length;
      const inactive = clients.filter((c) => c.dias_sem_comprar > 90).length;
      const optIn = clients.filter((c) => c.marketing_emails).length;

      setMetrics({
        totalClients: total,
        activeClients: active,
        atRiskClients: atRisk,
        inactiveClients: inactive,
        optInRate: total > 0 ? Math.round((optIn / total) * 100) : 0,
      });
    }
  };

  const kpis = [
    {
      title: "Base Total",
      value: metrics.totalClients,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Clientes Ativos",
      value: metrics.activeClients,
      subtitle: "≤30 dias",
      icon: TrendingUp,
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Em Risco",
      value: metrics.atRiskClients,
      subtitle: "31-90 dias",
      icon: AlertTriangle,
      gradient: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Inativos",
      value: metrics.inactiveClients,
      subtitle: ">90 dias",
      icon: UserX,
      gradient: "from-red-500 to-red-600",
    },
    {
      title: "Taxa de Opt-in",
      value: `${metrics.optInRate}%`,
      icon: CheckCircle,
      gradient: "from-chamego-dourado to-chamego-rosa",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-chamego bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Visão geral do seu CRM Chamego
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${kpi.gradient}`}>
                  <kpi.icon className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              {kpi.subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation Analytics */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Análise de Navegação</h2>
        <NavigationDashboardCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopPagesChart />
          <DeviceBreakdownChart />
        </div>
      </div>
    </div>
  );
}
