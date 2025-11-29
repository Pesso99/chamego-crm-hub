-- CORREÇÃO CRÍTICA DE SEGURANÇA: Remover todos admins exceto Aline e usuário atual

-- PASSO 1: Deletar TODOS os registros de admin
DELETE FROM public.user_roles 
WHERE role = 'admin';

-- PASSO 2: Re-adicionar apenas Aline Cuartero como admin permanente
INSERT INTO public.user_roles (user_id, role)
VALUES 
  ('3017bb09-f709-409f-b476-de90b4926e50', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- PASSO 3: Adicionar o usuário atual (você) como admin
-- Isso será executado no contexto da sua sessão autenticada
INSERT INTO public.user_roles (user_id, role)
SELECT auth.uid(), 'admin'
WHERE auth.uid() IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;