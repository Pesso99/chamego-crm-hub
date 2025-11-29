import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  useCreateCustomTag, 
  useUpdateCustomTag, 
  useDeleteCustomTag 
} from '@/hooks/useCustomTags';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CustomTag {
  id: string;
  name: string;
  color?: string;
}

interface CreateTagModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTag?: CustomTag | null;
}

const PRESET_COLORS = [
  '#A96418', // Primary gold
  '#EF4444', // Red
  '#10B981', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#06B6D4', // Cyan
];

export function CreateTagModal({ open, onOpenChange, editingTag }: CreateTagModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const createTag = useCreateCustomTag();
  const updateTag = useUpdateCustomTag();
  const deleteTag = useDeleteCustomTag();

  const isEditing = !!editingTag;

  useEffect(() => {
    if (editingTag) {
      setName(editingTag.name);
      setColor(editingTag.color || PRESET_COLORS[0]);
    } else {
      setName('');
      setColor(PRESET_COLORS[0]);
    }
  }, [editingTag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing && editingTag) {
      await updateTag.mutateAsync({
        id: editingTag.id,
        name: name.trim(),
        color,
      });
    } else {
      await createTag.mutateAsync({ name: name.trim(), color });
    }
    
    setName('');
    setColor(PRESET_COLORS[0]);
    onOpenChange(false);
  };

  const handleDelete = async () => {
    if (!editingTag) return;
    
    await deleteTag.mutateAsync(editingTag.id);
    setShowDeleteDialog(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Tag' : 'Criar Nova Tag Customizada'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite o nome e a cor da tag customizada' 
              : 'Crie tags personalizadas para organizar e filtrar seus clientes'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tag-name">Nome da Tag</Label>
              <Input
                id="tag-name"
                placeholder="Ex: Cliente Especial, Corporativo, etc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label>Cor da Tag</Label>
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map((presetColor) => (
                  <button
                    key={presetColor}
                    type="button"
                    className={`w-10 h-10 rounded-md border-2 transition-all ${
                      color === presetColor
                        ? 'border-primary scale-110'
                        : 'border-border hover:scale-105'
                    }`}
                    style={{ backgroundColor: presetColor }}
                    onClick={() => setColor(presetColor)}
                    title={presetColor}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="mr-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={!name.trim() || createTag.isPending || updateTag.isPending}
              >
                {createTag.isPending || updateTag.isPending 
                  ? 'Salvando...' 
                  : isEditing ? 'Salvar' : 'Criar Tag'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a tag "{editingTag?.name}"? 
              Esta tag será removida de todos os clientes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
