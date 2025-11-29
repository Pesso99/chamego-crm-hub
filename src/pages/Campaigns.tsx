import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Clock, CheckCircle, XCircle, Users, Plus } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: string;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (data && !error) {
      setCampaigns(data as Campaign[]);
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "sent":
        return {
          label: "Enviada",
          color: "bg-status-success/10 text-status-success border-status-success/20",
          icon: CheckCircle,
        };
      case "draft":
        return {
          label: "Rascunho",
          color: "bg-muted text-muted-foreground",
          icon: Mail,
        };
      case "scheduled":
        return {
          label: "Agendada",
          color: "bg-status-info/10 text-status-info border-status-info/20",
          icon: Clock,
        };
      case "sending":
        return {
          label: "Enviando",
          color: "bg-status-warning/10 text-status-warning border-status-warning/20",
          icon: Mail,
        };
      default:
        return {
          label: status,
          color: "bg-muted text-muted-foreground",
          icon: Mail,
        };
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campanhas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas campanhas de email marketing
          </p>
        </div>
        <Button className="chamego-gradient-dourado text-primary-foreground chamego-shadow-medium hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: "Total", value: campaigns.length, color: "text-primary" },
          {
            label: "Enviadas",
            value: campaigns.filter((c) => c.status === "sent").length,
            color: "text-status-success",
          },
          {
            label: "Agendadas",
            value: campaigns.filter((c) => c.status === "scheduled").length,
            color: "text-status-info",
          },
          {
            label: "Rascunhos",
            value: campaigns.filter((c) => c.status === "draft").length,
            color: "text-muted-foreground",
          },
        ].map((stat) => (
          <Card key={stat.label} className="chamego-shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns.map((campaign, index) => {
          const statusInfo = getStatusInfo(campaign.status);
          const StatusIcon = statusInfo.icon;

          return (
            <Card
              key={campaign.id}
              className="chamego-shadow-soft hover:chamego-shadow-medium transition-all hover:-translate-y-1 cursor-pointer"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold truncate">{campaign.name}</h3>
                      <Badge className={statusInfo.color} variant="outline">
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{campaign.subject}</p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Criada em {formatDate(campaign.created_at)}
                        </span>
                      </div>
                      {campaign.sent_at && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-status-success" />
                          <span className="text-muted-foreground">
                            Enviada em {formatDate(campaign.sent_at)}
                          </span>
                        </div>
                      )}
                      {campaign.scheduled_at && !campaign.sent_at && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-status-info" />
                          <span className="text-muted-foreground">
                            Agendada para {formatDate(campaign.scheduled_at)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button variant="outline" size="sm">Ver Detalhes</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {campaigns.length === 0 && (
        <Card className="chamego-shadow-soft">
          <CardContent className="py-12 text-center">
            <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma campanha criada ainda</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando sua primeira campanha de email marketing
            </p>
            <Button className="chamego-gradient-dourado text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Campanha
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
