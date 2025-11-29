import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Monitor, Globe } from "lucide-react";
import { useSessionMetrics, useGeographicData, useDeviceResolutions } from "@/hooks/useAdvancedAnalytics";

interface AudienceInsightsCardProps {
  days: number;
}

export function AudienceInsightsCard({ days }: AudienceInsightsCardProps) {
  const { data: sessionData, isLoading: loadingSession } = useSessionMetrics(days);
  const { data: geoData, isLoading: loadingGeo } = useGeographicData(days);
  const { data: deviceData, isLoading: loadingDevice } = useDeviceResolutions(days);

  if (loadingSession || loadingGeo || loadingDevice) {
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

  const totalGeo = geoData?.reduce((sum, item) => sum + item.count, 0) || 1;
  const totalDevice = deviceData?.reduce((sum, item) => sum + item.count, 0) || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>👥 Audiência</CardTitle>
        <CardDescription>Perfil dos visitantes</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-1" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="devices">
              <Monitor className="h-4 w-4 mr-1" />
              Telas
            </TabsTrigger>
            <TabsTrigger value="geo">
              <Globe className="h-4 w-4 mr-1" />
              Local
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
            {deviceData?.slice(0, 5).map((device, idx) => {
              const percentage = Math.round((device.count / totalDevice) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-xs text-foreground">{device.resolution}</span>
                    <span className="text-muted-foreground">{percentage}%</span>
                  </div>
                  <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-chamego-dourado transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="geo" className="space-y-3">
            {geoData?.slice(0, 5).map((location, idx) => {
              const percentage = Math.round((location.count / totalGeo) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{location.timezone}</span>
                    <span className="text-muted-foreground">{percentage}%</span>
                  </div>
                  <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
