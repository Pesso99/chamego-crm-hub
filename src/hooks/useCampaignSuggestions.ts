import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FilterGroup } from '@/types/crm.types';

export interface CampaignSuggestion {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetCount: number;
  segmentFilters: FilterGroup;
  suggestedTemplate?: string;
  priority: 'high' | 'medium' | 'low';
}

export function useCampaignSuggestions() {
  return useQuery<CampaignSuggestion[]>({
    queryKey: ['campaign-suggestions'],
    queryFn: async () => {
      const suggestions: CampaignSuggestion[] = [];

      // 1. Clientes Inativos (não compraram em 60+ dias)
      const { count: inactiveCount } = await supabase
        .from('clientes_crm')
        .select('*', { count: 'exact', head: true })
        .gte('dias_sem_comprar', 60)
        .eq('marketing_emails', true)
        .not('blocked_communications', 'eq', true);

      if (inactiveCount && inactiveCount > 0) {
        suggestions.push({
          id: 'inactive-recovery',
          title: 'Recuperação de Clientes Inativos',
          description: `${inactiveCount} clientes não compram há mais de 60 dias`,
          icon: '🔄',
          targetCount: inactiveCount,
          segmentFilters: {
            operator: 'AND',
            conditions: [
              { field: 'dias_sem_comprar', operator: '>=', value: 60 },
              { field: 'marketing_emails', operator: '=', value: true },
            ],
          },
          suggestedTemplate: 'Recuperação de Cliente',
          priority: 'high',
        });
      }

      // 2. Carrinhos Abandonados
      const { count: abandonedCartCount } = await supabase
        .from('clientes_crm')
        .select('*', { count: 'exact', head: true })
        .gt('itens_carrinho', 0)
        .eq('marketing_emails', true)
        .not('blocked_communications', 'eq', true);

      if (abandonedCartCount && abandonedCartCount > 0) {
        suggestions.push({
          id: 'abandoned-cart',
          title: 'Carrinhos Abandonados',
          description: `${abandonedCartCount} clientes com itens no carrinho`,
          icon: '🛒',
          targetCount: abandonedCartCount,
          segmentFilters: {
            operator: 'AND',
            conditions: [
              { field: 'itens_carrinho', operator: '>', value: 0 },
              { field: 'marketing_emails', operator: '=', value: true },
            ],
          },
          suggestedTemplate: 'Carrinho Abandonado',
          priority: 'high',
        });
      }

      // 3. Clientes de Alto Valor sem Compra Recente
      const { count: highValueCount } = await supabase
        .from('clientes_crm')
        .select('*', { count: 'exact', head: true })
        .gte('valor_total_gasto', 500)
        .gte('dias_sem_comprar', 30)
        .eq('marketing_emails', true)
        .not('blocked_communications', 'eq', true);

      if (highValueCount && highValueCount > 0) {
        suggestions.push({
          id: 'high-value-winback',
          title: 'Reconquistar Clientes VIP',
          description: `${highValueCount} clientes de alto valor inativos há 30+ dias`,
          icon: '💎',
          targetCount: highValueCount,
          segmentFilters: {
            operator: 'AND',
            conditions: [
              { field: 'valor_total_gasto', operator: '>=', value: 500 },
              { field: 'dias_sem_comprar', operator: '>=', value: 30 },
              { field: 'marketing_emails', operator: '=', value: true },
            ],
          },
          suggestedTemplate: 'Oferta VIP',
          priority: 'high',
        });
      }

      // 4. Novos Clientes (primeira compra nos últimos 7 dias)
      const { count: newCustomerCount } = await supabase
        .from('clientes_crm')
        .select('*', { count: 'exact', head: true })
        .eq('numero_pedidos', 1)
        .lte('dias_sem_comprar', 7)
        .eq('marketing_emails', true)
        .not('blocked_communications', 'eq', true);

      if (newCustomerCount && newCustomerCount > 0) {
        suggestions.push({
          id: 'welcome-series',
          title: 'Boas-vindas para Novos Clientes',
          description: `${newCustomerCount} novos clientes nos últimos 7 dias`,
          icon: '👋',
          targetCount: newCustomerCount,
          segmentFilters: {
            operator: 'AND',
            conditions: [
              { field: 'numero_pedidos', operator: '=', value: 1 },
              { field: 'dias_sem_comprar', operator: '<=', value: 7 },
              { field: 'marketing_emails', operator: '=', value: true },
            ],
          },
          suggestedTemplate: 'Boas-vindas',
          priority: 'medium',
        });
      }

      // 5. Cross-sell baseado em compras anteriores
      const { count: crossSellCount } = await supabase
        .from('clientes_crm')
        .select('*', { count: 'exact', head: true })
        .gte('numero_pedidos', 2)
        .lte('dias_sem_comprar', 30)
        .eq('marketing_emails', true)
        .not('blocked_communications', 'eq', true);

      if (crossSellCount && crossSellCount > 0) {
        suggestions.push({
          id: 'cross-sell',
          title: 'Recomendações Personalizadas',
          description: `${crossSellCount} clientes ativos para cross-sell`,
          icon: '🎁',
          targetCount: crossSellCount,
          segmentFilters: {
            operator: 'AND',
            conditions: [
              { field: 'numero_pedidos', operator: '>=', value: 2 },
              { field: 'dias_sem_comprar', operator: '<=', value: 30 },
              { field: 'marketing_emails', operator: '=', value: true },
            ],
          },
          suggestedTemplate: 'Recomendação de Produtos',
          priority: 'medium',
        });
      }

      // Ordenar por prioridade
      return suggestions.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    },
    staleTime: 60000, // 1 minuto
  });
}
