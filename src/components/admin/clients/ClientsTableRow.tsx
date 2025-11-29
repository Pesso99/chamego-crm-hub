import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ClientTagBadge } from '@/components/admin/ClientTagBadge';
import { ClienteCRM } from '@/types/crm.types';
import { calculateClientTags } from '@/lib/crm/tagging';
import { MoreVertical } from 'lucide-react';

interface ClientsTableRowProps {
  cliente: ClienteCRM;
  isSelected: boolean;
  onToggle: () => void;
  onClick: () => void;
  onBlock: (blocked: boolean) => void;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, any> = {
    ativo: 'default',
    inativo: 'destructive',
    novo: 'success',
  };
  return colors[status?.toLowerCase()] || 'secondary';
};

export function ClientsTableRow({
  cliente,
  isSelected,
  onToggle,
  onClick,
  onBlock,
}: ClientsTableRowProps) {
  const tags = calculateClientTags(cliente);

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={onClick}
    >
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggle}
          disabled={cliente.blocked_communications}
        />
      </TableCell>
      <TableCell className="font-medium">{cliente.nome}</TableCell>
      <TableCell>{cliente.email}</TableCell>
      <TableCell>
        <Badge variant={getStatusColor(cliente.status || '')}>
          {cliente.status}
        </Badge>
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          {cliente.blocked_communications ? (
            <Badge variant="destructive" className="text-xs">
              🚫 Bloqueado
            </Badge>
          ) : (
            <Badge variant="default" className="text-xs">
              ✅ Ativo
            </Badge>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onBlock(!cliente.blocked_communications)}
              >
                {cliente.blocked_communications ? (
                  <>✅ Remover da Blacklist</>
                ) : (
                  <>🚫 Adicionar à Blacklist</>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1 max-w-[300px]">
          {tags.slice(0, 3).map((tag) => (
            <ClientTagBadge key={tag.id} tag={tag} />
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        {cliente.dias_sem_comprar !== null && cliente.dias_sem_comprar !== undefined
          ? `${cliente.dias_sem_comprar} dias`
          : '-'}
      </TableCell>
      <TableCell>
        {cliente.ticket_medio
          ? `R$ ${cliente.ticket_medio.toFixed(2)}`
          : '-'}
      </TableCell>
      <TableCell>{cliente.numero_pedidos || 0}</TableCell>
    </TableRow>
  );
}
