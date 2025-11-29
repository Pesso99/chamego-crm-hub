-- Drop e recria a view clientes_crm adicionando blocked_communications
DROP VIEW IF EXISTS clientes_crm;

CREATE OR REPLACE VIEW clientes_crm AS
SELECT 
  p.user_id AS id,
  p.full_name AS nome,
  p.email,
  p.phone AS telefone,
  p.birth_date AS data_nascimento,
  p.gender AS genero,
  p.marketing_emails,
  p.blocked_communications,
  COALESCE(sum(o.total_amount), 0::numeric) AS valor_total_gasto,
  COALESCE(avg(o.total_amount), 0::numeric) AS ticket_medio,
  COALESCE(count(DISTINCT o.id), 0::bigint) AS numero_pedidos,
  CASE
    WHEN COALESCE(sum(o.total_amount), 0::numeric) > 5000::numeric THEN 'VIP'::text
    WHEN count(o.id) > 0 THEN 'Regular'::text
    ELSE 'Novo'::text
  END AS segmento,
  array_agg(DISTINCT cat.name) FILTER (WHERE cat.name IS NOT NULL) AS categorias_compradas,
  (
    SELECT array_agg(top_products.product_name ORDER BY top_products.total_qty DESC) AS array_agg
    FROM (
      SELECT p_inner.name AS product_name,
        sum(oi_inner.quantity) AS total_qty
      FROM order_items oi_inner
        JOIN products p_inner ON oi_inner.product_id = p_inner.id
        JOIN orders o_inner ON oi_inner.order_id = o_inner.id
      WHERE o_inner.user_id = p.user_id
      GROUP BY p_inner.name
      ORDER BY (sum(oi_inner.quantity)) DESC
      LIMIT 5
    ) top_products
  ) AS produtos_favoritos,
  max(o.created_at) AS ultima_compra,
  COALESCE(CURRENT_DATE - max(o.created_at)::date, 9999) AS dias_sem_comprar,
  (EXISTS (
    SELECT 1
    FROM cart c
    WHERE c.user_id = p.user_id
  )) AS tem_carrinho_ativo,
  COALESCE((
    SELECT sum(c2.quantity)::integer AS sum
    FROM cart c2
    WHERE c2.user_id = p.user_id
  ), 0) AS itens_carrinho,
  COALESCE((
    SELECT count(*) AS count
    FROM wishlists w
    WHERE w.user_id = p.user_id
  ), 0::bigint) AS itens_wishlist,
  count(o.coupon_code) FILTER (WHERE o.coupon_code IS NOT NULL) AS cupons_usados,
  COALESCE(max(o.created_at)::text, 'Nunca'::text) AS ultima_comunicacao,
  CASE
    WHEN (CURRENT_DATE - max(o.created_at)::date) > 180 THEN 'Inativo'::text
    WHEN count(o.id) = 0 THEN 'Prospect'::text
    ELSE 'Ativo'::text
  END AS status,
  CASE
    WHEN p.marketing_emails = true THEN 'Email'::text
    WHEN p.phone IS NOT NULL THEN 'WhatsApp'::text
    ELSE 'Sem preferência'::text
  END AS preferencia_comunicacao,
  now() AS updated_at
FROM profiles p
  LEFT JOIN orders o ON o.user_id = p.user_id
  LEFT JOIN order_items oi ON oi.order_id = o.id
  LEFT JOIN products prod ON oi.product_id = prod.id
  LEFT JOIN categories cat ON prod.category_id = cat.id
GROUP BY p.user_id, p.full_name, p.email, p.phone, p.birth_date, p.gender, p.marketing_emails, p.blocked_communications;