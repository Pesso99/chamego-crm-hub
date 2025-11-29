-- Create segments table for saving filter presets
CREATE TABLE IF NOT EXISTS public.segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  filters_json JSONB NOT NULL,
  customer_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.segments ENABLE ROW LEVEL SECURITY;

-- Allow users to read all active segments
CREATE POLICY "Allow read access to active segments"
  ON public.segments
  FOR SELECT
  USING (is_active = true);

-- Allow users to insert their own segments
CREATE POLICY "Allow insert own segments"
  ON public.segments
  FOR INSERT
  WITH CHECK (created_by = '00000000-0000-0000-0000-000000000000' OR auth.uid() = created_by);

-- Allow users to update their own segments
CREATE POLICY "Allow update own segments"
  ON public.segments
  FOR UPDATE
  USING (created_by = '00000000-0000-0000-0000-000000000000' OR auth.uid() = created_by);

-- Add indexes for performance
CREATE INDEX idx_segments_active ON public.segments(is_active, created_at DESC);
CREATE INDEX idx_segments_created_by ON public.segments(created_by);

-- Trigger to update updated_at
CREATE TRIGGER update_segments_updated_at
  BEFORE UPDATE ON public.segments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();