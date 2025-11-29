import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EmailTemplate {
  id: string;
  resend_template_id?: string;
  name: string;
  alias?: string;
  description?: string;
  subject_template: string;
  body_template: string;
  variables?: string[];
  category?: string;
  status: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  synced_at?: string;
}

export function useTemplates() {
  return useQuery<EmailTemplate[]>({
    queryKey: ['email-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EmailTemplate[];
    },
  });
}

export function useSyncResendTemplates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('sync-resend-templates');
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast.success(`${data.synced} templates sincronizados com sucesso!`);
    },
    onError: (error: Error) => {
      console.error('Error syncing templates:', error);
      toast.error('Erro ao sincronizar templates');
    },
  });
}
