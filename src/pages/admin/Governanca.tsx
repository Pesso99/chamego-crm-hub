import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Shield, Upload, History } from 'lucide-react';

export default function Governanca() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Governança & LGPD</h1>
        <p className="text-muted-foreground">
          Gerencie consentimentos, supressão e auditoria de campanhas
        </p>
      </div>

      <Tabs defaultValue="opt-in">
        <TabsList>
          <TabsTrigger value="opt-in">Opt-in/Opt-out</TabsTrigger>
          <TabsTrigger value="suppression">Lista de Supressão</TabsTrigger>
          <TabsTrigger value="audit">Auditoria</TabsTrigger>
        </TabsList>

        <TabsContent value="opt-in" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 chamego-icon-accent" />
                  Consentimentos
                </CardTitle>
                <CardDescription>
                  Relatório de opt-in e origem de cadastro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Opt-in marketing</span>
                    <span className="font-bold">0%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Email confirmado</span>
                    <span className="font-bold">0%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Origem de Cadastro</CardTitle>
                <CardDescription>Como os clientes chegaram à base</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Dados aparecerão conforme a base crescer
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="suppression" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Lista de Supressão</CardTitle>
                  <CardDescription>
                    Emails que não devem receber comunicações
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum email na lista de supressão
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 chamego-icon-accent" />
                Log de Auditoria
              </CardTitle>
              <CardDescription>
                Histórico de alterações em segmentos e campanhas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhuma atividade registrada
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
