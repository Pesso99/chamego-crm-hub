import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Mail, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  totalRevenue: number;
  averageTicket: number;
  activeCampaigns: number;
  activeSegments: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    activeCustomers: 0,
    totalRevenue: 0,
    averageTicket: 0,
    activeCampaigns: 0,
    activeSegments: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const { data: customers } = await supabase
      .from("clientes_crm")
      .select("*");

    const { data: campaigns } = await supabase
      .from("campaigns")
      .select("*")
      .eq("status", "sent");

    const { data: segments } = await supabase
      .from("segments")
      .select("*")
      .eq("is_active", true);

    if (customers) {
      const active = customers.filter(c => c.status === "Ativo");
      const totalRev = customers.reduce((sum, c) => sum + (Number(c.valor_total_gasto) || 0), 0);
      const avgTicket = customers.reduce((sum, c) => sum + (Number(c.ticket_medio) || 0), 0) / customers.length;

      setStats({
        totalCustomers: customers.length,
        activeCustomers: active.length,
        totalRevenue: totalRev,
        averageTicket: avgTicket || 0,
        activeCampaigns: campaigns?.length || 0,
        activeSegments: segments?.length || 0,
      });
    }
  }

  const statCards = [
    {
      title: "Total de Clientes",
      value: stats.totalCustomers,
      icon: Users,
      trend: "+12%",
      trendUp: true,
      color: "text-status-info",
      bgColor: "bg-status-info/10",
    },
    {
      title: "Clientes Ativos",
      value: stats.activeCustomers,
      icon: Users,
      trend: "+8%",
      trendUp: true,
      color: "text-status-success",
      bgColor: "bg-status-success/10",
    },
    {
      title: "Receita Total",
      value: `R$ ${stats.totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      trend: "+23%",
      trendUp: true,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Ticket Médio",
      value: `R$ ${stats.averageTicket.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      trend: "+5%",
      trendUp: true,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Campanhas Ativas",
      value: stats.activeCampaigns,
      icon: Mail,
      trend: "3 enviadas",
      trendUp: true,
      color: "text-status-warning",
      bgColor: "bg-status-warning/10",
    },
    {
      title: "Segmentos Ativos",
      value: stats.activeSegments,
      icon: Target,
      trend: "+2 novos",
      trendUp: true,
      color: "text-chamego-dourado",
      bgColor: "bg-secondary",
    },
  ];

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral do seu negócio e métricas principais
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <Card 
            key={stat.title} 
            className="chamego-shadow-soft hover:chamego-shadow-medium transition-all hover:-translate-y-1"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-2">
                {stat.trendUp ? (
                  <ArrowUpRight className="w-4 h-4 text-status-success" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-status-error" />
                )}
                <span className={`text-xs font-medium ${stat.trendUp ? "text-status-success" : "text-status-error"}`}>
                  {stat.trend}
                </span>
                <span className="text-xs text-muted-foreground">vs. mês anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Welcome Card */}
      <Card className="chamego-gradient border-0 text-primary-foreground chamego-shadow-medium">
        <CardHeader>
          <CardTitle className="text-2xl">Bem-vindo ao Chamego CRM! 💝</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-primary-foreground/90 mb-4">
            Seu sistema completo de gestão de clientes está pronto para uso.
          </p>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-white/20 text-primary-foreground border-0 hover:bg-white/30">
              ✨ Clientes Segmentados
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-primary-foreground border-0 hover:bg-white/30">
              📧 Campanhas Automatizadas
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-primary-foreground border-0 hover:bg-white/30">
              🎯 Analytics em Tempo Real
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
