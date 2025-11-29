import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ClienteCRM } from '@/types/crm.types';
import { Search, Sparkles } from 'lucide-react';

interface ClientsListDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: ClienteCRM[];
  title?: string;
  description?: string;
  onCreateCampaign?: () => void;
  onClientClick?: (clientId: string) => void;
}

export function ClientsListDrawer({
  open,
  onOpenChange,
  clients,
  title = 'Clientes do Segmento',
  description,
  onCreateCampaign,
  onClientClick,
}: ClientsListDrawerProps) {
  const [search, setSearch] = useState('');

  const filteredClients = clients.filter((client) => {
    const searchLower = search.toLowerCase();
    return (
      client.nome?.toLowerCase().includes(searchLower) ||
      client.full_name?.toLowerCase().includes(searchLower) ||
      client.email?.toLowerCase().includes(searchLower)
    );
  });

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Count */}
          <div className="text-sm text-muted-foreground">
            {filteredClients.length === clients.length ? (
              <span>{clients.length} {clients.length === 1 ? 'cliente' : 'clientes'}</span>
            ) : (
              <span>
                {filteredClients.length} de {clients.length} {clients.length === 1 ? 'cliente' : 'clientes'}
              </span>
            )}
          </div>

          {/* List */}
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-2">
              {filteredClients.map((client) => (
                <div
                  key={client.id || client.email}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    onClientClick?.(client.id!);
                    onOpenChange(false);
                  }}
                >
                  <Avatar className="h-12 w-12 border-2 border-border">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(client.nome || client.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {client.nome || client.full_name || 'Cliente'}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {client.email}
                    </p>
                    {client.status && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Status: {client.status}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {filteredClients.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Nenhum cliente encontrado</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Actions */}
          {onCreateCampaign && (
            <div className="pt-4 border-t">
              <Button
                onClick={() => {
                  onCreateCampaign();
                  onOpenChange(false);
                }}
                className="w-full"
                size="lg"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Criar Campanha com estes Clientes
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
