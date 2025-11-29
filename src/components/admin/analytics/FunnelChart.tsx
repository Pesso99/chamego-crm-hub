import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { useConversionFunnel } from "@/hooks/useAdvancedAnalytics";
import { cn } from "@/lib/utils";

interface FunnelChartProps {
  days: number;
}

export function FunnelChart({ days }: FunnelChartProps) {
  const { data, isLoading } = useConversionFunnel(days);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Funil de Conversão</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Funil de Conversão</CardTitle>
          <CardDescription>Nenhum dado disponível</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📈 Funil de Conversão</CardTitle>
        <CardDescription>Jornada dos usuários até a compra</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((step, idx) => {
            const isLast = idx === data.length - 1;
            const dropOff = idx > 0 ? data[idx - 1].percentage - step.percentage : 0;
            const isWarning = step.count === 0 && idx > 0;

            return (
              <div key={step.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{step.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{step.count} sessões</span>
                    <span className={cn(
                      "font-semibold",
                      step.percentage >= 50 ? "text-green-500" : 
                      step.percentage >= 20 ? "text-yellow-500" : 
                      "text-red-500"
                    )}>
                      {step.percentage}%
                    </span>
                  </div>
                </div>
                
                <div className="relative h-10 bg-muted rounded-lg overflow-hidden">
                  <div
                    className={cn(
                      "h-full flex items-center px-4 text-sm font-medium transition-all",
                      step.percentage >= 50 ? "bg-green-500" : 
                      step.percentage >= 20 ? "bg-yellow-500" : 
                      "bg-red-500",
                      "text-white"
                    )}
                    style={{ width: `${step.percentage}%` }}
                  >
                    {step.percentage > 15 && step.name}
                  </div>
                  {isWarning && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                
                {idx > 0 && dropOff > 0 && (
                  <p className="text-xs text-red-500">
                    ⚠️ Drop-off de {dropOff}% nesta etapa
                  </p>
                )}
              </div>
            );
          })}
        </div>
        
        {data[data.length - 1]?.count === 0 && (
          <div className="mt-4 p-3 bg-red-500/10 rounded-lg">
            <p className="text-sm text-red-500 font-medium">
              ⚠️ Nenhuma conversão registrada no checkout. Verifique se há problemas técnicos.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
