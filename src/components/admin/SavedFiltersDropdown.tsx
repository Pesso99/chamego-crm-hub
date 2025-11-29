import { FolderOpen, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useSegments } from '@/hooks/useSegments';
import { Segment } from '@/types/crm.types';

interface SavedFiltersDropdownProps {
  onLoad: (segment: Segment) => void;
  onManage: () => void;
}

export function SavedFiltersDropdown({ onLoad, onManage }: SavedFiltersDropdownProps) {
  const { data: segments, isLoading } = useSegments();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <FolderOpen className="mr-2 h-4 w-4" />
          Filtros Salvos
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {isLoading ? (
          <DropdownMenuItem disabled>
            <div className="flex items-center">
              <span className="animate-pulse">Carregando...</span>
            </div>
          </DropdownMenuItem>
        ) : segments && segments.length > 0 ? (
          <>
            {segments.map((segment) => (
              <DropdownMenuItem
                key={segment.id}
                onClick={() => onLoad(segment)}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{segment.name}</span>
                  {segment.customer_count !== undefined && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {segment.customer_count}
                    </Badge>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onManage} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Gerenciar Filtros
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem disabled>Nenhum filtro salvo</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
