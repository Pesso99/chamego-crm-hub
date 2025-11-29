import { useQuery } from '@tanstack/react-query';
import { FilterGroup } from '@/types/crm.types';
import { previewSegment } from '@/lib/crm/filters';
import { useDebounce } from './useDebounce';

export function useFilterPreview(
  filterGroup: FilterGroup | null,
  customTags: string[]
) {
  const debouncedFilters = useDebounce(filterGroup, 500);
  const debouncedTags = useDebounce(customTags, 500);

  return useQuery({
    queryKey: ['filter-preview', debouncedFilters, debouncedTags],
    queryFn: async () => {
      // If no filters, return total count
      if (!debouncedFilters && debouncedTags.length === 0) {
        return await previewSegment({ operator: 'AND', conditions: [] });
      }
      
      // Preview with current filters
      return await previewSegment(
        debouncedFilters || { operator: 'AND', conditions: [] }
      );
    },
    staleTime: 30000, // 30 seconds
  });
}
