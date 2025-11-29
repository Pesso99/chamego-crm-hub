-- Modificar função de auditoria para aceitar UUID do sistema
CREATE OR REPLACE FUNCTION public.log_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.role_audit_log (user_id, role, action, performed_by, new_values)
    VALUES (NEW.user_id, NEW.role, 'INSERT', COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.role_audit_log (user_id, role, action, performed_by, old_values, new_values)
    VALUES (NEW.user_id, NEW.role, 'UPDATE', COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid), to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.role_audit_log (user_id, role, action, performed_by, old_values)
    VALUES (OLD.user_id, OLD.role, 'DELETE', COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid), to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Adicionar todos os usuários existentes como admins
INSERT INTO public.user_roles (user_id, role)
SELECT 
  id,
  'admin'::app_role
FROM auth.users
WHERE id NOT IN (
  SELECT user_id 
  FROM public.user_roles 
  WHERE role = 'admin'::app_role
)
ON CONFLICT (user_id, role) DO NOTHING;