import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { ClienteCRM } from '@/types/crm.types';
import { ClientsTableRow } from './ClientsTableRow';

interface ClientsTableProps {
  clientes: ClienteCRM[];
  isLoading: boolean;
  selectedIds: string[];
  onToggleSelection: (id: string) => void;
  onToggleAll: () => void;
  onClientClick: (id: string) => void;
  onBlockClient: (userId: string, blocked: boolean) => void;
  hasActiveFilters: boolean;
}

export function ClientsTable({
  clientes,
  isLoading,
  selectedIds,
  onToggleSelection,
  onToggleAll,
  onClientClick,
  onBlockClient,
  hasActiveFilters,
}: ClientsTableProps) {
  const selectableClients = clientes.filter(c => c.id && !c.blocked_communications);
  const allSelected = selectedIds.length === selectableClients.length && 
                      selectableClients.length > 0;

  return (
    <Card className="flex flex-col min-h-[400px] max-h-[600px] overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onToggleAll}
                />
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Comunicações</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Dias sem Comprar</TableHead>
              <TableHead>Ticket Médio</TableHead>
              <TableHead>Pedidos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : clientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <p className="text-muted-foreground">
                    {hasActiveFilters
                      ? 'Nenhum cliente encontrado com estes filtros'
                      : 'Nenhum cliente encontrado'}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              clientes.map((cliente) => (
                <ClientsTableRow
                  key={cliente.id}
                  cliente={cliente}
                  isSelected={selectedIds.includes(cliente.id!)}
                  onToggle={() => onToggleSelection(cliente.id!)}
                  onClick={() => onClientClick(cliente.id!)}
                  onBlock={(blocked) => onBlockClient(cliente.id!, blocked)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
