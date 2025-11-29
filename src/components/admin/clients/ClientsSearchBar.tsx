import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SavedFiltersDropdown } from '@/components/admin/SavedFiltersDropdown';
import { Segment } from '@/types/crm.types';

interface ClientsSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onLoadFilter: (segment: Segment) => void;
  onManageFilters: () => void;
  displayedCount: number;
  hasActiveFilters: boolean;
  showBlocked: boolean;
  onToggleBlocked: () => void;
  blockedCount: number;
  onClearFilters: () => void;
}

export function ClientsSearchBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onLoadFilter,
  onManageFilters,
  displayedCount,
  hasActiveFilters,
  showBlocked,
  onToggleBlocked,
  blockedCount,
  onClearFilters,
}: ClientsSearchBarProps) {
  return (
    <div className="space-y-4">
      {/* Search Bar + Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="🔍 Buscar por nome, e-mail..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1"
        />

        <Select value={status} onValueChange={onStatusChange}>
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
          onLoad={onLoadFilter}
          onManage={onManageFilters}
        />
      </div>

      {/* Preview Count + Actions */}
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
            onClick={onToggleBlocked}
          >
            {showBlocked ? '🙈 Ocultar' : '👁️ Mostrar'} Bloqueados
          </Button>
          
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Limpar Filtros
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
