import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCampaigns } from '@/hooks/useCampaigns';
import { EmptyState } from '@/components/ui/empty-state';
import { Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusVariant = {
  rascunho: 'secondary' as const,
  agendada: 'default' as const,
  enviada: 'success' as const,
  cancelada: 'destructive' as const,
};

const statusLabel = {
  rascunho: 'Rascunho',
  agendada: 'Agendada',
  enviada: 'Enviada',
  cancelada: 'Cancelada',
};

export function RecentCampaigns() {
  const navigate = useNavigate();
  const { data: campaigns, isLoading } = useCampaigns();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campanhas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentCampaigns = campaigns?.slice(0, 5) || [];

  if (recentCampaigns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campanhas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Mail}
            title="Nenhuma campanha ainda"
            description="Crie sua primeira campanha de e-mail para engajar seus clientes."
            action={{
              label: 'Criar Campanha',
              onClick: () => navigate('/admin/campanhas'),
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campanhas Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentCampaigns.map((campaign) => (
            <Link
              key={campaign.id}
              to={`/admin/campanhas`}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-chamego-pink/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-chamego-pink" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{campaign.name}</p>
                  <Badge variant={statusVariant[campaign.status || 'rascunho']}>
                    {statusLabel[campaign.status || 'rascunho']}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {campaign.sent_at
                    ? `Enviada ${formatDistanceToNow(new Date(campaign.sent_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}`
                    : campaign.scheduled_at
                    ? `Agendada para ${formatDistanceToNow(new Date(campaign.scheduled_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}`
                    : 'Em rascunho'}
                </p>
              </div>
            </Link>
          ))}
        </div>
        
        <Link to="/admin/campanhas" className="block mt-4">
          <button className="text-sm text-primary hover:underline w-full text-left">
            Ver todas as campanhas →
          </button>
        </Link>
      </CardContent>
    </Card>
  );
}
