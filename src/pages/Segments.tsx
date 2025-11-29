import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Users, Plus, Filter } from "lucide-react";

interface Segment {
  id: string;
  name: string;
  description: string | null;
  customer_count: number;
  is_active: boolean;
  created_at: string;
}

export default function Segments() {
  const [segments, setSegments] = useState<Segment[]>([]);

  useEffect(() => {
    loadSegments();
  }, []);

  async function loadSegments() {
    const { data, error } = await supabase
      .from("segments")
      .select("*")
      .order("created_at", { ascending: false });

    if (data && !error) {
      setSegments(data as Segment[]);
    }
  }

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Segmentos</h1>
          <p className="text-muted-foreground mt-1">
            Organize seus clientes em grupos personalizados
          </p>
        </div>
        <Button className="chamego-gradient-dourado text-primary-foreground chamego-shadow-medium hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Novo Segmento
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="chamego-shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Segmentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{segments.length}</div>
          </CardContent>
        </Card>
        <Card className="chamego-shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Segmentos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-status-success">
              {segments.filter((s) => s.is_active).length}
            </div>
          </CardContent>
        </Card>
        <Card className="chamego-shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chamego-dourado">
              {segments.reduce((sum, s) => sum + (s.customer_count || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segments Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {segments.map((segment, index) => (
          <Card
            key={segment.id}
            className="chamego-shadow-soft hover:chamego-shadow-medium transition-all hover:-translate-y-1 cursor-pointer"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{segment.name}</CardTitle>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    segment.is_active
                      ? "bg-status-success/10 text-status-success border-status-success/20"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {segment.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {segment.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {segment.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {segment.customer_count || 0} clientes
                  </span>
                </div>
                <Button variant="ghost" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {segments.length === 0 && (
        <Card className="chamego-shadow-soft">
          <CardContent className="py-12 text-center">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum segmento criado ainda</h3>
            <p className="text-muted-foreground mb-4">
              Crie segmentos para organizar seus clientes em grupos personalizados
            </p>
            <Button className="chamego-gradient-dourado text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Segmento
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
