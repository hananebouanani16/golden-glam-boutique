-- Corriger les fonctions sécurisées pour l'administration des produits
-- Réorganiser les paramètres pour éviter l'erreur de syntaxe

-- Fonction pour créer un produit (admin seulement)
CREATE OR REPLACE FUNCTION public.admin_create_product(
  p_title TEXT,
  p_price TEXT,
  p_category TEXT,
  p_admin_token TEXT,
  p_original_price TEXT DEFAULT NULL,
  p_image TEXT DEFAULT NULL,
  p_stock_quantity INTEGER DEFAULT 0
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_product_id uuid;
  expected_token TEXT := '25051985n*N'; -- Même token que l'auth actuelle
BEGIN
  -- Vérifier le token d'administration
  IF p_admin_token IS NULL OR p_admin_token != expected_token THEN
    RAISE EXCEPTION 'Unauthorized: Invalid admin token';
  END IF;

  -- Valider les paramètres requis
  IF p_title IS NULL OR p_title = '' THEN
    RAISE EXCEPTION 'Title is required';
  END IF;
  
  IF p_price IS NULL OR p_price = '' THEN
    RAISE EXCEPTION 'Price is required';
  END IF;
  
  IF p_category IS NULL OR p_category = '' THEN
    RAISE EXCEPTION 'Category is required';
  END IF;

  -- Insérer le nouveau produit
  INSERT INTO public.products (title, price, original_price, category, image, stock_quantity)
  VALUES (p_title, p_price, p_original_price, p_category, p_image, p_stock_quantity)
  RETURNING id INTO new_product_id;

  RETURN new_product_id;
END;
$$;

-- Fonction pour mettre à jour un produit (admin seulement)
CREATE OR REPLACE FUNCTION public.admin_update_product(
  p_id uuid,
  p_title TEXT,
  p_price TEXT,
  p_category TEXT,
  p_admin_token TEXT,
  p_original_price TEXT DEFAULT NULL,
  p_image TEXT DEFAULT NULL,
  p_stock_quantity INTEGER DEFAULT 0
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

  -- Mettre à jour le produit
  UPDATE public.products 
  SET 
    title = p_title,
    price = p_price,
    original_price = p_original_price,
    category = p_category,
    image = p_image,
    stock_quantity = p_stock_quantity
  WHERE id = p_id AND deleted_at IS NULL;

  RETURN FOUND;
END;
$$;

-- Fonction pour supprimer un produit (soft delete, admin seulement)
CREATE OR REPLACE FUNCTION public.admin_delete_product(
  p_id uuid,
  p_admin_token TEXT
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

  -- Soft delete du produit
  UPDATE public.products 
  SET deleted_at = NOW()
  WHERE id = p_id AND deleted_at IS NULL;

  RETURN FOUND;
END;
$$;