import { useState } from 'react';
import { FilterGroup, ClienteCRM } from '@/types/crm.types';
import { EmailTemplate } from './useTemplates';
import { SelectedFilters } from '@/lib/crm/filter-definitions';

export interface CampaignFlowData {
  name: string;
  // Audience
  segmentId?: string;
  segmentName?: string;
  filters: FilterGroup;
  audienceCount: number;
  selectedClients: ClienteCRM[];
  selectedFilters: SelectedFilters;
  selectedTags: string[];
  isManualSelection: boolean;
  
  // Template
  templateId?: string;
  template?: EmailTemplate;
  
  // Customize
  subject: string;
  bodyHtml: string;
  
  // Schedule
  scheduledAt?: string;
  sendImmediately: boolean;
  frequencyCap?: {
    max_per_week: number;
    lookback_days: number;
  };
}

const initialData: CampaignFlowData = {
  name: '',
  filters: { operator: 'AND', conditions: [] },
  audienceCount: 0,
  selectedClients: [],
  selectedFilters: [],
  selectedTags: [],
  isManualSelection: false,
  subject: '',
  bodyHtml: '',
  sendImmediately: true,
};

export function useCreateCampaignFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<CampaignFlowData>(initialData);

  const updateData = (updates: Partial<CampaignFlowData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  const goToStep = (step: number) => setCurrentStep(step);

  const reset = () => {
    setCurrentStep(0);
    setData(initialData);
  };

  const prefillFromSuggestion = (suggestion: {
    title: string;
    segmentFilters: FilterGroup;
    suggestedTemplate?: string;
  }) => {
    setData({
      ...initialData,
      name: suggestion.title,
      filters: suggestion.segmentFilters,
    });
  };

  return {
    currentStep,
    data,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    reset,
    prefillFromSuggestion,
  };
}
