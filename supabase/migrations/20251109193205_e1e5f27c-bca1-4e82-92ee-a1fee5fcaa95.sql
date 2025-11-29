-- Add blocked_communications column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS blocked_communications boolean DEFAULT false;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_blocked_communications 
ON public.profiles(blocked_communications) 
WHERE blocked_communications = true;

-- Update the clientes_crm view if it exists to include blocked status
-- (The view might need to join with profiles to show this field)