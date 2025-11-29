import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTopPages } from '@/hooks/useNavigationAnalytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatPagePath } from '@/lib/navigation-utils';

export function TopPagesChart() {
  const { data: pages, isLoading } = useTopPages(10, 30);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Páginas Mais Visitadas</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px]" />
        </CardContent>
      </Card>
    );
  }

  if (!pages || pages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Páginas Mais Visitadas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum dado de navegação disponível
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = pages.map((page) => ({
    name: formatPagePath(page.pagePath, 30),
    visitas: page.viewCount,
    fullPath: page.pagePath,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Páginas Mais Visitadas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" className="text-xs" />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={150}
              className="text-xs"
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number, name: string, props: any) => {
                return [
                  `${value} visitas`,
                  props.payload.fullPath
                ];
              }}
            />
            <Bar 
              dataKey="visitas" 
              fill="hsl(var(--primary))" 
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
