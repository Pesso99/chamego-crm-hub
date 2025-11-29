import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCreateCampaignFlow } from '@/hooks/useCreateCampaignFlow';
import { CampaignAudienceStep } from './CampaignAudienceStep';
import { CampaignTemplateStep } from './CampaignTemplateStep';
import { CampaignCustomizeStep } from './CampaignCustomizeStep';
import { CampaignPreviewStep } from './CampaignPreviewStep';
import { CampaignScheduleStep } from './CampaignScheduleStep';
import { Progress } from '@/components/ui/progress';
import { ClienteCRM } from '@/types/crm.types';
import { useEffect } from 'react';

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestion?: {
    title: string;
    segmentFilters: any;
    suggestedTemplate?: string;
  };
  preselectedClients?: ClienteCRM[];
}

const STEPS = [
  { title: 'Audiência', description: 'Selecione quem receberá a campanha' },
  { title: 'Template', description: 'Escolha o template de email' },
  { title: 'Personalizar', description: 'Customize o conteúdo' },
  { title: 'Preview', description: 'Visualize antes de enviar' },
  { title: 'Enviar', description: 'Agende ou envie agora' },
];

export function CreateCampaignDialog({ 
  open, 
  onOpenChange, 
  suggestion,
  preselectedClients 
}: CreateCampaignDialogProps) {
  const flow = useCreateCampaignFlow();

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      flow.reset();
    }
    onOpenChange(newOpen);
  };

  // Prefill from suggestion or preselected clients when dialog opens
  useEffect(() => {
    if (open) {
      if (suggestion && flow.currentStep === 0 && !flow.data.name) {
        flow.prefillFromSuggestion(suggestion);
      } else if (preselectedClients && preselectedClients.length > 0 && flow.currentStep === 0) {
        flow.updateData({
          selectedClients: preselectedClients,
          audienceCount: preselectedClients.length,
          name: `Campanha para ${preselectedClients.length} cliente${preselectedClients.length !== 1 ? 's' : ''}`,
          isManualSelection: true,
        });
        flow.goToStep(1);
      }
    }
  }, [open, suggestion, preselectedClients]);

  const progress = ((flow.currentStep + 1) / STEPS.length) * 100;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {flow.currentStep === 0 ? 'Nova Campanha' : STEPS[flow.currentStep].title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {STEPS[flow.currentStep].description}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              {STEPS.map((step, index) => (
                <span
                  key={index}
                  className={index === flow.currentStep ? 'text-primary font-medium' : ''}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>

          {/* Steps */}
          {flow.currentStep === 0 && <CampaignAudienceStep flow={flow} />}
          {flow.currentStep === 1 && <CampaignTemplateStep flow={flow} />}
          {flow.currentStep === 2 && <CampaignCustomizeStep flow={flow} />}
          {flow.currentStep === 3 && <CampaignPreviewStep flow={flow} />}
          {flow.currentStep === 4 && (
            <CampaignScheduleStep flow={flow} onClose={() => handleOpenChange(false)} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
