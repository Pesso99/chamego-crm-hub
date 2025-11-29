import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useTrafficSources } from "@/hooks/useAdvancedAnalytics";

interface TrafficSourcesChartProps {
  days: number;
}

const COLORS = [
  'hsl(var(--chamego-rosa))',
  'hsl(var(--chamego-dourado))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function TrafficSourcesChart({ days }: TrafficSourcesChartProps) {
  const { data, isLoading } = useTrafficSources(days);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fontes de Tráfego</CardTitle>
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
          <CardTitle>Fontes de Tráfego</CardTitle>
          <CardDescription>Nenhum dado disponível</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔗 Fontes de Tráfego</CardTitle>
        <CardDescription>De onde vêm seus visitantes</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="source"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(entry) => `${entry.source} (${entry.percentage}%)`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="mt-4 space-y-2">
          {data.map((source, idx) => (
            <div key={source.source} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-foreground">{source.source}</span>
              </div>
              <span className="font-semibold text-foreground">{source.count} visitas</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
