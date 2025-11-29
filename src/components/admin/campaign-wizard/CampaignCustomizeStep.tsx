import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CampaignCustomizeStepProps {
  flow: any;
}

const AVAILABLE_VARIABLES = [
  { key: 'nome', label: 'Nome do cliente' },
  { key: 'email', label: 'Email' },
  { key: 'valor_total_gasto', label: 'Valor total gasto' },
  { key: 'numero_pedidos', label: 'Número de pedidos' },
];

function ensureEmailFooter(html: string): string {
  const footer = `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
      <p>Você está recebendo este email porque é cliente da Chamego.</p>
      <p><a href="mailto:contato@oficialchamego.com.br?subject=Descadastrar" style="color: #6b7280; text-decoration: underline;">Descadastrar</a></p>
      <p>Chamego - Produtos de Beleza e Cuidado Pessoal</p>
    </div>
  `;
  
  const lowerHtml = html.toLowerCase();
  if (!lowerHtml.includes('descadastrar') && !lowerHtml.includes('unsubscribe')) {
    return html + footer;
  }
  return html;
}

export function CampaignCustomizeStep({ flow }: CampaignCustomizeStepProps) {
  const { data, updateData, nextStep, prevStep } = flow;

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('campaign-body') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = data.bodyHtml;
      const before = text.substring(0, start);
      const after = text.substring(end);
      const newText = before + `{{${variable}}}` + after;
      
      updateData({ bodyHtml: newText });
      
      // Set cursor position after inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + variable.length + 4,
          start + variable.length + 4
        );
      }, 0);
    }
  };

  const canProceed = data.subject && data.bodyHtml;

  return (
    <div className="space-y-6">
      {/* Template Info */}
      <Card className="bg-muted/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Template Selecionado</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (data.template) {
                  updateData({
                    subject: data.template.subject_template,
                    bodyHtml: data.template.body_template,
                  });
                }
              }}
            >
              Restaurar Original
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium">{data.template?.name}</p>
        </CardContent>
      </Card>

      {/* Subject */}
      <div className="space-y-2">
        <Label htmlFor="campaign-subject">Assunto do Email</Label>
        <Input
          id="campaign-subject"
          placeholder="Ex: {{nome}}, sentimos sua falta!"
          value={data.subject}
          onChange={(e) => updateData({ subject: e.target.value })}
        />
      </div>

      {/* Body */}
      <div className="space-y-2">
        <Label htmlFor="campaign-body">Corpo do Email (HTML)</Label>
        <Textarea
          id="campaign-body"
          placeholder="Cole o HTML do template ou escreva sua mensagem..."
          value={data.bodyHtml}
          onChange={(e) => updateData({ bodyHtml: ensureEmailFooter(e.target.value) })}
          className="font-mono text-xs min-h-[300px]"
        />
        <p className="text-xs text-muted-foreground">
          O rodapé com link de descadastramento será adicionado automaticamente se não estiver presente.
        </p>
      </div>

      {/* Variables Helper */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Variáveis Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_VARIABLES.map((variable) => (
              <Badge
                key={variable.key}
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => insertVariable(variable.key)}
              >
                {'{{'}{variable.key}{'}}'} - {variable.label}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Clique em uma variável para inseri-la no corpo do email
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Voltar
        </Button>
        <Button onClick={nextStep} disabled={!canProceed}>
          Próximo: Preview
        </Button>
      </div>
    </div>
  );
}
