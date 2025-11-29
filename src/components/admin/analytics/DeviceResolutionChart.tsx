import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Monitor } from "lucide-react";
import { useDeviceResolutions } from "@/hooks/useAdvancedAnalytics";

interface DeviceResolutionChartProps {
  days: number;
}

export function DeviceResolutionChart({ days }: DeviceResolutionChartProps) {
  const { data, isLoading } = useDeviceResolutions(days);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resoluções de Tela</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px]" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resoluções de Tela</CardTitle>
          <CardDescription>Nenhum dado disponível</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>📱 Resoluções de Tela</CardTitle>
        <CardDescription>Tamanhos de tela mais comuns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.slice(0, 5).map((resolution, idx) => {
            const percentage = Math.round((resolution.count / total) * 100);
            return (
              <div key={resolution.resolution} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono font-medium text-foreground">{resolution.resolution}</span>
                  </div>
                  <span className="text-muted-foreground">{percentage}%</span>
                </div>
                
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-chamego-rosa transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Recomendação:</strong> Otimize para as 3 resoluções mais comuns
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
