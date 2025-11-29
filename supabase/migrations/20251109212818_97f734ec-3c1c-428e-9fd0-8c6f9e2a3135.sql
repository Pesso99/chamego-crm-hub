-- Função que atualiza o JWT automaticamente quando roles mudam
CREATE OR REPLACE FUNCTION public.handle_user_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Atualizar o app_metadata do usuário no auth.users
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || 
    jsonb_build_object(
      'roles', 
      (
        SELECT jsonb_agg(role)
        FROM public.user_roles
        WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
      )
    )
  WHERE id = COALESCE(NEW.user_id, OLD.user_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Criar triggers para INSERT, UPDATE e DELETE em user_roles
DROP TRIGGER IF EXISTS on_user_role_insert ON public.user_roles;
CREATE TRIGGER on_user_role_insert
  AFTER INSERT ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_role_change();

DROP TRIGGER IF EXISTS on_user_role_update ON public.user_roles;
CREATE TRIGGER on_user_role_update
  AFTER UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_role_change();

DROP TRIGGER IF EXISTS on_user_role_delete ON public.user_roles;
CREATE TRIGGER on_user_role_delete
  AFTER DELETE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_role_change();

-- Atualizar JWT dos usuários existentes com roles
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || 
  jsonb_build_object(
    'roles', 
    (
      SELECT jsonb_agg(role)
      FROM public.user_roles
      WHERE user_id = auth.users.id
    )
  )
WHERE id IN (
  '3017bb09-f709-409f-b476-de90b4926e50', -- Aline
  '3acaa3c2-9cc5-4a12-9c26-360012dfbaf9'  -- Guilherme
);