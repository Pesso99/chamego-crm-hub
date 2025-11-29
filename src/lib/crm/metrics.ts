import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CampaignMetrics, DashboardKPIs } from '@/types/crm.types';

export function useCampaignMetrics(campaignId: string) {
  return useQuery<CampaignMetrics>({
    queryKey: ['campaign-metrics', campaignId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('calculate_campaign_metrics' as any, {
        _campaign_id: campaignId,
      });

      if (error) throw error;
      return data as CampaignMetrics;
    },
    enabled: !!campaignId,
  });
}

export function useDashboardKPIs() {
  return useQuery<DashboardKPIs>({
    queryKey: ['dashboard-kpis'],
    queryFn: async () => {
      const { data: clientes, error } = await supabase
        .from('clientes_crm')
        .select('*');

      if (error) throw error;

      const total = clientes?.length || 0;
      const ativos = clientes?.filter((c) => c.dias_sem_comprar <= 30).length || 0;
      const emRisco =
        clientes?.filter((c) => c.dias_sem_comprar > 30 && c.dias_sem_comprar <= 90)
          .length || 0;
      const inativos = clientes?.filter((c) => c.dias_sem_comprar > 90).length || 0;
      const pctOptIn =
        total > 0
          ? ((clientes?.filter((c) => c.marketing_emails).length || 0) / total) * 100
          : 0;

      return { total, ativos, emRisco, inativos, pctOptIn };
    },
  });
}
