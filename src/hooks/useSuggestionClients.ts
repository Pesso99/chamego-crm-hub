import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FilterGroup, ClienteCRM } from '@/types/crm.types';

export function useSuggestionClients(filters: FilterGroup, enabled: boolean = false) {
  return useQuery({
    queryKey: ['suggestion-clients', filters],
    queryFn: async () => {
      // Start with basic query
      const { data, error } = await supabase
        .from('clientes_crm')
        .select('*')
        .eq('marketing_emails', true)
        .is('blocked_communications', false);

      if (error) throw error;
      
      const clients = (data || []) as ClienteCRM[];

      // Apply filters in memory
      if (!filters?.conditions || filters.conditions.length === 0) {
        return clients;
      }

      return clients.filter(client => {
        return filters.conditions.every((condition) => {
          if (
            condition &&
            typeof condition === 'object' &&
            'field' in condition &&
            'operator' in condition &&
            'value' in condition
          ) {
            const cond = condition as { field: string; operator: string; value: unknown };
            const clientValue = (client as any)[cond.field];

            switch (cond.operator) {
              case '=':
                return clientValue === cond.value;
              case '>':
                return typeof clientValue === 'number' && typeof cond.value === 'number' && clientValue > cond.value;
              case '<':
                return typeof clientValue === 'number' && typeof cond.value === 'number' && clientValue < cond.value;
              case '>=':
                return typeof clientValue === 'number' && typeof cond.value === 'number' && clientValue >= cond.value;
              case '<=':
                return typeof clientValue === 'number' && typeof cond.value === 'number' && clientValue <= cond.value;
              case '!=':
                return clientValue !== cond.value;
              case 'IN':
                return Array.isArray(cond.value) && cond.value.includes(clientValue);
              case 'CONTAINS':
                return typeof clientValue === 'string' && typeof cond.value === 'string' && clientValue.includes(cond.value);
              default:
                return true;
            }
          }
          return true;
        });
      });
    },
    enabled, // Only fetch when enabled (lazy loading)
    staleTime: 60000, // Cache for 1 minute
  });
}
