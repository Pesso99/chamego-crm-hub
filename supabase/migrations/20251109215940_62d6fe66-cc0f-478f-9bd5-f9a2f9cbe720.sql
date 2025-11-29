-- Tabela de Templates de Email
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resend_template_id TEXT UNIQUE,
  name TEXT NOT NULL,
  alias TEXT,
  description TEXT,
  subject_template TEXT NOT NULL,
  body_template TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  category TEXT,
  status TEXT DEFAULT 'draft',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  synced_at TIMESTAMPTZ
);

-- Tabela de Campanhas
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  template_id UUID REFERENCES email_templates(id),
  segment_id UUID REFERENCES segments(id),
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_variables JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  frequency_cap JSONB,
  bypass_checks BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Logs de Campanha
CREATE TABLE IF NOT EXISTS campaign_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'queued',
  suppression_reason TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  clicked_url TEXT,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Lista de Supressão
CREATE TABLE IF NOT EXISTS suppression_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  reason TEXT,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_scheduled ON campaigns(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_campaign_logs_campaign ON campaign_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_logs_email ON campaign_logs(email);
CREATE INDEX IF NOT EXISTS idx_campaign_logs_status ON campaign_logs(status);
CREATE INDEX IF NOT EXISTS idx_templates_resend_id ON email_templates(resend_template_id);

-- Habilitar RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppression_list ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para Email Templates
DROP POLICY IF EXISTS "Admins can manage templates" ON email_templates;
CREATE POLICY "Admins can manage templates"
  ON email_templates
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para Campaigns
DROP POLICY IF EXISTS "Admins can manage campaigns" ON campaigns;
CREATE POLICY "Admins can manage campaigns"
  ON campaigns
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para Campaign Logs
DROP POLICY IF EXISTS "Admins can view campaign logs" ON campaign_logs;
CREATE POLICY "Admins can view campaign logs"
  ON campaign_logs
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "System can insert campaign logs" ON campaign_logs;
CREATE POLICY "System can insert campaign logs"
  ON campaign_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Políticas RLS para Suppression List
DROP POLICY IF EXISTS "Admins can manage suppression list" ON suppression_list;
CREATE POLICY "Admins can manage suppression list"
  ON suppression_list
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Função para verificar frequency cap
CREATE OR REPLACE FUNCTION check_frequency_cap(
  _user_id UUID,
  _max_per_week INTEGER,
  _lookback_days INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  email_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO email_count
  FROM campaign_logs
  WHERE user_id = _user_id
    AND status = 'sent'
    AND sent_at > now() - (_lookback_days || ' days')::INTERVAL;
  
  RETURN email_count < _max_per_week;
END;
$$;

-- Função para calcular métricas de campanha
CREATE OR REPLACE FUNCTION calculate_campaign_metrics(_campaign_id UUID)
RETURNS TABLE (
  total_sent BIGINT,
  delivered BIGINT,
  opened BIGINT,
  clicked BIGINT,
  bounced BIGINT,
  failed BIGINT,
  suppressed BIGINT,
  open_rate NUMERIC,
  click_rate NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE status = 'sent') as total_sent,
    COUNT(*) FILTER (WHERE status = 'delivered') as delivered,
    COUNT(*) FILTER (WHERE status = 'opened') as opened,
    COUNT(*) FILTER (WHERE status = 'clicked') as clicked,
    COUNT(*) FILTER (WHERE status = 'bounced') as bounced,
    COUNT(*) FILTER (WHERE status = 'failed') as failed,
    COUNT(*) FILTER (WHERE status = 'suppressed') as suppressed,
    CASE 
      WHEN COUNT(*) FILTER (WHERE status = 'delivered') > 0 
      THEN ROUND((COUNT(*) FILTER (WHERE status = 'opened')::NUMERIC / COUNT(*) FILTER (WHERE status = 'delivered')::NUMERIC) * 100, 2)
      ELSE 0 
    END as open_rate,
    CASE 
      WHEN COUNT(*) FILTER (WHERE status = 'opened') > 0 
      THEN ROUND((COUNT(*) FILTER (WHERE status = 'clicked')::NUMERIC / COUNT(*) FILTER (WHERE status = 'opened')::NUMERIC) * 100, 2)
      ELSE 0 
    END as click_rate
  FROM campaign_logs
  WHERE campaign_id = _campaign_id;
END;
$$;