import { supabase } from '@/integrations/supabase/client';
import { ClienteCRM } from '@/types/crm.types';

interface ValidationResult {
  eligible: ClienteCRM[];
  excluded: Array<{ user: ClienteCRM; reason: string }>;
}

export async function validateCampaignAudience(
  segmentId: string,
  frequencyCap?: { max_per_week: number; lookback_days: number }
): Promise<ValidationResult> {
  try {
    const { data: members, error: membersError } = await supabase
      .from('clientes_crm')
      .select('*')
      .eq('marketing_emails', true);

    if (membersError) throw membersError;

    const eligible: ClienteCRM[] = [];
    const excluded: Array<{ user: ClienteCRM; reason: string }> = [];

    for (const member of members || []) {
      const { data: suppressed } = await supabase
        .from('suppression_list' as any)
        .select('email')
        .eq('email', member.email)
        .maybeSingle();

      if (suppressed) {
        excluded.push({ user: member as any, reason: 'Na lista de supressão' });
        continue;
      }

      if (frequencyCap && (member as any).user_id) {
        const { data: canSend } = await supabase.rpc('check_frequency_cap' as any, {
          _user_id: (member as any).user_id,
          _max_per_week: frequencyCap.max_per_week,
          _lookback_days: frequencyCap.lookback_days,
        });

        if (!canSend) {
          excluded.push({ user: member as any, reason: 'Limite de frequência atingido' });
          continue;
        }
      }

      eligible.push(member as any);
    }

    return { eligible, excluded };
  } catch (error) {
    console.error('Error validating audience:', error);
    return { eligible: [], excluded: [] };
  }
}

export async function enqueueCampaign(
  campaignId: string,
  eligibleUsers: ClienteCRM[]
): Promise<void> {
  try {
    const logs = eligibleUsers.map((user) => ({
      campaign_id: campaignId,
      user_id: user.user_id || user.id || '00000000-0000-0000-0000-000000000000',
      email: user.email,
      status: 'queued',
      metadata: {
        full_name: user.full_name || user.nome,
        dias_sem_comprar: user.dias_sem_comprar,
        ticket_medio: user.ticket_medio,
        categorias_compradas: user.categorias_compradas,
      },
    }));

    const { error } = await supabase.from('campaign_logs' as any).insert(logs);

    if (error) throw error;
  } catch (error) {
    console.error('Error enqueueing campaign:', error);
    throw error;
  }
}

export function replacePlaceholders(
  template: string,
  data: Record<string, any>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return data[key]?.toString() || '';
  });
}
