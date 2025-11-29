import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Clock } from "lucide-react";
import { useUserJourneys } from "@/hooks/useAdvancedAnalytics";

interface UserJourneysCardProps {
  days: number;
}

export function UserJourneysCard({ days }: UserJourneysCardProps) {
  const { data, isLoading } = useUserJourneys(days);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Jornadas de Usuários</CardTitle>
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
          <CardTitle>Jornadas de Usuários</CardTitle>
          <CardDescription>Nenhum dado disponível</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🚶 Jornadas Mais Comuns</CardTitle>
        <CardDescription>Caminhos que os usuários percorrem no site</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((journey, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-muted-foreground">{journey.count} sessões</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {Math.floor(journey.avgDuration / 60)}m {journey.avgDuration % 60}s
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm font-mono bg-muted p-3 rounded-lg overflow-x-auto">
                {journey.path.split(' → ').map((page, pageIdx, arr) => (
                  <div key={pageIdx} className="flex items-center gap-2 shrink-0">
                    <span className="text-foreground font-medium">{page}</span>
                    {pageIdx < arr.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
