import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCampaignSuggestions } from '@/hooks/useCampaignSuggestions';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { CreateCampaignDialog } from './campaign-wizard/CreateCampaignDialog';
import { ClientsPreviewList } from './ClientsPreviewList';
import { ClientsListDrawer } from './ClientsListDrawer';
import { useSuggestionClients } from '@/hooks/useSuggestionClients';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function CampaignSuggestions() {
  const { data: suggestions, isLoading } = useCampaignSuggestions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSuggestion, setDrawerSuggestion] = useState<any>(null);

  const handleCreateCampaign = (suggestion: any) => {
    setSelectedSuggestion(suggestion);
    setDialogOpen(true);
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleViewAll = (suggestion: any) => {
    setDrawerSuggestion(suggestion);
    setDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Sugestões de Campanhas</h2>
        </div>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Sugestões de Campanhas</h2>
        </div>

        {suggestions.map((suggestion) => {
          const isExpanded = expandedIds.has(suggestion.id);
          
          return (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              isExpanded={isExpanded}
              onToggleExpanded={toggleExpanded}
              onCreateCampaign={handleCreateCampaign}
              onViewAll={handleViewAll}
            />
          );
        })}
      </div>

      <CreateCampaignDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        suggestion={selectedSuggestion}
      />

      {drawerSuggestion && (
        <ClientsListDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          clients={[]} // Will be populated by the hook in SuggestionCard
          title={`Clientes: ${drawerSuggestion.title}`}
          description={drawerSuggestion.description}
          onCreateCampaign={() => handleCreateCampaign(drawerSuggestion)}
        />
      )}
    </>
  );
}

// Separate component for each suggestion card with its own data fetching
function SuggestionCard({
  suggestion,
  isExpanded,
  onToggleExpanded,
  onCreateCampaign,
  onViewAll,
}: {
  suggestion: any;
  isExpanded: boolean;
  onToggleExpanded: (id: string) => void;
  onCreateCampaign: (suggestion: any) => void;
  onViewAll: (suggestion: any) => void;
}) {
  const { data: clients, isLoading } = useSuggestionClients(
    suggestion.segmentFilters,
    isExpanded // Only fetch when expanded
  );

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{suggestion.icon}</span>
            <div>
              <CardTitle className="text-lg">{suggestion.title}</CardTitle>
              <CardDescription>{suggestion.description}</CardDescription>
            </div>
          </div>
          <Badge
            variant={
              suggestion.priority === 'high'
                ? 'destructive'
                : suggestion.priority === 'medium'
                ? 'default'
                : 'secondary'
            }
          >
            {suggestion.priority === 'high'
              ? 'Alta'
              : suggestion.priority === 'medium'
              ? 'Média'
              : 'Baixa'}{' '}
            Prioridade
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {suggestion.suggestedTemplate && (
              <span>
                Template sugerido: <strong>{suggestion.suggestedTemplate}</strong>
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleExpanded(suggestion.id)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Clientes
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </Button>
            <Button onClick={() => onCreateCampaign(suggestion)}>
              <Sparkles className="h-4 w-4 mr-2" />
              Criar Campanha ({suggestion.targetCount})
            </Button>
          </div>
        </div>

        <Collapsible open={isExpanded}>
          <CollapsibleContent className="pt-4 border-t">
            <div className="mb-2">
              <h4 className="text-sm font-medium">Clientes neste segmento</h4>
            </div>
            <ClientsPreviewList
              clients={clients || []}
              isLoading={isLoading}
              maxVisible={5}
              showViewAll={true}
              onViewAll={() => onViewAll(suggestion)}
            />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
