import { Badge } from '@/components/ui/badge';
import { FilterCategoryDefinition, SelectedFilters } from '@/lib/crm/filter-definitions';
import { cn } from '@/lib/utils';

interface FilterCategoryProps {
  category: FilterCategoryDefinition;
  selectedFilters: SelectedFilters;
  onToggleFilter: (categoryId: string, filterId: string) => void;
}

export function FilterCategory({
  category,
  selectedFilters,
  onToggleFilter,
}: FilterCategoryProps) {
  const isFilterSelected = (filterId: string) => {
    return selectedFilters.some(
      sf => sf.categoryId === category.id && sf.filterId === filterId
    );
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground">
        {category.label}
      </h4>
      
      <div className="flex flex-wrap gap-2">
        {category.filters.map(filter => {
          const isSelected = isFilterSelected(filter.id);
          
          return (
            <Badge
              key={filter.id}
              variant={isSelected ? 'default' : 'outline'}
              className={cn(
                "cursor-pointer transition-all hover:scale-105 select-none",
                isSelected && "shadow-md ring-2 ring-primary/20"
              )}
              onClick={() => onToggleFilter(category.id, filter.id)}
            >
              {filter.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
