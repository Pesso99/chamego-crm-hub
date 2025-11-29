import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { useClientTags, useRemoveTagFromClient } from '@/hooks/useCustomTags';
import { AddTagDialog } from './AddTagDialog';

interface ClientCustomTagsProps {
  clientId: string;
}

export function ClientCustomTags({ clientId }: ClientCustomTagsProps) {
  const [addTagOpen, setAddTagOpen] = useState(false);
  const { data: clientTags } = useClientTags(clientId);
  const removeTag = useRemoveTagFromClient();

  const handleRemove = async (tagId: string) => {
    if (confirm('Remover esta tag do cliente?')) {
      await removeTag.mutateAsync({ userId: clientId, tagId });
    }
  };

  const existingTagIds = clientTags?.map((ct) => ct.tag_id) || [];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tags Customizadas</CardTitle>
              <CardDescription>
                Tags manuais aplicadas a este cliente
              </CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => setAddTagOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Tag
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {clientTags && clientTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {clientTags.map((ct) => (
                <Badge
                  key={ct.id}
                  variant="outline"
                  className="relative group pr-8"
                  style={{ borderColor: ct.custom_tags?.color }}
                >
                  {ct.custom_tags?.name}
                  <button
                    className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemove(ct.tag_id)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma tag customizada aplicada
            </p>
          )}
        </CardContent>
      </Card>

      <AddTagDialog
        open={addTagOpen}
        onOpenChange={setAddTagOpen}
        clientId={clientId}
        existingTagIds={existingTagIds}
      />
    </>
  );
}
