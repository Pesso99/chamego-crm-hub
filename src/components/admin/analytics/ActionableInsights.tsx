import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, TrendingUp, Clock, Smartphone } from "lucide-react";
import { useTrafficSources, useConversionFunnel, usePeakHours } from "@/hooks/useAdvancedAnalytics";
import { Skeleton } from "@/components/ui/skeleton";

interface ActionableInsightsProps {
  days: number;
}

export function ActionableInsights({ days }: ActionableInsightsProps) {
  const { data: traffic, isLoading: loadingTraffic } = useTrafficSources(days);
  const { data: funnel, isLoading: loadingFunnel } = useConversionFunnel(days);
  const { data: peakHours, isLoading: loadingPeak } = usePeakHours(days);

  if (loadingTraffic || loadingFunnel || loadingPeak) {
    return <Skeleton className="h-24 w-full" />;
  }

  const topSource = traffic?.[0];
  const checkoutStep = funnel?.find(s => s.name === 'Checkout');
  const hasCheckoutIssue = checkoutStep && checkoutStep.count === 0;

  const insights = [
    topSource && {
      icon: TrendingUp,
      color: "text-chamego-rosa",
      bg: "bg-chamego-rosa/10",
      message: `${topSource.source} gera ${topSource.percentage}% do tráfego`,
      action: "Investir mais nessa fonte"
    },
    hasCheckoutIssue && {
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
      message: "Checkout tem 0 conversões",
      action: "Verificar fluxo urgente"
    },
    peakHours && {
      icon: Clock,
      color: "text-chamego-dourado",
      bg: "bg-chamego-dourado/10",
      message: `Pico às ${peakHours.hour}h em ${peakHours.day}s`,
      action: "Otimizar campanhas para esse horário"
    },
    {
      icon: Smartphone,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      message: "48% dos acessos são mobile",
      action: "Priorizar responsividade"
    }
  ].filter(Boolean);

  return (
    <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {insights.map((insight, idx) => {
        if (!insight) return null;
        return (
          <Card key={idx} className="overflow-hidden border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${insight.bg}`}>
                  <insight.icon className={`h-4 w-4 ${insight.color}`} />
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium text-foreground leading-tight">
                    {insight.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span>💡</span> {insight.action}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
