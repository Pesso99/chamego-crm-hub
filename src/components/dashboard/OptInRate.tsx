import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface OptInRateProps {
  rate?: number;
}

export function OptInRate({ rate = 0 }: OptInRateProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 chamego-icon-accent" />
          Taxa de Opt-in
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{rate.toFixed(1)}%</div>
        <p className="text-sm text-muted-foreground mt-2">
          Clientes que aceitam comunicações de marketing
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Meta</span>
            <span className="font-medium">80%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-chamego-primary transition-all duration-500"
              style={{ width: `${Math.min(rate, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
