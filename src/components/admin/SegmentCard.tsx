import { Segment } from '@/types/crm.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Eye, MoreVertical, Lightbulb } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SegmentCardProps {
  segment: Segment;
  onViewClients?: () => void;
  onCreateCampaign?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onArchive?: () => void;
}

const SEGMENT_RECOMMENDATIONS: Record<string, string> = {
  'Carrinho Abandonado': 'Envie um lembrete com desconto especial para recuperar a venda',
  'VIP Inativo': 'Campanha de reativação exclusiva com benefícios VIP',
  'Primeira Compra': 'Email de boas-vindas com dicas de uso e cupom para próxima compra',
  'Wishlist Quente': 'Notifique sobre promoções nos items da wishlist',
};

export function SegmentCard({ 
  segment, 
  onViewClients,
  onCreateCampaign,
  onEdit,
  onDuplicate,
  onArchive
}: SegmentCardProps) {
  const recommendation = SEGMENT_RECOMMENDATIONS[segment.name];
  
  const getFilterSummary = () => {
    if (!segment.filters_json?.conditions) return 'Sem filtros';
    
    const count = segment.filters_json.conditions.length;
    return `${count} ${count === 1 ? 'filtro' : 'filtros'} (${segment.filters_json.operator})`;
  };

  return (
    <Card className="hover:shadow-md transition-all cursor-pointer group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span>{segment.name}</span>
              <Badge variant="secondary" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {segment.customer_count || 0}
              </Badge>
            </CardTitle>
            {segment.description && (
              <CardDescription className="mt-1">{segment.description}</CardDescription>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>}
              {onDuplicate && <DropdownMenuItem onClick={onDuplicate}>Duplicar</DropdownMenuItem>}
              {onArchive && (
                <DropdownMenuItem onClick={onArchive} className="text-destructive">
                  Arquivar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Filtros aplicados</span>
            <span className="font-medium">{getFilterSummary()}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Criado em</span>
            <span>{new Date(segment.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
          {segment.last_calculated_at && (
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Atualizado em</span>
              <span>{new Date(segment.last_calculated_at).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
        </div>

        {recommendation && (
          <div className="flex gap-2 p-3 bg-status-info/10 border border-status-info/20 rounded-lg">
            <Lightbulb className="h-4 w-4 text-status-info shrink-0 mt-0.5" />
            <p className="text-xs text-status-info">{recommendation}</p>
          </div>
        )}

        <div className="flex gap-2">
          {onViewClients && (
            <Button variant="outline" size="sm" onClick={onViewClients} className="flex-1">
              <Eye className="mr-2 h-4 w-4" />
              Ver Clientes
            </Button>
          )}
          {onCreateCampaign && (
            <Button size="sm" onClick={onCreateCampaign} className="flex-1">
              <Mail className="mr-2 h-4 w-4" />
              Criar Campanha
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
