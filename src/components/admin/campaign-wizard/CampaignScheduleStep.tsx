import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCampaignActions } from '@/hooks/useCampaignActions';
import { Calendar, Send, Clock } from 'lucide-react';

interface CampaignScheduleStepProps {
  flow: any;
  onClose: () => void;
}

export function CampaignScheduleStep({ flow, onClose }: CampaignScheduleStepProps) {
  const { data, updateData, prevStep } = flow;
  const createCampaign = useCampaignActions();

  const handleSubmit = async () => {
    await createCampaign.mutateAsync({
      name: data.name,
      segmentId: data.segmentId,
      subject: data.subject,
      bodyHtml: data.bodyHtml,
      scheduledAt: data.sendImmediately ? undefined : data.scheduledAt,
      frequencyCap: data.frequencyCap,
      clients: data.selectedClients,
      templateId: data.templateId,
    });

    onClose();
  };

  return (
    <div className="space-y-6">
      {/* Send Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quando enviar?</CardTitle>
          <CardDescription>
            Escolha se deseja enviar imediatamente ou agendar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Immediate Send */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Enviar Imediatamente
              </Label>
              <p className="text-sm text-muted-foreground">
                A campanha será enviada assim que for criada
              </p>
            </div>
            <Switch
              checked={data.sendImmediately}
              onCheckedChange={(checked) => updateData({ sendImmediately: checked })}
            />
          </div>

          {/* Schedule Date */}
          {!data.sendImmediately && (
            <div className="space-y-2">
              <Label htmlFor="scheduled-at" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data e Hora de Envio
              </Label>
              <Input
                id="scheduled-at"
                type="datetime-local"
                value={data.scheduledAt || ''}
                onChange={(e) => updateData({ scheduledAt: e.target.value })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Frequency Cap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Limite de Frequência (Opcional)
          </CardTitle>
          <CardDescription>
            Evite enviar muitos emails para o mesmo cliente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-per-week">Máximo por Semana</Label>
              <Input
                id="max-per-week"
                type="number"
                placeholder="Ex: 3"
                value={data.frequencyCap?.max_per_week || ''}
                onChange={(e) =>
                  updateData({
                    frequencyCap: {
                      ...data.frequencyCap,
                      max_per_week: parseInt(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lookback-days">Período (dias)</Label>
              <Input
                id="lookback-days"
                type="number"
                placeholder="Ex: 7"
                value={data.frequencyCap?.lookback_days || ''}
                onChange={(e) =>
                  updateData({
                    frequencyCap: {
                      ...data.frequencyCap,
                      lookback_days: parseInt(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">Resumo da Campanha</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nome:</span>
            <span className="font-medium">{data.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Template:</span>
            <span className="font-medium">{data.template?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Destinatários:</span>
            <span className="font-medium">{data.audienceCount} clientes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Envio:</span>
            <span className="font-medium">
              {data.sendImmediately ? 'Imediato' : 'Agendado'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={createCampaign.isPending}>
          Voltar
        </Button>
        <Button onClick={handleSubmit} disabled={createCampaign.isPending}>
          {createCampaign.isPending ? 'Criando...' : data.sendImmediately ? 'Criar e Enviar' : 'Criar Campanha'}
        </Button>
      </div>
    </div>
  );
}
