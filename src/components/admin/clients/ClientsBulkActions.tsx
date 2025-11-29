import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail } from 'lucide-react';

interface ClientsBulkActionsProps {
  selectedCount: number;
  onClear: () => void;
  onCreateCampaign: () => void;
}

export function ClientsBulkActions({
  selectedCount,
  onClear,
  onCreateCampaign,
}: ClientsBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <Card className="shadow-lg border-2 border-primary">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-lg px-3 py-1">
              {selectedCount}
            </Badge>
            <span className="font-medium">
              cliente{selectedCount !== 1 ? 's' : ''} selecionado{selectedCount !== 1 ? 's' : ''}
            </span>
          </div>
          
          <Separator orientation="vertical" className="h-8" />
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClear}>
              Limpar Seleção
            </Button>
            <Button onClick={onCreateCampaign}>
              <Mail className="mr-2 h-4 w-4" />
              Enviar Comunicação
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
