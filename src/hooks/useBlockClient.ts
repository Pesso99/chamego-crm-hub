import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useBlockClient(callbacks?: {
  onMutate?: (variables: { userId: string; blocked: boolean }) => Promise<any>;
  onError?: (error: any, variables: any, context: any) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, blocked }: { userId: string; blocked: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ blocked_communications: blocked })
        .eq('user_id', userId);

      if (error) throw error;
    },
    onMutate: callbacks?.onMutate,
    onSuccess: () => {
      toast.success('✅ Cliente atualizado');
    },
    onError: (error: any, variables, context) => {
      console.error('Erro ao bloquear:', error);
      toast.error('❌ Erro ao atualizar cliente');
      callbacks?.onError?.(error, variables, context);
    },
  });
}
