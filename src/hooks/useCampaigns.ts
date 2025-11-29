import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Campaign } from '@/types/crm.types';
import { toast } from 'sonner';

export function useCampaigns(status?: string) {
  return useQuery<Campaign[]>({
    queryKey: ['campaigns', status],
    queryFn: async () => {
      let query = supabase
        .from('campaigns' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data as any[]) as Campaign[];
    },
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaign: {
      name: string;
      segment_id: string;
      subject: string;
      body_html: string;
      scheduled_at?: string;
      frequency_cap?: { max_per_week: number; lookback_days: number };
    }) => {
      const { data, error } = await supabase
        .from('campaigns' as any)
        .insert({
          ...campaign,
          created_by: '00000000-0000-0000-0000-000000000000',
          status: campaign.scheduled_at ? 'scheduled' : 'draft',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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

export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Campaign> & { id: string }) => {
      const { data, error } = await supabase
        .from('campaigns' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campanha atualizada!');
    },
    onError: () => {
      toast.error('Erro ao atualizar campanha');
    },
  });
}
