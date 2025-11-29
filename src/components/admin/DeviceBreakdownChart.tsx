import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeviceAnalytics } from '@/hooks/useNavigationAnalytics';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Monitor, Smartphone, Tablet, HelpCircle } from 'lucide-react';

export function DeviceBreakdownChart() {
  const { data: devices, isLoading } = useDeviceAnalytics(30);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dispositivos Mais Usados</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  if (!devices) return null;

  const chartData = [
    { name: 'Desktop', value: devices.desktop, icon: Monitor },
    { name: 'Mobile', value: devices.mobile, icon: Smartphone },
    { name: 'Tablet', value: devices.tablet, icon: Tablet },
    { name: 'Outros', value: devices.unknown, icon: HelpCircle },
  ].filter(item => item.value > 0);

  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispositivos Mais Usados</CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum dado de dispositivos disponível
          </p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              {chartData.map((device, idx) => {
                const DeviceIcon = device.icon;
                const percentage = Math.round((device.value / total) * 100);
                return (
                  <div key={device.name} className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <DeviceIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{device.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {device.value} ({percentage}%)
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
