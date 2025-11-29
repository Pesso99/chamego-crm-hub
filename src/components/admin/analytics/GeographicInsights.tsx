import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";
import { useGeographicData } from "@/hooks/useAdvancedAnalytics";

interface GeographicInsightsProps {
  days: number;
}

export function GeographicInsights({ days }: GeographicInsightsProps) {
  const { data, isLoading } = useGeographicData(days);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Localização</CardTitle>
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
          <CardTitle>Localização</CardTitle>
          <CardDescription>Nenhum dado disponível</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>🌍 Localização dos Visitantes</CardTitle>
        <CardDescription>Distribuição geográfica por timezone</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((location) => {
            const percentage = Math.round((location.count / total) * 100);
            return (
              <div key={location.timezone} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{location.timezone}</span>
                  </div>
                  <span className="text-muted-foreground">{percentage}%</span>
                </div>
                
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-chamego-dourado transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
