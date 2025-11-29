import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCheck, UserX, FileText } from "lucide-react";
import { useSessionMetrics } from "@/hooks/useAdvancedAnalytics";

interface SessionAnalysisProps {
  days: number;
}

export function SessionAnalysis({ days }: SessionAnalysisProps) {
  const { data, isLoading } = useSessionMetrics(days);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise de Sessões</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px]" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise de Sessões</CardTitle>
          <CardDescription>Nenhum dado disponível</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const total = data.authenticated + data.anonymous;
  const authPercentage = Math.round((data.authenticated / total) * 100);
  const anonPercentage = 100 - authPercentage;

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Análise de Sessões</CardTitle>
        <CardDescription>Usuários autenticados vs anônimos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-green-500" />
                <span className="text-sm text-muted-foreground">Autenticados</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{data.authenticated}</p>
              <p className="text-sm text-green-500">{authPercentage}% do total</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <UserX className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-muted-foreground">Anônimos</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{data.anonymous}</p>
              <p className="text-sm text-blue-500">{anonPercentage}% do total</p>
            </div>
          </div>
          
          <div className="relative h-3 bg-muted rounded-full overflow-hidden flex">
            <div
              className="h-full bg-green-500"
              style={{ width: `${authPercentage}%` }}
            />
            <div
              className="h-full bg-blue-500"
              style={{ width: `${anonPercentage}%` }}
            />
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Páginas por Sessão</p>
              <p className="text-2xl font-bold text-foreground">{data.avgPagesPerSession}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
