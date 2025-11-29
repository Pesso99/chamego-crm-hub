import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSegments, useUpdateSegment } from '@/hooks/useSegments';
import { Pencil, Copy, Trash, Users } from 'lucide-react';
import { Segment } from '@/types/crm.types';
import { toast } from 'sonner';

interface ManageFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (segment: Segment) => void;
}

export function ManageFiltersModal({
  open,
  onOpenChange,
  onEdit,
}: ManageFiltersModalProps) {
  const { data: segments } = useSegments();
  const updateSegment = useUpdateSegment();

  const handleArchive = async (segmentId: string) => {
    if (confirm('Tem certeza que deseja arquivar este filtro?')) {
      await updateSegment.mutateAsync({
        id: segmentId,
        is_active: false,
      });
    }
  };

  const handleDuplicate = (segment: Segment) => {
    toast.info('Funcionalidade de duplicar em breve!');
    // TODO: Implement duplicate functionality
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Filtros Salvos</DialogTitle>
          <DialogDescription>
            Edite, duplique ou remova seus filtros salvos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {segments && segments.length > 0 ? (
            segments.map((segment) => (
              <Card key={segment.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{segment.name}</h4>
                    {segment.description && (
                      <p className="text-sm text-muted-foreground truncate">
                        {segment.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Users className="mr-1 h-3 w-3" />
                        {segment.customer_count || 0} clientes
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        onEdit(segment);
                        onOpenChange(false);
                      }}
                      title="Editar filtro"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDuplicate(segment)}
                      title="Duplicar filtro"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleArchive(segment.id)}
                      title="Arquivar filtro"
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum filtro salvo ainda</p>
              <p className="text-sm mt-2">
                Crie filtros na tela de clientes e salve-os para reutilização
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
