import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import { useActiveUsers } from "@/hooks/useAdvancedAnalytics";
import { useState } from "react";
import { UserBehaviorDrawer } from "./UserBehaviorDrawer";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ActiveUsersCardProps {
  days: number;
}

export function ActiveUsersCard({ days }: ActiveUsersCardProps) {
  const { data: users, isLoading } = useActiveUsers(days);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>👤 Usuários Mais Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px]" />
        </CardContent>
      </Card>
    );
  }

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
    <>
      <Card>
        <CardHeader>
          <CardTitle>👤 Usuários Mais Ativos</CardTitle>
          <CardDescription>Top usuários autenticados por visualizações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users?.slice(0, 10).map((user) => (
              <button
                key={user.userId}
                onClick={() => setSelectedUserId(user.userId)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatarUrl || undefined} />
                  <AvatarFallback className="bg-chamego-rosa text-foreground">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {user.name || "Usuário sem nome"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="text-right">
                    <p className="font-medium text-foreground">{user.totalViews}</p>
                    <p>páginas</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      {formatDistanceToNow(new Date(user.lastActivity), {
                        locale: ptBR,
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </button>
            ))}

            {(!users || users.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum usuário autenticado registrado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <UserBehaviorDrawer
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />
    </>
  );
}
