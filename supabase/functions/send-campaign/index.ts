import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { campaignId } = await req.json();
    
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar campanha
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      throw new Error('Campaign not found');
    }

    // Buscar logs com status 'queued'
    const { data: logs, error: logsError } = await supabase
      .from('campaign_logs')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('status', 'queued')
      .limit(100);

    if (logsError) throw logsError;

    console.log(`Processing ${logs?.length || 0} emails for campaign ${campaignId}`);

    let sent = 0;
    let failed = 0;

    for (const log of logs || []) {
      try {
        // Substituir variáveis no template
        const personalizedSubject = replaceVariables(campaign.subject, log.metadata);
        const personalizedBody = replaceVariables(campaign.body_html, log.metadata);

        // Enviar email via Resend API
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Chamego <contato@oficialchamego.com.br>',
            reply_to: 'contato@oficialchamego.com.br',
            to: [log.email],
            subject: personalizedSubject,
            html: personalizedBody,
            text: stripHtml(personalizedBody),
            headers: {
              'X-Entity-Ref-ID': log.id,
              'List-Unsubscribe': '<mailto:contato@oficialchamego.com.br?subject=unsubscribe>',
              'X-Campaign-ID': campaignId,
            },
            tags: [
              { name: 'campaign_id', value: campaignId.substring(0, 256) },
              { name: 'type', value: 'marketing' }
            ]
          }),
        });

        if (!resendResponse.ok) {
          const errorText = await resendResponse.text();
          throw new Error(`Resend API error: ${errorText}`);
        }

        const emailData = await resendResponse.json();

        // Atualizar log
        await supabase
          .from('campaign_logs')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            metadata: { ...log.metadata, resend_id: emailData.id },
          })
          .eq('id', log.id);

        sent++;
        
        // Rate limiting: 100ms entre emails para evitar spam triggers
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to send to ${log.email}:`, error);
        
        await supabase
          .from('campaign_logs')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
          })
          .eq('id', log.id);

        failed++;
      }
    }

    // Se todos os emails foram processados, atualizar campanha
    const { data: remainingLogs } = await supabase
      .from('campaign_logs')
      .select('id')
      .eq('campaign_id', campaignId)
      .eq('status', 'queued')
      .limit(1);

    if (!remainingLogs || remainingLogs.length === 0) {
      await supabase
        .from('campaigns')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
        .eq('id', campaignId);
    }

    return new Response(
      JSON.stringify({ success: true, sent, failed }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error sending campaign:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function replaceVariables(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return data[key]?.toString() || '';
  });
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}
