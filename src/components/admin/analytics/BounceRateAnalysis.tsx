import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { useBounceRates } from "@/hooks/useAdvancedAnalytics";
import { cn } from "@/lib/utils";

interface BounceRateAnalysisProps {
  days: number;
}

export function BounceRateAnalysis({ days }: BounceRateAnalysisProps) {
  const { data, isLoading } = useBounceRates(days);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Taxa de Rejeição</CardTitle>
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
          <CardTitle>Taxa de Rejeição</CardTitle>
          <CardDescription>Nenhum dado disponível</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>⚠️ Taxa de Rejeição por Página</CardTitle>
        <CardDescription>Páginas onde usuários saem sem interagir</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((page) => (
            <div key={page.page} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground truncate flex-1">{page.page}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-muted-foreground">{page.views} views</span>
                  <span className={cn(
                    "font-semibold",
                    page.rate >= 70 ? "text-red-500" :
                    page.rate >= 40 ? "text-yellow-500" :
                    "text-green-500"
                  )}>
                    {page.rate}%
                  </span>
                </div>
              </div>
              
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all",
                    page.rate >= 70 ? "bg-red-500" :
                    page.rate >= 40 ? "bg-yellow-500" :
                    "bg-green-500"
                  )}
                  style={{ width: `${page.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        
        {data.some(p => p.rate >= 70) && (
          <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Algumas páginas têm alta taxa de rejeição. Considere melhorar o conteúdo ou a experiência.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
