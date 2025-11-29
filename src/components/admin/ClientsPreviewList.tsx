import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ClienteCRM } from '@/types/crm.types';
import { User } from 'lucide-react';

interface ClientsPreviewListProps {
  clients: ClienteCRM[];
  isLoading?: boolean;
  maxVisible?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  onClientClick?: (clientId: string) => void;
}

export function ClientsPreviewList({
  clients,
  isLoading,
  maxVisible = 5,
  showViewAll = true,
  onViewAll,
  onClientClick,
}: ClientsPreviewListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Nenhum cliente encontrado neste segmento</p>
      </div>
    );
  }

  const visibleClients = clients.slice(0, maxVisible);
  const remainingCount = clients.length - maxVisible;

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-3">
      {visibleClients.map((client) => (
        <div
          key={client.id || client.email}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => onClientClick?.(client.id!)}
        >
          <Avatar className="h-10 w-10 border-2 border-border">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {getInitials(client.nome || client.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {client.nome || client.full_name || 'Cliente'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {client.email}
            </p>
          </div>
        </div>
      ))}

      {remainingCount > 0 && (
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm text-muted-foreground">
            + {remainingCount} {remainingCount === 1 ? 'cliente' : 'clientes'}
          </span>
          {showViewAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAll}
              className="text-primary hover:text-primary/80"
            >
              Ver todos →
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
