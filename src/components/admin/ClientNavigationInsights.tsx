import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useClientNavigation } from '@/hooks/useClientNavigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, FileText, Clock, Calendar } from 'lucide-react';
import { formatDuration, categorizePagePath, getDeviceIcon, getCategoryIcon, formatPagePath, getCategoryBadgeColor } from '@/lib/navigation-utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientNavigationInsightsProps {
  userId: string;
}

export function ClientNavigationInsights({ userId }: ClientNavigationInsightsProps) {
  const { data: insights, isLoading } = useClientNavigation(userId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!insights || insights.totalViews === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Nenhuma atividade de navegação registrada para este cliente.
        </CardContent>
      </Card>
    );
  }

  // Note: device_type is not available in PageView from useClientNavigation
  // We'll show a simple message instead
  const deviceBreakdown = { desktop: 0, mobile: 0, tablet: 0, unknown: 0 };

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Visitas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.totalViews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Páginas Únicas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.topPages.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(insights.avgDuration)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Última Visita</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {insights.recentPages[0]
                ? format(new Date(insights.recentPages[0].viewed_at), 'dd/MM/yyyy', { locale: ptBR })
                : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Páginas Mais Visitadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.topPages.slice(0, 5).map((page) => {
              const category = categorizePagePath(page.path);
              const CategoryIcon = getCategoryIcon(category);
              return (
                <div key={page.path} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <CategoryIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{formatPagePath(page.path, 40)}</p>
                      <Badge variant="secondary" className={`text-xs ${getCategoryBadgeColor(category)}`}>
                        {category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-sm font-bold">{page.count} visitas</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.recentPages.slice(0, 10).map((page, idx) => {
              const category = categorizePagePath(page.page_path);
              const CategoryIcon = getCategoryIcon(category);
              return (
                <div key={idx} className="flex items-start gap-3 border-l-2 border-muted pl-4">
                  <CategoryIcon className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{formatPagePath(page.page_path, 50)}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(page.viewed_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                      </p>
                      {page.duration_seconds && (
                        <p className="text-xs text-muted-foreground">
                          • {formatDuration(page.duration_seconds)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Device Analysis - Available in Dashboard only */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Atividade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total de páginas visitadas:</span>
              <span className="text-sm font-medium">{insights.totalViews}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Páginas únicas:</span>
              <span className="text-sm font-medium">{insights.topPages.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Tempo médio por página:</span>
              <span className="text-sm font-medium">{formatDuration(insights.avgDuration)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
