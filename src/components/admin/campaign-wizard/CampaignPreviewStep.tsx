import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo } from 'react';
import { Eye } from 'lucide-react';

interface CampaignPreviewStepProps {
  flow: any;
}

export function CampaignPreviewStep({ flow }: CampaignPreviewStepProps) {
  const { data, nextStep, prevStep } = flow;
  const [selectedClientIndex, setSelectedClientIndex] = useState(0);

  const previewClient = data.selectedClients[selectedClientIndex];

  const previewData = useMemo(() => {
    if (!previewClient) return {};
    
    return {
      nome: previewClient.nome || previewClient.full_name || 'Cliente',
      email: previewClient.email,
      valor_total_gasto: previewClient.valor_total_gasto?.toFixed(2) || '0.00',
      numero_pedidos: previewClient.numero_pedidos || 0,
    };
  }, [previewClient]);

  const replaceVariables = (text: string, data: Record<string, any>) => {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key]?.toString() || match;
    });
  };

  const previewSubject = replaceVariables(data.subject, previewData);
  const previewBody = replaceVariables(data.bodyHtml, previewData);

  return (
    <div className="space-y-6">
      {/* Client Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Preview com dados de cliente real
        </label>
        <Select
          value={selectedClientIndex.toString()}
          onValueChange={(value) => setSelectedClientIndex(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {data.selectedClients.slice(0, 10).map((client: any, index: number) => (
              <SelectItem key={index} value={index.toString()}>
                {client.nome || client.full_name} ({client.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Preview Cards */}
      <div className="space-y-4">
        {/* Subject Preview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Assunto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{previewSubject}</p>
          </CardContent>
        </Card>

        {/* Body Preview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Corpo do Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm max-w-none border rounded-lg p-4 bg-background max-h-[400px] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: previewBody }}
            />
          </CardContent>
        </Card>

        {/* Variables Used */}
        <Card className="bg-muted/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Dados Utilizados</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(previewData).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-muted-foreground">{key}:</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Voltar
        </Button>
        <Button onClick={nextStep}>
          Próximo: Agendar Envio
        </Button>
      </div>
    </div>
  );
}
