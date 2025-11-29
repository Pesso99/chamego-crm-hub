-- Permitir que admins atualizem o campo blocked_communications de qualquer perfil
CREATE POLICY "Admins can block any user communications"
ON profiles
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
);