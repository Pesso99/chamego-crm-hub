export interface PresetFilter {
  id: string;
  label: string;
  icon?: string;
  color?: string;
  // Option 1: Simple field-based filter
  field?: string;
  operator?: '=' | '>' | '<' | '>=' | '<=' | '!=' | 'IN' | 'BETWEEN' | 'CONTAINS' | 'NOT_CONTAINS';
  value?: any;
  // Option 2: SQL-like condition string (for complex rules)
  sqlCondition?: string;
}

export interface FilterCategoryDefinition {
  label: string;
  id: string;
  filters: PresetFilter[];
  multiSelect?: boolean; // Default: true
  logicOperator?: 'OR' | 'AND'; // Logic within category (default OR)
}

export const FILTER_CATEGORIES: FilterCategoryDefinition[] = [
  {
    label: "Segmento",
    id: "segment",
    logicOperator: 'OR',
    filters: [
      { 
        id: "vip", 
        label: "💎 VIP",
        sqlCondition: "(valor_total_gasto > 500 OR ticket_medio > 150)",
      },
      { 
        id: "gold", 
        label: "🥇 Gold",
        sqlCondition: "(valor_total_gasto > 200 OR ticket_medio > 100)",
      },
      { 
        id: "silver", 
        label: "🥈 Silver",
        sqlCondition: "(valor_total_gasto > 100 OR ticket_medio > 50)",
      },
      { 
        id: "iniciante", 
        label: "🆕 Iniciante",
        field: "numero_pedidos",
        operator: "=",
        value: 1
      },
      { 
        id: "fiel", 
        label: "⭐ Fiel",
        field: "numero_pedidos",
        operator: ">=",
        value: 5
      }
    ]
  },
  {
    label: "Status",
    id: "status",
    logicOperator: 'OR',
    filters: [
      { id: "ativo", label: "✅ Ativo", field: "status", operator: "=", value: "Ativo" },
      { id: "em-risco", label: "⚠️ Em Risco", field: "status", operator: "=", value: "Em Risco" },
      { id: "inativo", label: "❌ Inativo", field: "status", operator: "=", value: "Inativo" },
      { id: "prospect", label: "🌱 Prospect", field: "status", operator: "=", value: "Prospect" }
    ]
  },
  {
    label: "Última Compra",
    id: "last-purchase",
    logicOperator: 'OR',
    filters: [
      { id: "0-7", label: "📅 Últimos 7d", field: "dias_sem_comprar", operator: "<=", value: 7 },
      { id: "8-15", label: "📅 8-15 dias", field: "dias_sem_comprar", operator: "BETWEEN", value: [8, 15] },
      { id: "16-30", label: "📅 16-30 dias", field: "dias_sem_comprar", operator: "BETWEEN", value: [16, 30] },
      { id: "31-60", label: "📅 31-60 dias", field: "dias_sem_comprar", operator: "BETWEEN", value: [31, 60] },
      { id: "+60", label: "📅 +60 dias", field: "dias_sem_comprar", operator: ">", value: 60 }
    ]
  },
  {
    label: "Valor Total",
    id: "total-value",
    logicOperator: 'OR',
    filters: [
      { id: "0-100", label: "💰 R$ 0-100", field: "valor_total_gasto", operator: "BETWEEN", value: [0, 100] },
      { id: "100-500", label: "💰 R$ 100-500", field: "valor_total_gasto", operator: "BETWEEN", value: [100, 500] },
      { id: "500-1000", label: "💰 R$ 500-1k", field: "valor_total_gasto", operator: "BETWEEN", value: [500, 1000] },
      { id: "+1000", label: "💰 R$ +1k", field: "valor_total_gasto", operator: ">", value: 1000 }
    ]
  },
  {
    label: "Ticket Médio",
    id: "avg-ticket",
    logicOperator: 'OR',
    filters: [
      { id: "0-50", label: "🎯 R$ 0-50", field: "ticket_medio", operator: "BETWEEN", value: [0, 50] },
      { id: "50-100", label: "🎯 R$ 50-100", field: "ticket_medio", operator: "BETWEEN", value: [50, 100] },
      { id: "100-200", label: "🎯 R$ 100-200", field: "ticket_medio", operator: "BETWEEN", value: [100, 200] },
      { id: "+200", label: "🎯 R$ +200", field: "ticket_medio", operator: ">", value: 200 }
    ]
  },
  {
    label: "Engajamento",
    id: "engagement",
    logicOperator: 'OR',
    filters: [
      { 
        id: "alto", 
        label: "🔥 Alto Engajamento",
        field: "numero_pedidos",
        operator: ">=",
        value: 5
      },
      { 
        id: "baixo", 
        label: "❄️ Baixo Engajamento",
        field: "numero_pedidos",
        operator: "<=",
        value: 1
      },
      { 
        id: "carrinho", 
        label: "🛒 Carrinho Ativo",
        field: "tem_carrinho_ativo",
        operator: "=",
        value: true
      },
      { 
        id: "wishlist", 
        label: "⭐ Wishlist Cheia",
        field: "itens_wishlist",
        operator: ">=",
        value: 3
      },
      { 
        id: "marketing", 
        label: "✉️ Aceita Marketing",
        field: "marketing_emails",
        operator: "=",
        value: true
      },
      { 
        id: "opt-out", 
        label: "🚫 Opt-out Marketing",
        field: "marketing_emails",
        operator: "=",
        value: false
      },
      { 
        id: "bloqueado", 
        label: "🚫 Bloqueado Comunicações",
        field: "blocked_communications",
        operator: "=",
        value: true
      }
    ]
  }
];

export interface SelectedFilter {
  categoryId: string;
  filterId: string;
  filter: PresetFilter;
}

export type SelectedFilters = SelectedFilter[];
