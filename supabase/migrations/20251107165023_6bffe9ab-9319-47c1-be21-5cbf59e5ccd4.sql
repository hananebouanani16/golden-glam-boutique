-- Drop old RLS policies that block direct operations
DROP POLICY IF EXISTS "Block public product creation" ON public.products;
DROP POLICY IF EXISTS "Block public product updates" ON public.products;
DROP POLICY IF EXISTS "Block public product deletion" ON public.products;

-- Create admin-friendly RLS policies
CREATE POLICY "Admins can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));