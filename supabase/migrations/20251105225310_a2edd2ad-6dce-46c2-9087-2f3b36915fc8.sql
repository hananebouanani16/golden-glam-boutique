-- ========================================
-- Migration: Fix Security Vulnerabilities
-- ========================================
-- 1. Remove token-based admin functions and replace with role-based security
-- 2. Fix chat_messages RLS policy for admin access

-- ========================================
-- PART 1: Update admin_create_product function
-- ========================================
CREATE OR REPLACE FUNCTION public.admin_create_product(
  p_title text,
  p_price text,
  p_category text,
  p_original_price text DEFAULT NULL,
  p_image text DEFAULT NULL,
  p_stock_quantity integer DEFAULT 0
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_product_id uuid;
BEGIN
  -- Check if current user has admin role
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin role required';
  END IF;

  -- Validate required parameters
  IF p_title IS NULL OR p_title = '' THEN
    RAISE EXCEPTION 'Title is required';
  END IF;
  
  IF p_price IS NULL OR p_price = '' THEN
    RAISE EXCEPTION 'Price is required';
  END IF;
  
  IF p_category IS NULL OR p_category = '' THEN
    RAISE EXCEPTION 'Category is required';
  END IF;

  -- Insert new product
  INSERT INTO public.products (title, price, original_price, category, image, stock_quantity)
  VALUES (p_title, p_price, p_original_price, p_category, p_image, p_stock_quantity)
  RETURNING id INTO new_product_id;

  RETURN new_product_id;
END;
$$;

-- ========================================
-- PART 2: Update admin_update_product function
-- ========================================
CREATE OR REPLACE FUNCTION public.admin_update_product(
  p_id uuid,
  p_title text,
  p_price text,
  p_category text,
  p_original_price text DEFAULT NULL,
  p_image text DEFAULT NULL,
  p_stock_quantity integer DEFAULT 0
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if current user has admin role
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin role required';
  END IF;

  -- Update product
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

-- ========================================
-- PART 3: Update admin_delete_product function
-- ========================================
CREATE OR REPLACE FUNCTION public.admin_delete_product(p_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if current user has admin role
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin role required';
  END IF;

  -- Soft delete the product
  UPDATE public.products 
  SET deleted_at = NOW()
  WHERE id = p_id AND deleted_at IS NULL;

  RETURN FOUND;
END;
$$;

-- ========================================
-- PART 4: Update admin_restore_product function
-- ========================================
CREATE OR REPLACE FUNCTION public.admin_restore_product(p_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if current user has admin role
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin role required';
  END IF;

  -- Restore the product (set deleted_at to NULL)
  UPDATE public.products 
  SET deleted_at = NULL
  WHERE id = p_id AND deleted_at IS NOT NULL;

  RETURN FOUND;
END;
$$;

-- ========================================
-- PART 5: Fix chat_messages RLS policy for admin access
-- ========================================
-- Drop the broken admin policy
DROP POLICY IF EXISTS "Admin can view all chat messages" ON public.chat_messages;

-- Create correct admin policy
CREATE POLICY "Admin can view all chat messages"
ON public.chat_messages
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Also add admin policies for other operations on chat_messages
CREATE POLICY "Admin can update chat messages"
ON public.chat_messages
FOR UPDATE
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete chat messages"
ON public.chat_messages
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- ========================================
-- PART 6: Fix chat_sessions RLS policy for admin access
-- ========================================
-- Drop the broken admin policy
DROP POLICY IF EXISTS "Admin can view all chat sessions" ON public.chat_sessions;

-- Create correct admin policy
CREATE POLICY "Admin can view all chat sessions"
ON public.chat_sessions
FOR SELECT
USING (has_role(auth.uid(), 'admin'));