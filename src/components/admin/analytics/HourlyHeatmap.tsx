import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHourlyDistribution } from "@/hooks/useAdvancedAnalytics";
import { cn } from "@/lib/utils";

interface HourlyHeatmapProps {
  days: number;
}

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function HourlyHeatmap({ days }: HourlyHeatmapProps) {
  const { data, isLoading } = useHourlyDistribution(days);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Calor</CardTitle>
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
          <CardTitle>Mapa de Calor</CardTitle>
          <CardDescription>Nenhum dado disponível</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const maxCount = Math.max(...data.map(d => d.count));
  
  const getIntensity = (count: number) => {
    const intensity = count / maxCount;
    if (intensity >= 0.75) return 'bg-chamego-rosa';
    if (intensity >= 0.5) return 'bg-chamego-rosa/70';
    if (intensity >= 0.25) return 'bg-chamego-rosa/40';
    return 'bg-muted';
  };

  const getCount = (day: number, hour: number) => {
    const item = data.find(d => d.day === day && d.hour === hour);
    return item?.count || 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔥 Mapa de Calor - Atividade por Hora</CardTitle>
        <CardDescription>Identifique os melhores horários para engajamento</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-25 gap-1 text-xs">
              {/* Header com horas */}
              <div />
              {[...Array(24)].map((_, hour) => (
                <div key={hour} className="text-center text-muted-foreground">
                  {hour}h
                </div>
              ))}
              
              {/* Linhas por dia */}
              {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                <>
                  <div key={`day-${day}`} className="text-right pr-2 font-medium text-foreground">
                    {DAYS[day]}
                  </div>
                  {[...Array(24)].map((_, hour) => {
                    const count = getCount(day, hour);
                    return (
                      <div
                        key={`${day}-${hour}`}
                        className={cn(
                          "h-6 rounded transition-all hover:scale-110 cursor-pointer",
                          getIntensity(count)
                        )}
                        title={`${DAYS[day]} ${hour}h: ${count} views`}
                      />
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-center gap-4 text-xs">
          <span className="text-muted-foreground">Menos</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-muted" />
            <div className="w-4 h-4 rounded bg-chamego-rosa/40" />
            <div className="w-4 h-4 rounded bg-chamego-rosa/70" />
            <div className="w-4 h-4 rounded bg-chamego-rosa" />
          </div>
          <span className="text-muted-foreground">Mais</span>
        </div>
      </CardContent>
    </Card>
  );
}
