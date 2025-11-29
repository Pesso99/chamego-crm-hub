// CRM Types
export interface FilterCondition {
  field: string;
  operator: '=' | '>' | '<' | '>=' | '<=' | '!=' | 'IN' | 'BETWEEN' | 'CONTAINS' | 'NOT_CONTAINS';
  value: string | number | boolean | string[] | number[];
}

export interface FilterGroup {
  operator: 'AND' | 'OR';
  conditions: (FilterCondition | FilterGroup)[];
}

export interface Segment {
  id: string;
  name: string;
  description?: string;
  filters_json: FilterGroup;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  customer_count: number;
  last_calculated_at?: string;
}

export interface Campaign {
  id: string;
  name: string;
  segment_id: string;
  subject: string;
  body_html: string;
  body_variables?: Record<string, string>;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  scheduled_at?: string;
  sent_at?: string;
  frequency_cap?: {
    max_per_week: number;
    lookback_days: number;
  };
  bypass_checks: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignLog {
  id: string;
  campaign_id: string;
  user_id: string;
  email: string;
  status: 'queued' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed' | 'suppressed';
  suppression_reason?: string;
  sent_at?: string;
  delivered_at?: string;
  opened_at?: string;
  clicked_at?: string;
  clicked_url?: string;
  error_message?: string;
  metadata?: Record<string, any>;
}

export interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  subject_template: string;
  body_template: string;
  variables?: string[];
  category?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface SuppressionItem {
  id: string;
  email: string;
  reason?: string;
  added_by?: string;
  added_at: string;
  notes?: string;
}

export interface Tag {
  id: string;
  label: string;
  category: 'valor' | 'status' | 'intencao' | 'interesse' | 'engajamento';
  variant: 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'interest';
}

export interface ClienteCRM {
  id?: string;
  user_id?: string;
  full_name?: string;
  email: string;
  nome?: string;
  valor_total_gasto: number;
  ticket_medio: number;
  numero_pedidos: number;
  ultima_compra: string;
  dias_sem_comprar: number;
  categorias_compradas: string[];
  produtos_favoritos: string[];
  itens_carrinho: number;
  itens_wishlist: number;
  cupons_usados: string[] | number;
  status: 'Ativo' | 'Em Risco' | 'Inativo' | 'Prospect';
  marketing_emails: boolean;
  blocked_communications?: boolean;
  email_confirmado?: boolean;
  genero?: string;
  telefone?: string;
  data_nascimento?: string;
  segmento?: string;
  preferencia_comunicacao?: string;
  ultima_comunicacao?: string;
  tem_carrinho_ativo?: boolean;
  updated_at?: string;
}

export interface CampaignMetrics {
  total_sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  failed: number;
  suppressed: number;
  open_rate: number;
  click_rate: number;
}

export interface DashboardKPIs {
  total: number;
  ativos: number;
  emRisco: number;
  inativos: number;
  pctOptIn: number;
}

export interface FilterField {
  id: string;
  label: string;
  type: 'number' | 'currency' | 'text' | 'select' | 'boolean' | 'array' | 'date';
  options?: string[];
}

export const FILTER_FIELDS: FilterField[] = [
  { id: 'dias_sem_comprar', label: 'Dias sem comprar', type: 'number' },
  { id: 'valor_total_gasto', label: 'Valor total gasto', type: 'currency' },
  { id: 'ticket_medio', label: 'Ticket médio', type: 'currency' },
  { id: 'numero_pedidos', label: 'Número de pedidos', type: 'number' },
  { id: 'categorias_compradas', label: 'Categorias compradas', type: 'array' },
  { id: 'status', label: 'Status', type: 'select', options: ['Ativo', 'Em Risco', 'Inativo', 'Prospect'] },
  { id: 'marketing_emails', label: 'Aceita marketing', type: 'boolean' },
  { id: 'email_confirmado', label: 'Email confirmado', type: 'boolean' },
  { id: 'itens_carrinho', label: 'Itens no carrinho', type: 'number' },
  { id: 'itens_wishlist', label: 'Itens na wishlist', type: 'number' },
  { id: 'ultima_compra', label: 'Última compra', type: 'date' },
];
