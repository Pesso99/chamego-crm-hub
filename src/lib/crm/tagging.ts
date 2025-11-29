import { ClienteCRM } from '@/types/crm.types';
import { supabase } from '@/integrations/supabase/client';

export interface Tag {
  id: string;
  label: string;
  category: 'valor' | 'status' | 'intencao' | 'interesse' | 'engajamento' | 'custom';
  variant: 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'interest';
  color?: string;
}

export function calculateClientTags(cliente: ClienteCRM): Tag[] {
  const tags: Tag[] = [];
  
  // Tags de Valor
  if ((cliente.ticket_medio && cliente.ticket_medio > 150) || 
      (cliente.valor_total_gasto && cliente.valor_total_gasto > 500)) {
    tags.push({ 
      id: 'vip', 
      label: 'VIP', 
      category: 'valor', 
      variant: 'default' 
    });
  }
  
  if (cliente.numero_pedidos && cliente.numero_pedidos >= 5) {
    tags.push({ 
      id: 'fiel', 
      label: 'Cliente Fiel', 
      category: 'valor', 
      variant: 'success' 
    });
  } else if (cliente.numero_pedidos === 1) {
    tags.push({ 
      id: 'iniciante', 
      label: 'Primeira Compra', 
      category: 'valor', 
      variant: 'info' 
    });
  }
  
  // Tags de Status
  if (cliente.dias_sem_comprar) {
    if (cliente.dias_sem_comprar > 90) {
      tags.push({ 
        id: 'inativo', 
        label: 'Inativo', 
        category: 'status', 
        variant: 'destructive' 
      });
    } else if (cliente.dias_sem_comprar > 30) {
      tags.push({ 
        id: 'em-risco', 
        label: 'Em Risco', 
        category: 'status', 
        variant: 'warning' 
      });
    }
  }
  
  // Tags de Intenção
  if (cliente.tem_carrinho_ativo) {
    tags.push({ 
      id: 'carrinho-ativo', 
      label: 'Carrinho Ativo', 
      category: 'intencao', 
      variant: 'info' 
    });
  }
  
  if (cliente.itens_wishlist && cliente.itens_wishlist >= 3) {
    tags.push({ 
      id: 'wishlist-cheia', 
      label: 'Wishlist Cheia', 
      category: 'intencao', 
      variant: 'interest' 
    });
  } else if (cliente.itens_wishlist && cliente.itens_wishlist > 0 && 
             (!cliente.numero_pedidos || cliente.numero_pedidos === 0)) {
    tags.push({ 
      id: 'desejo-latente', 
      label: 'Desejo Latente', 
      category: 'intencao', 
      variant: 'interest' 
    });
  }
  
  // Tags de Interesse (Categorias)
  if (cliente.categorias_compradas && Array.isArray(cliente.categorias_compradas)) {
    if (cliente.categorias_compradas.length >= 2) {
      tags.push({ 
        id: 'multi-categoria', 
        label: 'Multi-Categoria', 
        category: 'interesse', 
        variant: 'interest' 
      });
    }
    
    // Adicionar primeiras 2 categorias como tags
    cliente.categorias_compradas.slice(0, 2).forEach((cat) => {
      tags.push({ 
        id: `cat-${cat}`, 
        label: cat, 
        category: 'interesse', 
        variant: 'interest' 
      });
    });
  }
  
  // Tags de Engajamento
  if (cliente.marketing_emails === false) {
    tags.push({ 
      id: 'opt-out', 
      label: 'Opt-Out', 
      category: 'engajamento', 
      variant: 'destructive' 
    });
  }
  
  return tags;
}

export function getTagVariant(category: Tag['category']): Tag['variant'] {
  const variantMap: Record<Tag['category'], Tag['variant']> = {
    valor: 'default',
    status: 'warning',
    intencao: 'info',
    interesse: 'interest',
    engajamento: 'success',
    custom: 'default',
  };
  
  return variantMap[category] || 'default';
}

// Get all tags (automatic + custom) for a client
export async function getClientAllTags(cliente: ClienteCRM): Promise<Tag[]> {
  const autoTags = calculateClientTags(cliente);
  
  try {
    const { data: clientTags } = await supabase
      .from('client_tags')
      .select('custom_tags(id, name, color)')
      .eq('user_id', cliente.id);

    const customTags: Tag[] = clientTags?.map((ct: any) => ({
      id: `custom-${ct.custom_tags.id}`,
      label: ct.custom_tags.name,
      category: 'custom' as const,
      variant: 'default' as const,
      color: ct.custom_tags.color,
    })) || [];

    return [...autoTags, ...customTags];
  } catch (error) {
    console.error('Error fetching custom tags:', error);
    return autoTags;
  }
}
