import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IntelligentFiltersPanel } from '@/components/admin/IntelligentFiltersPanel';
import { SelectedFilters } from '@/lib/crm/filter-definitions';
import { FilterGroup } from '@/types/crm.types';
import { MoreVertical, Save, Settings } from 'lucide-react';

interface ClientsFiltersCardProps {
  selectedFilters: SelectedFilters;
  onSelectedFiltersChange: (filters: SelectedFilters) => void;
  selectedTags: string[];
  onSelectedTagsChange: (tags: string[]) => void;
  onFiltersChange: (filters: FilterGroup | null) => void;
  onPreviewCount: (count: number | null) => void;
  hasActiveFilters: boolean;
  onSave: () => void;
  onManage: () => void;
  selectedSegmentId?: string | null;
}

export function ClientsFiltersCard({
  selectedFilters,
  onSelectedFiltersChange,
  selectedTags,
  onSelectedTagsChange,
  onFiltersChange,
  onPreviewCount,
  hasActiveFilters,
  onSave,
  onManage,
  selectedSegmentId,
}: ClientsFiltersCardProps) {
  return (
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
                  <DropdownMenuItem onClick={onSave}>
                    <Save className="mr-2 h-4 w-4" />
                    {selectedSegmentId ? 'Atualizar' : 'Salvar'} Filtros
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={onManage}>
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
          onSelectedFiltersChange={onSelectedFiltersChange}
          selectedTags={selectedTags}
          onSelectedTagsChange={onSelectedTagsChange}
          onFiltersChange={onFiltersChange}
          onPreviewCount={onPreviewCount}
        />
      </CardContent>
    </Card>
  );
}
