import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CustomTag {
  id: string;
  name: string;
  category: string;
  color: string;
  created_by: string | null;
  created_at: string;
  is_active: boolean;
}

export interface ClientTag {
  id: string;
  user_id: string;
  tag_id: string;
  assigned_at: string;
  assigned_by: string | null;
  custom_tags?: CustomTag;
}

// Get all active custom tags
export function useCustomTags() {
  return useQuery<CustomTag[]>({
    queryKey: ['custom-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_tags')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return (data as any[]) as CustomTag[];
    },
  });
}

// Create a new custom tag
export function useCreateCustomTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tag: { name: string; color?: string; category?: string }) => {
      const { data, error } = await supabase
        .from('custom_tags')
        .insert({
          name: tag.name,
          color: tag.color || '#A96418',
          category: tag.category || 'custom',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-tags'] });
      toast.success('Tag criada com sucesso!');
    },
    onError: (error: any) => {
      console.error('Error creating tag:', error);
      if (error.code === '23505') {
        toast.error('Já existe uma tag com este nome');
      } else {
        toast.error('Erro ao criar tag');
      }
    },
  });
}

// Update a custom tag
export function useUpdateCustomTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CustomTag> & { id: string }) => {
      const { data, error } = await supabase
        .from('custom_tags')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-tags'] });
      toast.success('Tag atualizada!');
    },
    onError: () => {
      toast.error('Erro ao atualizar tag');
    },
  });
}

// Delete a custom tag
export function useDeleteCustomTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagId: string) => {
      const { error } = await supabase
        .from('custom_tags')
        .update({ is_active: false })
        .eq('id', tagId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-tags'] });
      queryClient.invalidateQueries({ queryKey: ['client-tags'] });
      toast.success('Tag removida!');
    },
    onError: () => {
      toast.error('Erro ao remover tag');
    },
  });
}

// Get tags for a specific client
export function useClientTags(userId: string | null) {
  return useQuery<ClientTag[]>({
    queryKey: ['client-tags', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('client_tags')
        .select('*, custom_tags(*)')
        .eq('user_id', userId);

      if (error) throw error;
      return (data as any[]) as ClientTag[];
    },
    enabled: !!userId,
  });
}

// Add a tag to a client
export function useAddTagToClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, tagId }: { userId: string; tagId: string }) => {
      const { data, error } = await supabase
        .from('client_tags')
        .insert({
          user_id: userId,
          tag_id: tagId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['client-tags', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast.success('Tag adicionada ao cliente!');
    },
    onError: (error: any) => {
      console.error('Error adding tag:', error);
      if (error.code === '23505') {
        toast.error('Cliente já possui esta tag');
      } else {
        toast.error('Erro ao adicionar tag');
      }
    },
  });
}

// Remove a tag from a client
export function useRemoveTagFromClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, tagId }: { userId: string; tagId: string }) => {
      const { error } = await supabase
        .from('client_tags')
        .delete()
        .eq('user_id', userId)
        .eq('tag_id', tagId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['client-tags', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast.success('Tag removida!');
    },
    onError: () => {
      toast.error('Erro ao remover tag');
    },
  });
}
