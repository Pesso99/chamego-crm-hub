import { FilterGroup, FilterCondition } from '@/types/crm.types';
import { supabase } from '@/integrations/supabase/client';

export function buildSegmentQuery(filters: FilterGroup): string {
  function buildCondition(condition: FilterCondition): string {
    const { field, operator, value } = condition;

    switch (operator) {
      case '=':
        return `${field} = ${typeof value === 'string' ? `'${value}'` : value}`;
      case '>':
        return `${field} > ${value}`;
      case '<':
        return `${field} < ${value}`;
      case '>=':
        return `${field} >= ${value}`;
      case '<=':
        return `${field} <= ${value}`;
      case '!=':
        return `${field} != ${typeof value === 'string' ? `'${value}'` : value}`;
      case 'IN':
        const inValues = Array.isArray(value) 
          ? value.map(v => typeof v === 'string' ? `'${v}'` : v).join(',')
          : value;
        return `${field} IN (${inValues})`;
      case 'BETWEEN':
        if (Array.isArray(value) && value.length === 2) {
          return `${field} BETWEEN ${value[0]} AND ${value[1]}`;
        }
        return '';
      case 'CONTAINS':
        return `'${value}' = ANY(${field})`;
      case 'NOT_CONTAINS':
        return `NOT ('${value}' = ANY(${field}))`;
      default:
        return '';
    }
  }

  function buildGroup(group: FilterGroup | FilterCondition): string {
    if ('field' in group) {
      return buildCondition(group);
    }

    const parts = group.conditions.map(buildGroup).filter(Boolean);
    return parts.length > 0 ? `(${parts.join(` ${group.operator} `)})` : '';
  }

  return buildGroup(filters);
}

export async function countSegmentMembers(segmentId: string): Promise<number> {
  try {
    const { data: segment, error: segmentError } = await supabase
      .from('segments' as any)
      .select('filters_json')
      .eq('id', segmentId)
      .single();

    if (segmentError) throw segmentError;

    const { count, error: countError } = await supabase
      .from('clientes_crm')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    return count || 0;
  } catch (error) {
    console.error('Error counting segment members:', error);
    return 0;
  }
}

export async function previewSegment(filters: FilterGroup): Promise<number> {
  try {
    // For now, return total count as we need to implement complex filter logic
    // This will be enhanced to actually apply the filter conditions
    const { count, error } = await supabase
      .from('clientes_crm')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error previewing segment:', error);
    return 0;
  }
}
