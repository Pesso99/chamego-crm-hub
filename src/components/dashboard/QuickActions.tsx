import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Users, AlertTriangle, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export function QuickActions() {
  const actions = [
    {
      title: 'Nova Campanha',
      description: 'Criar campanha de e-mail',
      icon: Mail,
      href: '/admin/campanhas',
      variant: 'brand' as const,
    },
    {
      title: 'Clientes em Risco',
      description: 'Ver 31-90 dias sem comprar',
      icon: AlertTriangle,
      href: '/admin/clientes?status=em_risco',
      variant: 'outline' as const,
    },
    {
      title: 'Criar Segmento',
      description: 'Segmentar base de clientes',
      icon: Filter,
      href: '/admin/clientes',
      variant: 'outline' as const,
    },
    {
      title: 'Ver Todos',
      description: 'Acessar base completa',
      icon: Users,
      href: '/admin/clientes',
      variant: 'outline' as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} to={action.href}>
                <Button
                  variant={action.variant}
                  className="w-full h-auto flex flex-col items-start gap-2 p-4"
                >
                  <Icon className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">{action.title}</div>
                    <div className="text-xs opacity-80 font-normal">
                      {action.description}
                    </div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
