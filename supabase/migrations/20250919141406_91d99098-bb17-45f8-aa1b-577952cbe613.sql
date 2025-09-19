-- Supprimer tous les bijoux de la base de données, garder seulement les sacs
-- Soft delete tous les produits de catégorie 'bijoux'
UPDATE products 
SET deleted_at = NOW()
WHERE category = 'bijoux' 
  AND deleted_at IS NULL;