import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function TopPagesChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    loadTopPages();
  }, []);

  const loadTopPages = async () => {
    const { data: pages } = await supabase
      .from("page_views")
      .select("page_path")
      .gte("viewed_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (pages) {
      const counts = pages.reduce((acc: any, page) => {
        acc[page.page_path] = (acc[page.page_path] || 0) + 1;
        return acc;
      }, {});

      const sorted = Object.entries(counts)
        .map(([path, count]) => ({ path, count }))
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 10);

      setData(sorted);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Páginas Mais Visitadas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="path" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="count" fill="hsl(var(--chamego-dourado))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
