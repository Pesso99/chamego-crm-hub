import { Users, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterPreviewProps {
  count: number | null | undefined;
  isLoading: boolean;
  className?: string;
}

export function FilterPreview({ count, isLoading, className }: FilterPreviewProps) {
  return (
    <div className={cn(
      "p-3 bg-primary/10 border border-primary/20 rounded-lg",
      className
    )}>
      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-primary">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Calculando...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {count ?? 0} cliente{(count ?? 0) !== 1 ? 's' : ''} correspondem
          </span>
        </div>
      )}
    </div>
  );
}
