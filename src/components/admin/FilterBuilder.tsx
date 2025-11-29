import { useState, useEffect } from 'react';
import { FilterGroup, FilterCondition, FILTER_FIELDS } from '@/types/crm.types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Plus, Users } from 'lucide-react';
import { previewSegment } from '@/lib/crm/filters';
import { useDebounce } from '@/hooks/useDebounce';
import { useCustomTags } from '@/hooks/useCustomTags';

interface FilterBuilderProps {
  initialFilters?: FilterGroup;
  onFiltersChange: (filters: FilterGroup) => void;
  onPreviewCount?: (count: number) => void;
  selectedTags?: string[];
  onTagsChange?: (tags: string[]) => void;
}

export function FilterBuilder({ 
  initialFilters, 
  onFiltersChange,
  onPreviewCount,
  selectedTags = [],
  onTagsChange,
}: FilterBuilderProps) {
  const [filters, setFilters] = useState<FilterGroup>(
    initialFilters || {
      operator: 'AND',
      conditions: [],
    }
  );
  
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const { data: customTags } = useCustomTags();
  
  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    const loadPreview = async () => {
      if (filters.conditions.length === 0) {
        setPreviewCount(null);
        return;
      }
      
      setIsLoadingPreview(true);
      try {
        const count = await previewSegment(filters);
        setPreviewCount(count);
        if (onPreviewCount) onPreviewCount(count);
      } catch (error) {
        console.error('Error previewing segment:', error);
        setPreviewCount(null);
      } finally {
        setIsLoadingPreview(false);
      }
    };
    
    loadPreview();
  }, [debouncedFilters]);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const addCondition = () => {
    const newCondition: FilterCondition = {
      field: 'dias_sem_comprar',
      operator: '>',
      value: '30',
    };
    
    setFilters({
      ...filters,
      conditions: [...filters.conditions, newCondition],
    });
  };

  const removeCondition = (index: number) => {
    setFilters({
      ...filters,
      conditions: filters.conditions.filter((_, i) => i !== index),
    });
  };

  const updateCondition = (index: number, updates: Partial<FilterCondition>) => {
    setFilters({
      ...filters,
      conditions: filters.conditions.map((cond, i) => {
        if (i !== index) return cond;
        if ('field' in cond) {
          return { ...cond, ...updates } as FilterCondition;
        }
        return cond;
      }),
    });
  };

  const toggleOperator = () => {
    setFilters({
      ...filters,
      operator: filters.operator === 'AND' ? 'OR' : 'AND',
    });
  };

  const toggleTag = (tagId: string) => {
    if (!onTagsChange) return;
    
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter((t) => t !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const getOperatorsForField = (fieldId: string) => {
    const field = FILTER_FIELDS.find((f) => f.id === fieldId);
    if (!field) return ['='];
    
    switch (field.type) {
      case 'number':
        return ['=', '>', '<', '>=', '<=', '!='];
      case 'text':
        return ['=', '!=', 'CONTAINS', 'STARTS_WITH'];
      case 'array':
        return ['CONTAINS', 'NOT_CONTAINS'];
      case 'boolean':
        return ['='];
      case 'date':
        return ['>', '<', 'BETWEEN', 'LAST_X_DAYS'];
      default:
        return ['='];
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Construtor de Filtros</span>
          {filters.conditions.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleOperator}
              className="text-xs"
            >
              Operador: {filters.operator}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {filters.conditions.map((condition, index) => {
          if (!('field' in condition)) return null;
          
          return (
            <div key={index} className="flex gap-2 items-start p-4 border rounded-lg bg-muted/20">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <Select
                  value={condition.field}
                  onValueChange={(value) => updateCondition(index, { field: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Campo" />
                  </SelectTrigger>
                  <SelectContent>
                    {FILTER_FIELDS.map((field) => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={condition.operator}
                  onValueChange={(value) => updateCondition(index, { operator: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Operador" />
                  </SelectTrigger>
                  <SelectContent>
                    {getOperatorsForField(condition.field).map((op) => (
                      <SelectItem key={op} value={op}>
                        {op}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  value={String(condition.value)}
                  onChange={(e) => updateCondition(index, { value: e.target.value })}
                  placeholder="Valor"
                />
              </div>
            
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCondition(index)}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}

        <Button
          variant="outline"
          onClick={addCondition}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Condição {filters.conditions.length > 0 && filters.operator}
        </Button>

        {/* Tags Filter Section */}
        {onTagsChange && customTags && customTags.length > 0 && (
          <>
            <Separator className="my-4" />
            
            <div>
              <h4 className="text-sm font-medium mb-3">Filtrar por Tags Customizadas</h4>
              <div className="flex flex-wrap gap-2">
                {customTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                    className="cursor-pointer hover:scale-105 transition-transform"
                    style={
                      selectedTags.includes(tag.id)
                        ? { backgroundColor: tag.color, borderColor: tag.color }
                        : {}
                    }
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selecionada{selectedTags.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </>
        )}

        {/* Preview Count */}
        {isLoadingPreview && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Calculando preview...
          </div>
        )}

        {previewCount !== null && !isLoadingPreview && (
          <div className="flex items-center gap-2 p-3 bg-status-info/10 border border-status-info/20 rounded-lg mt-4">
            <Users className="h-4 w-4 text-status-info" />
            <span className="text-sm text-status-info font-medium">
              {previewCount} cliente{previewCount !== 1 ? 's' : ''} corresponde
              {previewCount !== 1 ? 'm' : ''} aos filtros
              {selectedTags.length > 0 && ` (com ${selectedTags.length} tag${selectedTags.length !== 1 ? 's' : ''})`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
