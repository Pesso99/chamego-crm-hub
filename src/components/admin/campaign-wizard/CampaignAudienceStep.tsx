import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IntelligentFiltersPanel } from '../IntelligentFiltersPanel';
import { useSegmentClients } from '@/hooks/useSegmentClients';
import { useEffect } from 'react';
import { Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { buildQueryFromSelectedFilters } from '@/lib/crm/filter-query-builder';

interface CampaignAudienceStepProps {
  flow: any;
}

export function CampaignAudienceStep({ flow }: CampaignAudienceStepProps) {
  const { data, updateData, nextStep } = flow;

  const hasPreselectedClients = data.selectedClients && data.selectedClients.length > 0;

  // Construir FilterGroup a partir dos filtros selecionados
  const filterGroup = buildQueryFromSelectedFilters(
    data.selectedFilters,
    data.selectedTags
  );

  // Atualizar data.filters quando filterGroup muda
  useEffect(() => {
    if (filterGroup) {
      updateData({ filters: filterGroup });
    }
  }, [filterGroup]);

  const { data: clients, isLoading } = useSegmentClients(
    data.filters,
    !hasPreselectedClients && data.filters.conditions.length > 0
  );

  useEffect(() => {
    if (clients && !hasPreselectedClients && !data.isManualSelection) {
      updateData({
        selectedClients: clients,
        audienceCount: clients.length,
      });
    }
  }, [clients, hasPreselectedClients, data.isManualSelection]);

  const canProceed = data.name && data.audienceCount > 0;

  return (
    <div className="space-y-6">
      {/* Campaign Name */}
      <div className="space-y-2">
        <Label htmlFor="campaign-name">Nome da Campanha</Label>
        <Input
          id="campaign-name"
          placeholder="Ex: Recuperação de Clientes Inativos"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
        />
      </div>

      {hasPreselectedClients ? (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-primary">
                  {data.audienceCount} cliente{data.audienceCount !== 1 ? 's' : ''} selecionado{data.audienceCount !== 1 ? 's' : ''} manualmente
                </p>
                <p className="text-sm text-muted-foreground">
                  Clientes escolhidos diretamente da lista
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateData({ 
                selectedClients: [], 
                audienceCount: 0,
                isManualSelection: false
              })}
            >
              Limpar Seleção e Usar Filtros
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Filters */}
          <div className="space-y-2">
            <Label>Filtros de Audiência</Label>
            <IntelligentFiltersPanel
              selectedFilters={data.selectedFilters || []}
              onSelectedFiltersChange={(filters) => 
                updateData({ selectedFilters: filters })
              }
              selectedTags={data.selectedTags || []}
              onSelectedTagsChange={(tags) => 
                updateData({ selectedTags: tags })
              }
              onPreviewCount={(count) => {
                // Só atualizar audienceCount se NÃO for seleção manual
                if (!data.isManualSelection) {
                  updateData({ audienceCount: count });
                }
              }}
            />
          </div>

          {/* Audience Count */}
          {data.audienceCount > 0 && (
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-primary">
                    {data.audienceCount} cliente{data.audienceCount !== 1 ? 's' : ''} selecionado{data.audienceCount !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Todos aceitam receber comunicações de marketing
                  </p>
                </div>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button
          onClick={nextStep}
          disabled={!canProceed || isLoading}
        >
          Próximo: Escolher Template
        </Button>
      </div>
    </div>
  );
}
