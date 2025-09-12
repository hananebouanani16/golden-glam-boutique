-- Supprimer les doublons de produits en gardant seulement le plus ancien pour chaque titre
-- Step 1: Identifier les doublons et créer une table temporaire avec les IDs à garder

WITH ranked_products AS (
  SELECT id, title, 
         ROW_NUMBER() OVER (PARTITION BY title ORDER BY created_at ASC NULLS LAST, id ASC) as rn
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

-- Step 2: Soft delete les doublons (mettre deleted_at au lieu de vraiment les supprimer)
UPDATE products 
SET deleted_at = NOW()
WHERE id IN (SELECT id FROM products_to_delete);

-- Log du nombre de doublons supprimés
-- Cette requête nous permettra de voir combien de doublons ont été supprimés