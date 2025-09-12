-- Supprimer les doublons de produits en gardant seulement le premier (par ID) pour chaque titre
-- Utiliser l'ID pour déterminer l'ordre car il n'y a pas de created_at

WITH ranked_products AS (
  SELECT id, title, 
         ROW_NUMBER() OVER (PARTITION BY title ORDER BY id ASC) as rn
  FROM products 
  WHERE deleted_at IS NULL
),
products_to_keep AS (
  SELECT id 
  FROM ranked_products 
  WHERE rn = 1
),
products_to_delete AS (
  SELECT p.id 
  FROM products p
  LEFT JOIN products_to_keep pk ON p.id = pk.id
  WHERE p.deleted_at IS NULL 
    AND pk.id IS NULL
)

-- Soft delete les doublons (mettre deleted_at au lieu de vraiment les supprimer)
UPDATE products 
SET deleted_at = NOW()
WHERE id IN (SELECT id FROM products_to_delete);