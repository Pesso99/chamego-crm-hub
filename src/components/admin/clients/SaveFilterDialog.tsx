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
import { Textarea } from '@/components/ui/textarea';

interface SaveFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filterName: string;
  onFilterNameChange: (name: string) => void;
  filterDescription: string;
  onFilterDescriptionChange: (description: string) => void;
  onSave: () => void;
  isUpdate: boolean;
  isPending: boolean;
}

export function SaveFilterDialog({
  open,
  onOpenChange,
  filterName,
  onFilterNameChange,
  filterDescription,
  onFilterDescriptionChange,
  onSave,
  isUpdate,
  isPending,
}: SaveFilterDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? 'Atualizar Filtro' : 'Salvar Filtro'}
          </DialogTitle>
          <DialogDescription>
            {isUpdate
              ? 'Atualize as informações do filtro salvo'
              : 'Salve este conjunto de filtros para reutilização'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="filter-name">Nome do Filtro</Label>
            <Input
              id="filter-name"
              placeholder="Ex: Clientes VIP Inativos"
              value={filterName}
              onChange={(e) => onFilterNameChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-description">Descrição (opcional)</Label>
            <Textarea
              id="filter-description"
              placeholder="Descreva o objetivo deste filtro..."
              value={filterDescription}
              onChange={(e) => onFilterDescriptionChange(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={isPending}>
            {isUpdate ? 'Atualizar' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
