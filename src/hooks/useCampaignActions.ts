import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ClienteCRM } from '@/types/crm.types';

interface CreateCampaignWithLogsParams {
  name: string;
  segmentId?: string;
  subject: string;
  bodyHtml: string;
  scheduledAt?: string;
  frequencyCap?: { max_per_week: number; lookback_days: number };
  clients: ClienteCRM[];
  templateId?: string;
}

export function useCreateCampaignWithLogs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateCampaignWithLogsParams) => {
      const {
        name,
        segmentId,
        subject,
        bodyHtml,
        scheduledAt,
        frequencyCap,
        clients,
        templateId,
      } = params;

      // Verificar se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Validar que existem clientes selecionados
      if (!clients || clients.length === 0) {
        throw new Error('Nenhum cliente selecionado para a campanha');
      }

      console.log(`Criando campanha para ${clients.length} cliente(s)`);

      // 1. Create campaign
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          name,
          segment_id: segmentId || null,
          template_id: templateId || null,
          subject,
          body_html: bodyHtml,
          status: scheduledAt ? 'scheduled' : 'draft',
          scheduled_at: scheduledAt,
          frequency_cap: frequencyCap,
          created_by: user.id,
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // 2. Create campaign logs for each client
      const logs = clients.map(client => ({
        campaign_id: campaign.id,
        user_id: client.id || null,
        email: client.email,
        status: 'queued' as const,
        metadata: {
          nome: client.nome || client.full_name,
          email: client.email,
          valor_total_gasto: client.valor_total_gasto,
          numero_pedidos: client.numero_pedidos,
        },
      }));

      const { error: logsError } = await supabase
        .from('campaign_logs')
        .insert(logs);

      if (logsError) throw logsError;

      // 3. Invoke edge function to send campaign if immediate
      if (!scheduledAt) {
        const { error: sendError } = await supabase.functions.invoke('send-campaign', {
          body: { campaignId: campaign.id },
        });

        if (sendError) {
          console.error('Error invoking send-campaign:', sendError);
        }
      }

      return campaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campanha criada com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating campaign:', error);
      toast.error('Erro ao criar campanha');
    },
  });
}

export const useCampaignActions = useCreateCampaignWithLogs;
