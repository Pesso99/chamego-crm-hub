-- Create custom_tags table for user-defined tags
CREATE TABLE IF NOT EXISTS public.custom_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text DEFAULT 'custom',
  color text DEFAULT '#A96418',
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Create client_tags junction table
CREATE TABLE IF NOT EXISTS public.client_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tag_id uuid NOT NULL REFERENCES public.custom_tags(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  assigned_by uuid,
  UNIQUE(user_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_client_tags_user_id ON public.client_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_client_tags_tag_id ON public.client_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_custom_tags_active ON public.custom_tags(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.custom_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for custom_tags
CREATE POLICY "Anyone can read active tags" 
  ON public.custom_tags 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Anyone can manage tags" 
  ON public.custom_tags 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- RLS Policies for client_tags
CREATE POLICY "Anyone can read client tags" 
  ON public.client_tags 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can manage client tags" 
  ON public.client_tags 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);