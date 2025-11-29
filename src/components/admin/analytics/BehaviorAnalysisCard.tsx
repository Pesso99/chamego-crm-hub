import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { useUserJourneys, useBounceRates } from "@/hooks/useAdvancedAnalytics";

interface BehaviorAnalysisCardProps {
  days: number;
}

export function BehaviorAnalysisCard({ days }: BehaviorAnalysisCardProps) {
  const { data: journeys, isLoading: loadingJourneys } = useUserJourneys(days);
  const { data: bounceData, isLoading: loadingBounce } = useBounceRates(days);

  if (loadingJourneys || loadingBounce) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>🚶 Comportamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  const highBouncePage = bounceData?.find(b => b.rate >= 70);

  return (
    <Card>
      <CardHeader>
        <CardTitle>🚶 Comportamento</CardTitle>
        <CardDescription>Jornadas e engajamento</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="journeys" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="journeys">
              <TrendingUp className="h-4 w-4 mr-1" />
              Jornadas
            </TabsTrigger>
            <TabsTrigger value="bounce">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Bounce
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journeys" className="space-y-3">
            {journeys?.slice(0, 5).map((journey, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {idx + 1}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {Math.floor(journey.avgDuration / 60)}m {journey.avgDuration % 60}s
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs bg-muted p-2 rounded-lg overflow-x-auto">
                  {journey.path.split(' → ').map((page, pageIdx, arr) => (
                    <div key={pageIdx} className="flex items-center gap-2 shrink-0">
                      <span className="text-foreground font-medium">{page}</span>
                      {pageIdx < arr.length - 1 && (
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{journey.count} sessões</p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="bounce" className="space-y-3">
            {highBouncePage && (
              <div className="p-3 mb-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-xs font-medium text-red-500 mb-1">⚠️ Atenção necessária</p>
                <p className="text-xs text-muted-foreground">
                  Página <span className="font-mono font-medium text-foreground">{highBouncePage.page}</span> tem {highBouncePage.rate}% de bounce
                </p>
              </div>
            )}

            {bounceData?.slice(0, 6).map((page, idx) => {
              const color = page.rate >= 70 ? 'text-red-500' : page.rate >= 50 ? 'text-yellow-500' : 'text-green-500';
              const bgColor = page.rate >= 70 ? 'bg-red-500' : page.rate >= 50 ? 'bg-yellow-500' : 'bg-green-500';
              
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground font-mono text-xs truncate max-w-[180px]">{page.page}</span>
                    <span className={`font-bold ${color}`}>{page.rate}%</span>
                  </div>
                  <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${bgColor} transition-all`}
                      style={{ width: `${page.rate}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{page.views} views</p>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
