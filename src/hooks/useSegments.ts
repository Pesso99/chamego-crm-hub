import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Segment, FilterGroup } from '@/types/crm.types';
import { toast } from 'sonner';

export function useSegments() {
  return useQuery<Segment[]>({
    queryKey: ['segments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('segments' as any)
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist, return empty array instead of throwing
        if (error.code === '42P01') {
          console.warn('Segments table does not exist yet');
          return [];
        }
        throw error;
      }
      return (data as any[]) as Segment[];
    },
    retry: false, // Disable retries to prevent infinite loop
    staleTime: 30000, // Cache for 30s
  });
}

export function useCreateSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (segment: {
      name: string;
      description?: string;
      filters_json: FilterGroup;
    }) => {
      const { data, error } = await supabase
        .from('segments' as any)
        .insert({
          ...segment,
          created_by: '00000000-0000-0000-0000-000000000000',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
      toast.success('Segmento criado com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating segment:', error);
      toast.error('Erro ao criar segmento');
    },
  });
}

export function useUpdateSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Segment> & { id: string }) => {
      const { data, error } = await supabase
        .from('segments' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
      toast.success('Segmento atualizado!');
    },
    onError: () => {
      toast.error('Erro ao atualizar segmento');
    },
  });
}
