import { Badge } from '@/components/ui/badge';
import { Tag } from '@/lib/crm/tagging';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ClientTagBadgeProps {
  tag: Tag;
}

const tagDescriptions: Record<string, string> = {
  vip: 'Cliente de alto valor (ticket médio > R$150 ou valor total > R$500)',
  fiel: 'Cliente fiel com 5+ pedidos',
  iniciante: 'Primeira compra realizada',
  inativo: 'Sem compras há mais de 90 dias',
  'em-risco': 'Sem compras há 30-90 dias',
  'carrinho-ativo': 'Possui items no carrinho',
  'wishlist-cheia': '3+ items na wishlist',
  'desejo-latente': 'Tem items na wishlist mas nunca comprou',
  'multi-categoria': 'Comprou em 2+ categorias diferentes',
  'opt-out': 'Desativou emails de marketing',
};

const getVariantClassName = (variant: Tag['variant']) => {
  switch (variant) {
    case 'success':
      return 'bg-status-success/10 text-status-success border-status-success/20';
    case 'warning':
      return 'bg-status-warning/10 text-status-warning border-status-warning/20';
    case 'destructive':
      return 'bg-status-error/10 text-status-error border-status-error/20';
    case 'info':
      return 'bg-status-info/10 text-status-info border-status-info/20';
    case 'interest':
      return 'bg-chamego-rosa/30 text-chamego-dourado border-chamego-rosa/50';
    default:
      return 'bg-chamego-dourado/10 text-chamego-dourado border-chamego-dourado/20';
  }
};

export function ClientTagBadge({ tag }: ClientTagBadgeProps) {
  const description = tagDescriptions[tag.id] || tag.label;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge 
            variant="outline" 
            className={`text-xs ${getVariantClassName(tag.variant)}`}
          >
            {tag.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
