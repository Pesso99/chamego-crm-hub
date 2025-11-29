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
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar lista de templates do Resend
    const listResponse = await fetch('https://api.resend.com/templates', {
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      console.error('Resend API error:', errorText);
      throw new Error(`Resend API error: ${listResponse.status}`);
    }

    const { data: templatesList } = await listResponse.json();
    console.log(`Found ${templatesList?.length || 0} templates in Resend`);

    // Para cada template, buscar detalhes completos
    const syncedTemplates = [];
    
    for (const template of templatesList || []) {
      try {
        // Buscar detalhes completos do template
        const detailResponse = await fetch(
          `https://api.resend.com/templates/${template.id}`,
          {
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!detailResponse.ok) {
          console.error(`Failed to fetch template ${template.id}`);
          continue;
        }

        const templateDetails = await detailResponse.json();
        console.log(`Syncing template: ${templateDetails.name}`);

        // Extrair chaves das variáveis (se existirem)
        const variableKeys = (templateDetails.variables || []).map((v: any) => v.key);

        // Upsert no banco de dados
        const { data: dbTemplate, error: upsertError } = await supabase
          .from('email_templates')
          .upsert({
            resend_template_id: templateDetails.id,
            name: templateDetails.name,
            alias: templateDetails.alias || null,
            description: templateDetails.description || null,
            subject_template: templateDetails.subject || '',
            body_template: templateDetails.html || templateDetails.text || '',
            variables: variableKeys,
            category: 'resend',
            status: templateDetails.status || 'published',
            synced_at: new Date().toISOString(),
          }, {
            onConflict: 'resend_template_id',
          })
          .select()
          .single();

        if (!upsertError && dbTemplate) {
          syncedTemplates.push(dbTemplate);
        } else if (upsertError) {
          console.error(`Error upserting template ${templateDetails.name}:`, upsertError);
        }
      } catch (error) {
        console.error(`Error processing template ${template.id}:`, error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        synced: syncedTemplates.length,
        templates: syncedTemplates,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error syncing templates:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
