import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Monitor } from "lucide-react";
import { useSessionMetrics, useDeviceCategories } from "@/hooks/useAdvancedAnalytics";

interface AudienceInsightsCardProps {
  days: number;
}

export function AudienceInsightsCard({ days }: AudienceInsightsCardProps) {
  const { data: sessionData, isLoading: loadingSession } = useSessionMetrics(days);
  const { data: deviceData, isLoading: loadingDevice } = useDeviceCategories(days);

  if (loadingSession || loadingDevice) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>👥 Audiência</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px]" />
        </CardContent>
      </Card>
    );
  }

  const total = (sessionData?.authenticated || 0) + (sessionData?.anonymous || 0);
  const authPercent = total > 0 ? Math.round((sessionData!.authenticated / total) * 100) : 0;
  const anonPercent = 100 - authPercent;

  return (
    <Card>
      <CardHeader>
        <CardTitle>👥 Audiência</CardTitle>
        <CardDescription>Perfil dos visitantes</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-1" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="devices">
              <Monitor className="h-4 w-4 mr-1" />
              Dispositivos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Autenticados</span>
                <span className="font-medium text-foreground">{authPercent}%</span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-chamego-rosa transition-all"
                  style={{ width: `${authPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Anônimos</span>
                <span className="font-medium text-foreground">{anonPercent}%</span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-muted-foreground/30 transition-all"
                  style={{ width: `${anonPercent}%` }}
                />
              </div>

              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground">
                  Média de <span className="font-bold text-foreground">{sessionData?.avgPagesPerSession}</span> páginas por sessão
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="devices" className="space-y-3">
            {deviceData?.map((device, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{device.category}</span>
                  <span className="text-muted-foreground">{device.percentage}%</span>
                </div>
                <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-chamego-dourado transition-all"
                    style={{ width: `${device.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
