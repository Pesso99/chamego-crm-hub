import { useState } from 'react';
import { useClientes } from '@/hooks/useClientes';
import { useBlockClient } from '@/hooks/useBlockClient';
import { ClienteCRM, FilterGroup, Segment } from '@/types/crm.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQueryClient } from '@tanstack/react-query';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Mail, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientDrawer } from '@/components/admin/ClientDrawer';
import { IntelligentFiltersPanel } from '@/components/admin/IntelligentFiltersPanel';
import { SavedFiltersDropdown } from '@/components/admin/SavedFiltersDropdown';
import { ManageFiltersModal } from '@/components/admin/ManageFiltersModal';
import { ClientTagBadge } from '@/components/admin/ClientTagBadge';
import { calculateClientTags } from '@/lib/crm/tagging';
import { useCreateSegment, useUpdateSegment } from '@/hooks/useSegments';
import { Save, MoreVertical, FolderOpen, Settings } from 'lucide-react';
import { CreateCampaignDialog } from '@/components/admin/campaign-wizard/CreateCampaignDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { SelectedFilters } from '@/lib/crm/filter-definitions';
import { getFilterSummary } from '@/lib/crm/filter-query-builder';

export default function Clientes() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showBlocked, setShowBlocked] = useState(true);
  
  // New intelligent filter state
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = useState<FilterGroup | null>(null);
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  
  // Modal state
  const [manageFiltersOpen, setManageFiltersOpen] = useState(false);
  const [saveFilterDialogOpen, setSaveFilterDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterDescription, setFilterDescription] = useState('');
  
  // Manual selection state
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);

  // Sorting state
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const createSegment = useCreateSegment();
  const updateSegment = useUpdateSegment();
  const blockClient = useBlockClient({
    onMutate: async ({ userId, blocked }) => {
      await queryClient.cancelQueries({ queryKey: ['clientes'] });
      const previousData = queryClient.getQueryData(['clientes']);
      
      queryClient.setQueryData(['clientes'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((c: ClienteCRM) => 
            c.id === userId 
              ? { ...c, blocked_communications: blocked }
              : c
          ),
        };
      });
      
      return { previousData };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(['clientes'], context.previousData);
      }
    }
  });

  const limit = 20;
  const offset = page * limit;

  const { data, isLoading } = useClientes({
    search: search || undefined,
    status: status !== 'all' ? status : undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    filterGroup: currentFilters || undefined,
    limit,
    offset,
    orderBy: sortField || undefined,
    orderDirection: sortDirection,
  });

  const clientes = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  // Filtrar clientes bloqueados no frontend
  const clientesFiltrados = clientes.filter(cliente => {
    if (!showBlocked && cliente.blocked_communications) {
      return false;
    }
    return true;
  });

  const displayedCount = clientesFiltrados.length;
  const blockedCount = clientes.filter(c => c.blocked_communications).length;

  const handleClientClick = (clientId: string) => {
    setSelectedClientId(clientId);
    setDrawerOpen(true);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      ativo: 'default',
      inativo: 'destructive',
      novo: 'success',
    };
    return colors[status?.toLowerCase()] || 'secondary';
  };

  const handleLoadFilter = (segment: Segment) => {
    setCurrentFilters(segment.filters_json);
    setSelectedSegmentId(segment.id);
    toast.success(`Filtro "${segment.name}" carregado`);
  };

  const handleEditFilter = (segment: Segment) => {
    setCurrentFilters(segment.filters_json);
    setSelectedSegmentId(segment.id);
    setFilterName(segment.name);
    setFilterDescription(segment.description || '');
  };

  const handleSaveFilter = () => {
    if (!hasActiveFilters) {
      toast.error('Adicione pelo menos um filtro para salvar');
      return;
    }
    
    setSaveFilterDialogOpen(true);
  };

  const handleConfirmSaveFilter = async () => {
    if (!filterName.trim()) {
      toast.error('Digite um nome para o filtro');
      return;
    }

    if (!currentFilters) return;

    try {
      if (selectedSegmentId) {
        await updateSegment.mutateAsync({
          id: selectedSegmentId,
          name: filterName,
          description: filterDescription || undefined,
          filters_json: currentFilters,
        });
      } else {
        await createSegment.mutateAsync({
          name: filterName,
          description: filterDescription || undefined,
          filters_json: currentFilters,
        });
      }
      
      setSaveFilterDialogOpen(false);
      setFilterName('');
      setFilterDescription('');
    } catch (error) {
      console.error('Error saving filter:', error);
    }
  };

  const handleClearFilters = () => {
    setSelectedFilters([]);
    setSelectedTags([]);
    setCurrentFilters(null);
    setSelectedSegmentId(null);
    setFilterName('');
    setFilterDescription('');
    toast.info('Filtros limpos');
  };

  const hasActiveFilters = selectedFilters.length > 0 || selectedTags.length > 0;

  const handleToggleClientSelection = (clientId: string) => {
    setSelectedClientIds(prev => 
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleToggleAllClients = () => {
    const selectableClients = clientesFiltrados.filter(c => c.id && !c.blocked_communications);
    if (selectedClientIds.length === selectableClients.length && selectableClients.length > 0) {
      setSelectedClientIds([]);
    } else {
      setSelectedClientIds(selectableClients.map(c => c.id!));
    }
  };

  const handleCreateCampaignWithSelected = () => {
    if (selectedClientIds.length === 0) {
      toast.error('Selecione pelo menos um cliente');
      return;
    }
    setCampaignDialogOpen(true);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setPage(0); // Reset to first page when sorting changes
  };

  const SortableHeader = ({ field, label }: { field: string; label: string }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 select-none transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortField === field ? (
          sortDirection === 'asc' ? 
            <ArrowUp className="h-4 w-4" /> : 
            <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </TableHead>
  );

  const selectedClientsData = clientes.filter(c => 
    selectedClientIds.includes(c.id!)
  );

  return (
    <div className="flex flex-col gap-6 p-8 min-h-screen">
      {/* Top Section: Intelligent Filters */}
      <Card className="shrink-0">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">📊 Filtros Inteligentes</CardTitle>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {hasActiveFilters && (
                  <>
                    <DropdownMenuItem onClick={handleSaveFilter}>
                      <Save className="mr-2 h-4 w-4" />
                      {selectedSegmentId ? 'Atualizar' : 'Salvar'} Filtros
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => setManageFiltersOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Gerenciar Filtros Salvos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <IntelligentFiltersPanel
            selectedFilters={selectedFilters}
            onSelectedFiltersChange={setSelectedFilters}
            selectedTags={selectedTags}
            onSelectedTagsChange={setSelectedTags}
            onFiltersChange={setCurrentFilters}
            onPreviewCount={setPreviewCount}
          />
        </CardContent>
      </Card>

      {/* Bottom Section: Client Table */}
      <div className="flex flex-col space-y-4">
        {/* Search Bar + Saved Filters Dropdown */}
        <div className="flex gap-4">
          <Input
            placeholder="🔍 Buscar por nome, e-mail..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="flex-1"
          />

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
              <SelectItem value="novo">Novo</SelectItem>
            </SelectContent>
          </Select>

          <SavedFiltersDropdown
            onLoad={handleLoadFilter}
            onManage={() => setManageFiltersOpen(true)}
          />
        </div>

        {/* Preview Count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            📋 {displayedCount} cliente{displayedCount !== 1 ? 's' : ''}
            {hasActiveFilters && ' (filtrado)'}
            {!showBlocked && blockedCount > 0 && ` • ${blockedCount} oculto(s)`}
          </span>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowBlocked(!showBlocked)}
            >
              {showBlocked ? '🙈 Ocultar' : '👁️ Mostrar'} Bloqueados
            </Button>
            
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <Card className="flex flex-col min-h-[400px] max-h-[600px] overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedClientIds.length === clientesFiltrados.filter(c => c.id && !c.blocked_communications).length &&
                    clientesFiltrados.length > 0 &&
                    clientesFiltrados.filter(c => c.id && !c.blocked_communications).length > 0
                  }
                  onCheckedChange={handleToggleAllClients}
                />
              </TableHead>
              <SortableHeader field="nome" label="Nome" />
              <SortableHeader field="email" label="Email" />
              <SortableHeader field="status" label="Status" />
              <TableHead>Comunicações</TableHead>
              <TableHead>Tags</TableHead>
              <SortableHeader field="dias_sem_comprar" label="Dias sem Comprar" />
              <SortableHeader field="ticket_medio" label="Ticket Médio" />
              <SortableHeader field="numero_pedidos" label="Pedidos" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
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
              clientesFiltrados.map((cliente) => {
                const tags = calculateClientTags(cliente);

                return (
                  <TableRow
                    key={cliente.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleClientClick(cliente.id!)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedClientIds.includes(cliente.id!)}
                        onCheckedChange={() => handleToggleClientSelection(cliente.id!)}
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
                              onClick={() => {
                                blockClient.mutate({
                                  userId: cliente.id!,
                                  blocked: !cliente.blocked_communications
                                });
                              }}
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
              })
            )}
          </TableBody>
            </Table>
          </div>
        </Card>

        {/* Floating Action Bar */}
        {selectedClientIds.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <Card className="shadow-lg border-2 border-primary">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-lg px-3 py-1">
                    {selectedClientIds.length}
                  </Badge>
                  <span className="font-medium">
                    cliente{selectedClientIds.length !== 1 ? 's' : ''} selecionado{selectedClientIds.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <Separator orientation="vertical" className="h-8" />
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedClientIds([])}
                  >
                    Limpar Seleção
                  </Button>
                  <Button
                    onClick={handleCreateCampaignWithSelected}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar Comunicação
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {page + 1} de {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              Próxima
            </Button>
          </div>
        )}
      </div>

      {/* Client Drawer */}
      <ClientDrawer
        clientId={selectedClientId}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />

      {/* Manage Filters Modal */}
      <ManageFiltersModal
        open={manageFiltersOpen}
        onOpenChange={setManageFiltersOpen}
        onEdit={handleEditFilter}
      />

      {/* Campaign Dialog */}
      <CreateCampaignDialog
        open={campaignDialogOpen}
        onOpenChange={(open) => {
          setCampaignDialogOpen(open);
          if (!open) {
            setSelectedClientIds([]);
          }
        }}
        preselectedClients={selectedClientsData}
      />

      {/* Save Filter Dialog */}
      <Dialog open={saveFilterDialogOpen} onOpenChange={setSaveFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSegmentId ? 'Atualizar Filtro' : 'Salvar Filtro'}
            </DialogTitle>
            <DialogDescription>
              {selectedSegmentId
                ? 'Atualize as informações do filtro salvo'
                : 'Salve este conjunto de filtros para reutilização'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="filter-name">Nome do Filtro</Label>
              <Input
                id="filter-name"
                placeholder="Ex: Clientes VIP Inativos"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-description">Descrição (opcional)</Label>
              <Textarea
                id="filter-description"
                placeholder="Descreva o objetivo deste filtro..."
                value={filterDescription}
                onChange={(e) => setFilterDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSaveFilterDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmSaveFilter}
              disabled={createSegment.isPending || updateSegment.isPending}
            >
              {selectedSegmentId ? 'Atualizar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
