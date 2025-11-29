import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Users, MousePointerClick, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigationMetrics } from "@/hooks/useNavigationAnalytics";

interface AnalyticsOverviewProps {
  days: number;
}

export function AnalyticsOverview({ days }: AnalyticsOverviewProps) {
  const { data: metrics, isLoading } = useNavigationMetrics(days);

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      name: "Total de Views",
      value: metrics?.totalViews.toLocaleString() || "0",
      change: "+12%",
      positive: true,
      icon: Eye,
      color: "text-chamego-rosa",
    },
    {
      name: "Usuários Únicos",
      value: metrics?.uniqueUsers.toLocaleString() || "0",
      change: "+5%",
      positive: true,
      icon: Users,
      color: "text-chamego-dourado",
    },
    {
      name: "Sessões",
      value: metrics?.uniqueSessions.toLocaleString() || "0",
      change: "-3%",
      positive: false,
      icon: MousePointerClick,
      color: "text-blue-500",
    },
    {
      name: "Tempo Médio",
      value: `${Math.floor((metrics?.avgDuration || 0) / 60)}m ${(metrics?.avgDuration || 0) % 60}s`,
      change: "+20%",
      positive: true,
      icon: Clock,
      color: "text-green-500",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="overflow-hidden transition-all hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.name}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <div className="flex items-center gap-1 text-xs">
                  {stat.positive ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={stat.positive ? "text-green-500" : "text-red-500"}>
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground">vs período anterior</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-primary/10 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
