import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Users, Clock } from "lucide-react";

export default function NavigationDashboardCards() {
  const [metrics, setMetrics] = useState({
    pageviews24h: 0,
    activeSessions: 0,
    avgDuration: 0,
  });

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Pageviews últimas 24h
    const { count: pageviews } = await supabase
      .from("page_views")
      .select("*", { count: "exact", head: true })
      .gte("viewed_at", oneDayAgo);

    // Sessões ativas (últimas 24h)
    const { data: sessions } = await supabase
      .from("page_views")
      .select("session_id")
      .gte("viewed_at", oneDayAgo);

    const uniqueSessions = new Set(sessions?.map((s) => s.session_id) || []).size;

    // Tempo médio de sessão
    const { data: durations } = await supabase
      .from("page_views")
      .select("duration_seconds")
      .gte("viewed_at", oneDayAgo)
      .not("duration_seconds", "is", null);

    const avgDuration = durations && durations.length > 0
      ? Math.round(durations.reduce((sum, d) => sum + (d.duration_seconds || 0), 0) / durations.length)
      : 0;

    setMetrics({
      pageviews24h: pageviews || 0,
      activeSessions: uniqueSessions,
      avgDuration,
    });
  };

  const cards = [
    {
      title: "Pageviews (24h)",
      value: metrics.pageviews24h,
      icon: Eye,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Sessões Ativas",
      value: metrics.activeSessions,
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Tempo Médio",
      value: `${metrics.avgDuration}s`,
      icon: Clock,
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${card.color}`}>
                <card.icon className="w-4 h-4 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
