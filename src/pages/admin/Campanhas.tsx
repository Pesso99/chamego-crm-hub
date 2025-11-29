import { useState } from 'react';
import { useCampaigns } from '@/hooks/useCampaigns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Mail, Calendar, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { CampaignSuggestions } from '@/components/admin/CampaignSuggestions';
import { CreateCampaignDialog } from '@/components/admin/campaign-wizard/CreateCampaignDialog';

export default function Campanhas() {
  const [activeTab, setActiveTab] = useState('all');
  const { data: campaigns, isLoading } = useCampaigns(
    activeTab === 'all' ? undefined : activeTab
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'sending':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'paused':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Rascunho',
      scheduled: 'Agendada',
      sending: 'Enviando',
      sent: 'Enviada',
      paused: 'Pausada',
      cancelled: 'Cancelada',
    };
    return labels[status] || status;
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campanhas</h1>
          <p className="text-muted-foreground">Gerencie suas campanhas de email marketing</p>
        </div>
        <Button className="chamego-border-accent" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Campanha
        </Button>
      </div>

      <div className="mb-8">
        <CampaignSuggestions />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="draft">Rascunhos</TabsTrigger>
          <TabsTrigger value="scheduled">Agendadas</TabsTrigger>
          <TabsTrigger value="sent">Enviadas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : campaigns?.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma campanha ainda</h3>
                <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
                  Comece criando sua primeira campanha de email para engajar seus clientes
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeira Campanha
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {campaigns?.map((campaign) => (
                <Card
                  key={campaign.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{campaign.name}</CardTitle>
                        <CardDescription className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {campaign.subject}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(campaign.status)} variant="outline">
                        {getStatusLabel(campaign.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      {campaign.scheduled_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(campaign.scheduled_at).toLocaleString('pt-BR')}
                        </span>
                      )}
                      {campaign.sent_at && (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Enviada em {new Date(campaign.sent_at).toLocaleString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateCampaignDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
