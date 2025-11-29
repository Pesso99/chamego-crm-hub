import { useCliente } from '@/hooks/useClientes';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { calculateClientTags } from '@/lib/crm/tagging';
import { ClientTagBadge } from './ClientTagBadge';
import { ClientCustomTags } from './ClientCustomTags';
import { ClientNavigationInsights } from './ClientNavigationInsights';
import { 
  User, 
  ShoppingBag, 
  MousePointer, 
  Mail, 
  Tag as TagIcon,
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';

interface ClientDrawerProps {
  clientId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientDrawer({ clientId, open, onOpenChange }: ClientDrawerProps) {
  const { data: cliente, isLoading } = useCliente(clientId || '');

  if (!clientId) return null;

  const tags = cliente ? calculateClientTags(cliente) : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : cliente ? (
          <>
            <SheetHeader>
              <SheetTitle className="text-2xl">{cliente.nome}</SheetTitle>
              <SheetDescription>{cliente.email}</SheetDescription>
              
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.slice(0, 5).map((tag) => (
                  <ClientTagBadge key={tag.id} tag={tag} />
                ))}
                {tags.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{tags.length - 5} tags
                  </Badge>
                )}
              </div>
            </SheetHeader>

            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">
                  <User className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="compras">
                  <ShoppingBag className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="navegacao">
                  <MousePointer className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="comunicacao">
                  <Mail className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="tags">
                  <TagIcon className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Valor Total Gasto
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        R$ {(cliente.valor_total_gasto || 0).toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Ticket Médio
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        R$ {(cliente.ticket_medio || 0).toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        Nº de Pedidos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {cliente.numero_pedidos || 0}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Dias sem Comprar
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {cliente.dias_sem_comprar || 0}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Gênero</p>
                        <p className="font-medium">{cliente.genero || 'Não informado'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Telefone</p>
                        <p className="font-medium">{cliente.telefone || 'Não informado'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Data de Nascimento</p>
                        <p className="font-medium">
                          {cliente.data_nascimento 
                            ? new Date(cliente.data_nascimento).toLocaleDateString('pt-BR')
                            : 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <Badge variant="outline">{cliente.status || 'Ativo'}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="compras" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Compras</CardTitle>
                    <CardDescription>
                      {cliente.ultima_compra 
                        ? `Última compra: ${new Date(cliente.ultima_compra).toLocaleDateString('pt-BR')}`
                        : 'Nenhuma compra registrada'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {cliente.categorias_compradas && cliente.categorias_compradas.length > 0 ? (
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-2">Categorias Compradas</p>
                          <div className="flex flex-wrap gap-2">
                            {cliente.categorias_compradas.map((cat, i) => (
                              <Badge key={i} variant="secondary">{cat}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        {cliente.produtos_favoritos && cliente.produtos_favoritos.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Produtos Favoritos</p>
                            <div className="flex flex-wrap gap-2">
                              {cliente.produtos_favoritos.map((prod, i) => (
                                <Badge key={i} variant="outline">{prod}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhuma compra registrada</p>
                    )}
                  </CardContent>
                </Card>

                {cliente.tem_carrinho_ativo && (
                  <Card className="border-status-info">
                    <CardHeader>
                      <CardTitle className="text-status-info">Carrinho Ativo</CardTitle>
                      <CardDescription>
                        {cliente.itens_carrinho} {cliente.itens_carrinho === 1 ? 'item' : 'itens'} no carrinho
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="navegacao" className="space-y-4">
                <ClientNavigationInsights userId={clientId} />
              </TabsContent>

              <TabsContent value="comunicacao" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Comunicações</CardTitle>
                    <CardDescription>
                      {cliente.ultima_comunicacao 
                        ? `Última comunicação: ${cliente.ultima_comunicacao}`
                        : 'Nenhuma comunicação registrada'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Marketing Emails</span>
                      <Badge variant={cliente.marketing_emails ? 'default' : 'destructive'}>
                        {cliente.marketing_emails ? 'Ativo' : 'Opt-Out'}
                      </Badge>
                    </div>
                    
                    {typeof cliente.cupons_usados === 'number' && cliente.cupons_usados > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cupons Usados</span>
                        <Badge variant="secondary">{cliente.cupons_usados}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tags" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Tags Comportamentais (Automáticas)</CardTitle>
                    <CardDescription>
                      Tags geradas automaticamente baseadas no comportamento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <ClientTagBadge key={tag.id} tag={tag} />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <ClientCustomTags clientId={clientId} />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Cliente não encontrado</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
