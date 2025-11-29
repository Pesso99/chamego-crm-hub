import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Edit } from 'lucide-react';
import { FilterCategory } from './FilterCategory';
import { FilterPreview } from './FilterPreview';
import { CreateTagModal } from './CreateTagModal';
import { useCustomTags } from '@/hooks/useCustomTags';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useFilterPreview } from '@/hooks/useFilterPreview';
import { 
  FILTER_CATEGORIES, 
  SelectedFilters,
  SelectedFilter 
} from '@/lib/crm/filter-definitions';
import { buildQueryFromSelectedFilters } from '@/lib/crm/filter-query-builder';
import { FilterGroup } from '@/types/crm.types';
import { cn } from '@/lib/utils';

interface IntelligentFiltersPanelProps {
  selectedFilters: SelectedFilters;
  onSelectedFiltersChange: (filters: SelectedFilters) => void;
  selectedTags: string[];
  onSelectedTagsChange: (tags: string[]) => void;
  onFiltersChange?: (filterGroup: FilterGroup | null) => void;
  onPreviewCount?: (count: number | null) => void;
}

export function IntelligentFiltersPanel({
  selectedFilters,
  onSelectedFiltersChange,
  selectedTags,
  onSelectedTagsChange,
  onFiltersChange,
  onPreviewCount,
}: IntelligentFiltersPanelProps) {
  const [createTagOpen, setCreateTagOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<{ id: string; name: string; color?: string } | null>(null);
  const { data: customTags } = useCustomTags();

  const handleEditTag = (tag: { id: string; name: string; color?: string }) => {
    setEditingTag(tag);
    setCreateTagOpen(true);
  };

  const handleCloseTagModal = () => {
    setCreateTagOpen(false);
    setEditingTag(null);
  };

  // Build filter group from selected filters
  const filterGroup = buildQueryFromSelectedFilters(selectedFilters, selectedTags);
  
  // Get preview count
  const { data: previewCount, isLoading: isLoadingPreview } = useFilterPreview(
    filterGroup,
    selectedTags
  );

  // Notify parent of filter changes
  useEffect(() => {
    onFiltersChange?.(filterGroup);
  }, [filterGroup, onFiltersChange]);

  // Notify parent of preview count
  useEffect(() => {
    if (previewCount !== undefined) {
      onPreviewCount?.(previewCount);
    }
  }, [previewCount, onPreviewCount]);

  const handleToggleFilter = (categoryId: string, filterId: string) => {
    const existingIndex = selectedFilters.findIndex(
      sf => sf.categoryId === categoryId && sf.filterId === filterId
    );

    if (existingIndex >= 0) {
      // Remove filter
      const newFilters = [...selectedFilters];
      newFilters.splice(existingIndex, 1);
      onSelectedFiltersChange(newFilters);
    } else {
      // Add filter
      const category = FILTER_CATEGORIES.find(c => c.id === categoryId);
      const filter = category?.filters.find(f => f.id === filterId);
      
      if (filter) {
        const newFilter: SelectedFilter = {
          categoryId,
          filterId,
          filter
        };
        onSelectedFiltersChange([...selectedFilters, newFilter]);
      }
    }
  };

  const handleToggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onSelectedTagsChange(selectedTags.filter(t => t !== tagId));
    } else {
      onSelectedTagsChange([...selectedTags, tagId]);
    }
  };

  const handleClearAll = () => {
    onSelectedFiltersChange([]);
    onSelectedTagsChange([]);
  };

  const hasActiveFilters = selectedFilters.length > 0 || selectedTags.length > 0;

  return (
    <>
      <div className="space-y-6 p-4">
          {FILTER_CATEGORIES.map(category => (
            <FilterCategory
              key={category.id}
              category={category}
              selectedFilters={selectedFilters}
              onToggleFilter={handleToggleFilter}
            />
          ))}

          <Separator />

          {/* Custom Tags Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">
                🏷️ Tags Customizadas
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCreateTagOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {customTags && customTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {customTags.map(tag => {
                  const isSelected = selectedTags.includes(tag.id);
                  
                  return (
                    <ContextMenu key={tag.id}>
                      <ContextMenuTrigger>
                        <Badge
                          variant={isSelected ? 'default' : 'outline'}
                          className={cn(
                            "cursor-pointer transition-all hover:scale-105 select-none",
                            isSelected && "shadow-md ring-2 ring-primary/20"
                          )}
                          style={
                            isSelected && tag.color
                              ? {
                                  backgroundColor: tag.color,
                                  borderColor: tag.color,
                                  color: 'white'
                                }
                              : {}
                          }
                          onClick={() => handleToggleTag(tag.id)}
                        >
                          {tag.name}
                        </Badge>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem onClick={() => handleEditTag(tag)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar Tag
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma tag customizada criada ainda
              </p>
            )}
          </div>

          <Separator />

          {/* Preview */}
          <FilterPreview count={previewCount} isLoading={isLoadingPreview} />

          {/* Clear All Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleClearAll}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Limpar Tudo
            </Button>
          )}
      </div>

      <CreateTagModal
        open={createTagOpen} 
        onOpenChange={handleCloseTagModal}
        editingTag={editingTag}
      />
    </>
  );
}
