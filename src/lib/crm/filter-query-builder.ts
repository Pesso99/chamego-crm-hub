import { FilterGroup, FilterCondition } from '@/types/crm.types';
import { SelectedFilters, FILTER_CATEGORIES } from './filter-definitions';

function convertFilterToCondition(selectedFilter: SelectedFilters[0]): FilterCondition {
  const { filter } = selectedFilter;
  
  // If it has sqlCondition, we'll need to handle it differently
  // For now, convert simple field-based filters
  if (filter.field && filter.operator && filter.value !== undefined) {
    return {
      field: filter.field,
      operator: filter.operator,
      value: filter.value
    };
  }
  
  // For complex SQL conditions, we need a different approach
  // We'll store it as a special marker that will be handled by the query builder
  return {
    field: '__custom__',
    operator: '=',
    value: filter.sqlCondition || filter.id
  };
}

export function buildQueryFromSelectedFilters(
  selectedFilters: SelectedFilters,
  customTags: string[]
): FilterGroup | null {
  if (selectedFilters.length === 0 && customTags.length === 0) {
    return null;
  }

  // Group filters by category
  const groupedByCategory = selectedFilters.reduce((acc, filter) => {
    if (!acc[filter.categoryId]) {
      acc[filter.categoryId] = [];
    }
    acc[filter.categoryId].push(filter);
    return acc;
  }, {} as Record<string, SelectedFilters>);

  const categoryConditions: Array<FilterCondition | FilterGroup> = [];

  // Build conditions for each category
  Object.entries(groupedByCategory).forEach(([categoryId, filters]) => {
    const category = FILTER_CATEGORIES.find(c => c.id === categoryId);
    const operator = category?.logicOperator || 'OR';

    if (filters.length === 1) {
      // Single filter in category
      categoryConditions.push(convertFilterToCondition(filters[0]));
    } else {
      // Multiple filters in same category - use category's logic operator
      categoryConditions.push({
        operator,
        conditions: filters.map(convertFilterToCondition)
      });
    }
  });

  // Add custom tags as a separate OR group
  if (customTags.length > 0) {
    categoryConditions.push({
      operator: 'OR',
      conditions: customTags.map(tagId => ({
        field: '__tag__',
        operator: '=',
        value: tagId
      }))
    });
  }

  // If only one condition, return it directly
  if (categoryConditions.length === 1) {
    const singleCondition = categoryConditions[0];
    if ('field' in singleCondition) {
      return {
        operator: 'AND',
        conditions: [singleCondition]
      };
    }
    return singleCondition as FilterGroup;
  }

  // Multiple categories - combine with AND
  return {
    operator: 'AND',
    conditions: categoryConditions
  };
}

export function getFilterSummary(selectedFilters: SelectedFilters, customTags: string[]): string {
  const parts: string[] = [];

  const groupedByCategory = selectedFilters.reduce((acc, filter) => {
    if (!acc[filter.categoryId]) {
      acc[filter.categoryId] = [];
    }
    acc[filter.categoryId].push(filter);
    return acc;
  }, {} as Record<string, SelectedFilters>);

  Object.entries(groupedByCategory).forEach(([categoryId, filters]) => {
    const category = FILTER_CATEGORIES.find(c => c.id === categoryId);
    const labels = filters.map(f => f.filter.label);
    parts.push(`${category?.label}: ${labels.join(', ')}`);
  });

  if (customTags.length > 0) {
    parts.push(`Tags: ${customTags.length} selecionadas`);
  }

  return parts.join(' • ');
}
