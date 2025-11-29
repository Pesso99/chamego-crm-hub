import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCustomTags, useAddTagToClient } from '@/hooks/useCustomTags';
import { Plus } from 'lucide-react';

interface AddTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  existingTagIds: string[];
}

export function AddTagDialog({
  open,
  onOpenChange,
  clientId,
  existingTagIds,
}: AddTagDialogProps) {
  const { data: allTags } = useCustomTags();
  const addTag = useAddTagToClient();
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

  const availableTags = allTags?.filter(
    (tag) => !existingTagIds.includes(tag.id)
  );

  const handleAdd = async () => {
    if (!selectedTagId) return;

    await addTag.mutateAsync({ userId: clientId, tagId: selectedTagId });
    setSelectedTagId(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Tag ao Cliente</DialogTitle>
          <DialogDescription>
            Selecione uma tag customizada para adicionar a este cliente
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {availableTags && availableTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTagId === tag.id ? 'default' : 'outline'}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  style={
                    selectedTagId === tag.id
                      ? { backgroundColor: tag.color, borderColor: tag.color }
                      : {}
                  }
                  onClick={() => setSelectedTagId(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhuma tag disponível para adicionar</p>
              <p className="text-sm mt-2">
                Crie novas tags na tela de clientes
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!selectedTagId || addTag.isPending}
          >
            <Plus className="mr-2 h-4 w-4" />
            {addTag.isPending ? 'Adicionando...' : 'Adicionar Tag'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
