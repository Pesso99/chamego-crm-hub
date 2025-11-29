import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClienteCRM, FilterGroup, FilterCondition } from '@/types/crm.types';

function buildSupabaseConditions(query: any, filterGroup: FilterGroup): any {
  if (!filterGroup.conditions || filterGroup.conditions.length === 0) {
    return query;
  }

  const buildCondition = (condition: FilterCondition | FilterGroup): string => {
    if ('operator' in condition && 'conditions' in condition) {
      // It's a FilterGroup
      const subConditions = condition.conditions.map(buildCondition);
      return `(${subConditions.join(` ${condition.operator} `)})`;
    } else {
      // It's a FilterCondition
      const { field, operator, value } = condition;
      
      switch (operator) {
        case '=':
          return `${field}.eq.${value}`;
        case '>':
          return `${field}.gt.${value}`;
        case '<':
          return `${field}.lt.${value}`;
        case '>=':
          return `${field}.gte.${value}`;
        case '<=':
          return `${field}.lte.${value}`;
        case '!=':
          return `${field}.neq.${value}`;
        case 'IN':
          return `${field}.in.(${Array.isArray(value) ? value.join(',') : value})`;
        case 'CONTAINS':
          return `${field}.cs.{${value}}`;
        case 'NOT_CONTAINS':
          return `not.${field}.cs.{${value}}`;
        case 'BETWEEN':
          const [min, max] = Array.isArray(value) ? value : [value, value];
          return `${field}.gte.${min},${field}.lte.${max}`;
        default:
          return `${field}.eq.${value}`;
      }
    }
  };

  const orConditions = filterGroup.conditions.map(buildCondition);
  
  if (filterGroup.operator === 'OR') {
    query = query.or(orConditions.join(','));
  } else {
    // AND conditions - apply each separately
    orConditions.forEach(condition => {
      const parts = condition.split('.');
      if (parts.length >= 3) {
        const field = parts[0].replace(/[()]/g, '');
        const op = parts[1];
        const val = parts.slice(2).join('.');
        
        if (op === 'eq') query = query.eq(field, val);
        else if (op === 'gt') query = query.gt(field, val);
        else if (op === 'lt') query = query.lt(field, val);
        else if (op === 'gte') query = query.gte(field, val);
        else if (op === 'lte') query = query.lte(field, val);
        else if (op === 'neq') query = query.neq(field, val);
      }
    });
  }

  return query;
}

export function useClientes(filters?: {
  status?: string;
  search?: string;
  tags?: string[];
  filterGroup?: FilterGroup;
  limit?: number;
  offset?: number;
}) {
  return useQuery<{ data: ClienteCRM[]; count: number }>({
    queryKey: ['clientes', filters],
    queryFn: async () => {
      let query = supabase.from('clientes_crm').select('*', { count: 'exact' });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.search) {
        query = query.or(
          `nome.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        );
      }

      // Filter by custom tags
      if (filters?.tags && filters.tags.length > 0) {
        const { data: clientsWithTags } = await supabase
          .from('client_tags')
          .select('user_id')
          .in('tag_id', filters.tags);

        const userIds = clientsWithTags?.map((c) => c.user_id) || [];
        if (userIds.length > 0) {
          query = query.in('id', userIds);
        } else {
          // No clients with these tags, return empty result
          return { data: [], count: 0 };
        }
      }

      // Apply FilterGroup conditions
      if (filters?.filterGroup) {
        query = buildSupabaseConditions(query, filters.filterGroup);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      return { data: (data as any[]) as ClienteCRM[] || [], count: count || 0 };
    },
  });
}

export function useCliente(userId: string) {
  return useQuery<ClienteCRM>({
    queryKey: ['cliente', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clientes_crm')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data as any as ClienteCRM;
    },
    enabled: !!userId,
  });
}
