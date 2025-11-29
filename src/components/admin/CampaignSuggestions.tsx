import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCampaignSuggestions } from '@/hooks/useCampaignSuggestions';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { CreateCampaignDialog } from './campaign-wizard/CreateCampaignDialog';

export function CampaignSuggestions() {
  const { data: suggestions, isLoading } = useCampaignSuggestions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);

  const handleCreateCampaign = (suggestion: any) => {
    setSelectedSuggestion(suggestion);
    setDialogOpen(true);
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

        {suggestions.map((suggestion) => (
          <Card key={suggestion.id} className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{suggestion.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                    <CardDescription>{suggestion.description}</CardDescription>
                  </div>
                </div>
                <Badge variant={
                  suggestion.priority === 'high' ? 'destructive' :
                  suggestion.priority === 'medium' ? 'default' : 'secondary'
                }>
                  {suggestion.priority === 'high' ? 'Alta' :
                   suggestion.priority === 'medium' ? 'Média' : 'Baixa'} Prioridade
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {suggestion.suggestedTemplate && (
                    <span>Template sugerido: <strong>{suggestion.suggestedTemplate}</strong></span>
                  )}
                </div>
                <Button onClick={() => handleCreateCampaign(suggestion)}>
                  Criar Campanha ({suggestion.targetCount})
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateCampaignDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        suggestion={selectedSuggestion}
      />
    </>
  );
}
