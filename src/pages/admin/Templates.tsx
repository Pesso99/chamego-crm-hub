import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, FileText, Eye } from 'lucide-react';
import { useTemplates, useSyncResendTemplates } from '@/hooks/useTemplates';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';

export default function Templates() {
  const { data: templates, isLoading } = useTemplates();
  const syncTemplates = useSyncResendTemplates();
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground">
            Templates importados do Resend para suas campanhas
          </p>
        </div>
        <Button 
          onClick={() => syncTemplates.mutate()}
          disabled={syncTemplates.isPending}
          className="chamego-border-accent"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${syncTemplates.isPending ? 'animate-spin' : ''}`} />
          {syncTemplates.isPending ? 'Sincronizando...' : 'Sincronizar com Resend'}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : templates?.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum template encontrado</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
              Clique em "Sincronizar com Resend" para importar seus templates
            </p>
            <Button onClick={() => syncTemplates.mutate()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sincronizar Templates
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates?.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{template.name}</CardTitle>
                    {template.description && (
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    )}
                  </div>
                  <Badge variant={template.status === 'published' ? 'default' : 'secondary'}>
                    {template.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Assunto:</span>
                    <p className="text-muted-foreground truncate">{template.subject_template}</p>
                  </div>
                  {template.variables && template.variables.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium">Variáveis:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.variables.map((v) => (
                          <Badge key={v} variant="outline" className="text-xs">
                            {v}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Dialog open={previewTemplate?.id === template.id} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setPreviewTemplate(template)}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          Visualizar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                        <DialogHeader>
                          <DialogTitle>{template.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium mb-1">Assunto:</p>
                            <p className="text-sm text-muted-foreground">{template.subject_template}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2">Preview do Email:</p>
                            <div className="border rounded-lg p-4 bg-background overflow-auto max-h-[500px]">
                              <div 
                                dangerouslySetInnerHTML={{ __html: template.body_template }}
                                className="prose prose-sm max-w-none"
                              />
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" className="flex-1">
                      Usar em Campanha
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
