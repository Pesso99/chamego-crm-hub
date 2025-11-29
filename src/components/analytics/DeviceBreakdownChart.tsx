import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = {
  mobile: "hsl(var(--chamego-rosa))",
  desktop: "hsl(var(--chamego-dourado))",
  tablet: "hsl(var(--status-info))",
};

export default function DeviceBreakdownChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    loadDeviceData();
  }, []);

  const loadDeviceData = async () => {
    const { data: views } = await supabase
      .from("page_views")
      .select("device_type")
      .gte("viewed_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (views) {
      const counts = views.reduce((acc: any, view) => {
        const device = view.device_type || "desktop";
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(counts).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));

      setData(chartData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Dispositivos</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || COLORS.desktop}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
