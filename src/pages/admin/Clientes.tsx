import { useState } from 'react';
import { useClientes } from '@/hooks/useClientes';
import { useBlockClient } from '@/hooks/useBlockClient';
import { ClienteCRM, FilterGroup, Segment } from '@/types/crm.types';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateSegment, useUpdateSegment } from '@/hooks/useSegments';
import { CreateCampaignDialog } from '@/components/admin/campaign-wizard/CreateCampaignDialog';
import { ClientDrawer } from '@/components/admin/ClientDrawer';
import { ManageFiltersModal } from '@/components/admin/ManageFiltersModal';
import { SelectedFilters } from '@/lib/crm/filter-definitions';
import { toast } from 'sonner';

// New modular components
import { ClientsHeader } from '@/components/admin/clients/ClientsHeader';
import { ClientsFiltersCard } from '@/components/admin/clients/ClientsFiltersCard';
import { ClientsSearchBar } from '@/components/admin/clients/ClientsSearchBar';
import { ClientsTable } from '@/components/admin/clients/ClientsTable';
import { ClientsBulkActions } from '@/components/admin/clients/ClientsBulkActions';
import { ClientsPagination } from '@/components/admin/clients/ClientsPagination';
import { SaveFilterDialog } from '@/components/admin/clients/SaveFilterDialog';

export default function Clientes() {
  const queryClient = useQueryClient();
  
  // Search and filter state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [showBlocked, setShowBlocked] = useState(true);
  
  // Intelligent filter state
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
  
  // Client drawer state
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Manual selection state
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);

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
  });

  const clientes = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

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

  const selectedClientsData = clientes.filter(c => 
    selectedClientIds.includes(c.id!)
  );

  const handleBlockClient = (userId: string, blocked: boolean) => {
    blockClient.mutate({ userId, blocked });
  };

  return (
    <div className="flex flex-col gap-6 p-8 min-h-screen">
      <ClientsHeader />

      <ClientsFiltersCard
        selectedFilters={selectedFilters}
        onSelectedFiltersChange={setSelectedFilters}
        selectedTags={selectedTags}
        onSelectedTagsChange={setSelectedTags}
        onFiltersChange={setCurrentFilters}
        onPreviewCount={setPreviewCount}
        hasActiveFilters={hasActiveFilters}
        onSave={handleSaveFilter}
        onManage={() => setManageFiltersOpen(true)}
        selectedSegmentId={selectedSegmentId}
      />

      <div className="flex flex-col space-y-4">
        <ClientsSearchBar
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(0);
          }}
          status={status}
          onStatusChange={setStatus}
          onLoadFilter={handleLoadFilter}
          onManageFilters={() => setManageFiltersOpen(true)}
          displayedCount={displayedCount}
          hasActiveFilters={hasActiveFilters}
          showBlocked={showBlocked}
          onToggleBlocked={() => setShowBlocked(!showBlocked)}
          blockedCount={blockedCount}
          onClearFilters={handleClearFilters}
        />

        <ClientsTable
          clientes={clientesFiltrados}
          isLoading={isLoading}
          selectedIds={selectedClientIds}
          onToggleSelection={handleToggleClientSelection}
          onToggleAll={handleToggleAllClients}
          onClientClick={handleClientClick}
          onBlockClient={handleBlockClient}
          hasActiveFilters={hasActiveFilters}
        />

        <ClientsPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <ClientsBulkActions
        selectedCount={selectedClientIds.length}
        onClear={() => setSelectedClientIds([])}
        onCreateCampaign={handleCreateCampaignWithSelected}
      />

      {/* Modals */}
      <ClientDrawer
        clientId={selectedClientId}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />

      <ManageFiltersModal
        open={manageFiltersOpen}
        onOpenChange={setManageFiltersOpen}
        onEdit={handleEditFilter}
      />

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

      <SaveFilterDialog
        open={saveFilterDialogOpen}
        onOpenChange={setSaveFilterDialogOpen}
        filterName={filterName}
        onFilterNameChange={setFilterName}
        filterDescription={filterDescription}
        onFilterDescriptionChange={setFilterDescription}
        onSave={handleConfirmSaveFilter}
        isUpdate={!!selectedSegmentId}
        isPending={createSegment.isPending || updateSegment.isPending}
      />
    </div>
  );
}
