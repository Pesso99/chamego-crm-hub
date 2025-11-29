import { Button } from '@/components/ui/button';

interface ClientsPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ClientsPagination({
  page,
  totalPages,
  onPageChange,
}: ClientsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(0, page - 1))}
        disabled={page === 0}
      >
        Anterior
      </Button>
      <span className="text-sm text-muted-foreground">
        Página {page + 1} de {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
        disabled={page >= totalPages - 1}
      >
        Próxima
      </Button>
    </div>
  );
}
