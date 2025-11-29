import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthenticationTimeline } from "@/hooks/useAdvancedAnalytics";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserBehaviorDrawer } from "./UserBehaviorDrawer";
import { ChevronRight } from "lucide-react";

interface AuthenticationChartProps {
  days: number;
}

export function AuthenticationChart({ days }: AuthenticationChartProps) {
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { data, isLoading } = useAuthenticationTimeline(days);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const chartData = viewMode === "daily" ? data.daily : data.monthly;

  const formattedData = chartData.map(item => ({
    ...item,
    dateLabel: viewMode === "daily" 
      ? format(new Date(item.date), "dd/MM", { locale: ptBR })
      : format(new Date(item.date), "MMM/yy", { locale: ptBR })
  }));

  const selectedDateData = selectedDate 
    ? chartData.find(d => d.date === selectedDate)
    : null;

  const handleChartClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const clickedDate = data.activePayload[0].payload.date;
      setSelectedDate(clickedDate === selectedDate ? null : clickedDate);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">🔐</span> Autenticações
          </CardTitle>
          <CardDescription>
            Logins únicos por período
          </CardDescription>
        </div>
        <Select value={viewMode} onValueChange={(value: "daily" | "monthly") => setViewMode(value)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Diário</SelectItem>
            <SelectItem value="monthly">Mensal</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={formattedData} onClick={handleChartClick}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="dateLabel" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="uniqueUsers"
              name="Usuários únicos"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              fill="url(#colorUsers)"
            />
            <Area
              type="monotone"
              dataKey="sessions"
              name="Sessões autenticadas"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#colorSessions)"
            />
          </AreaChart>
        </ResponsiveContainer>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Total período: <span className="font-semibold text-foreground">{data.totals.totalUsers} usuários</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Média {viewMode === "daily" ? "diária" : "mensal"}: <span className="font-semibold text-foreground">{data.totals.avgDaily.toFixed(1)} logins</span>
          </div>
        </div>

        {selectedDateData && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-foreground">
                📅 {format(new Date(selectedDateData.date), viewMode === "daily" ? "dd/MM/yyyy" : "MMMM 'de' yyyy", { locale: ptBR })}
              </h4>
              <Badge variant="secondary">
                {selectedDateData.uniqueUsers} {selectedDateData.uniqueUsers === 1 ? 'usuário' : 'usuários'}
              </Badge>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {selectedDateData.users.map((user) => (
                <button
                  key={user.userId}
                  onClick={() => setSelectedUserId(user.userId)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl || undefined} />
                    <AvatarFallback className="bg-chamego-rosa text-foreground text-sm">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm text-foreground truncate">
                        {user.name || "Usuário sem nome"}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {user.pageViews} {user.pageViews === 1 ? 'página' : 'páginas'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <UserBehaviorDrawer 
        userId={selectedUserId} 
        onClose={() => setSelectedUserId(null)} 
      />
    </Card>
  );
}
