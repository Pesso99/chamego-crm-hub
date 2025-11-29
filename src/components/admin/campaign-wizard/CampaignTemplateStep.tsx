import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTemplates, useSyncResendTemplates } from '@/hooks/useTemplates';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CampaignTemplateStepProps {
  flow: any;
}

export function CampaignTemplateStep({ flow }: CampaignTemplateStepProps) {
  const { data, updateData, nextStep, prevStep } = flow;
  const { data: templates, isLoading } = useTemplates();
  const syncTemplates = useSyncResendTemplates();

  const handleSelectTemplate = (template: any) => {
    updateData({
      templateId: template.id,
      template,
      subject: template.subject_template,
      bodyHtml: template.body_template,
    });
  };

  const canProceed = !!data.templateId;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Escolha um template do Resend para sua campanha
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => syncTemplates.mutate()}
          disabled={syncTemplates.isPending}
        >
          <RefreshCw className={cn('h-3 w-3 mr-2', syncTemplates.isPending && 'animate-spin')} />
          Sincronizar
        </Button>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : templates && templates.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 max-h-[400px] overflow-y-auto pr-2">
          {templates.map((template) => {
            const isSelected = data.templateId === template.id;
            
            return (
              <Card
                key={template.id}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-md',
                  isSelected && 'ring-2 ring-primary shadow-lg'
                )}
                onClick={() => handleSelectTemplate(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {template.name}
                        {isSelected && <Check className="h-4 w-4 text-primary" />}
                      </CardTitle>
                      {template.description && (
                        <CardDescription className="text-xs mt-1">
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
                  <div className="text-xs text-muted-foreground truncate">
                    <strong>Assunto:</strong> {template.subject_template}
                  </div>
                  {template.variables && template.variables.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.variables.map((v) => (
                        <Badge key={v} variant="outline" className="text-xs">
                          {'{{'}{v}{'}}'}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-muted-foreground mb-4">
              Nenhum template encontrado. Sincronize com o Resend.
            </p>
            <Button onClick={() => syncTemplates.mutate()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sincronizar Templates
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Voltar
        </Button>
        <Button onClick={nextStep} disabled={!canProceed}>
          Próximo: Personalizar
        </Button>
      </div>
    </div>
  );
}
