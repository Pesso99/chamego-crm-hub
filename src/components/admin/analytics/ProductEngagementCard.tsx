import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Clock } from "lucide-react";
import { useProductEngagement } from "@/hooks/useAdvancedAnalytics";

interface ProductEngagementCardProps {
  days: number;
}

export function ProductEngagementCard({ days }: ProductEngagementCardProps) {
  const { data, isLoading } = useProductEngagement(days);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engajamento com Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engajamento com Produtos</CardTitle>
          <CardDescription>Nenhum dado disponível</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🛍️ Engajamento com Produtos</CardTitle>
        <CardDescription>Produtos mais visualizados e tempo médio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((product, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/70 transition-colors">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                  {idx + 1}
                </span>
                <span className="font-medium text-foreground">{product.productName}</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>{product.views}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{Math.floor(product.avgDuration / 60)}m {product.avgDuration % 60}s</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
