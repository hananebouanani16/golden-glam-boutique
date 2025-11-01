-- Restaurer tous les produits supprimés
UPDATE public.products 
SET deleted_at = NULL 
WHERE deleted_at IS NOT NULL;

-- Créer une fonction sécurisée pour restaurer un produit
CREATE OR REPLACE FUNCTION public.admin_restore_product(
  p_id uuid,
  p_admin_token text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  expected_token TEXT := '25051985n*N';
BEGIN
  -- Vérifier le token d'administration
  IF p_admin_token IS NULL OR p_admin_token != expected_token THEN
    RAISE EXCEPTION 'Unauthorized: Invalid admin token';
  END IF;

  -- Restaurer le produit (mettre deleted_at à NULL)
  UPDATE public.products 
  SET deleted_at = NULL
  WHERE id = p_id AND deleted_at IS NOT NULL;

  RETURN FOUND;
END;
$$;