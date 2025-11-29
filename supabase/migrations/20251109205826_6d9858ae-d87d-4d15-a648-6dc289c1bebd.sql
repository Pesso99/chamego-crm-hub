-- Adicionar Guilherme Pessoto Ceroni como admin
-- Email: gpessotoceroni@gmail.com
-- User ID: 3acaa3c2-9cc5-4a12-9c26-360012dfbaf9

INSERT INTO public.user_roles (user_id, role)
VALUES 
  ('3acaa3c2-9cc5-4a12-9c26-360012dfbaf9', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;