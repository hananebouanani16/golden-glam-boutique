-- Drop the blocking SELECT policy
DROP POLICY IF EXISTS "Block public access to orders" ON public.orders;

-- Create a new policy that allows reading orders
CREATE POLICY "Allow reading all orders"
ON public.orders
FOR SELECT
USING (true);

-- Drop the blocking UPDATE policy
DROP POLICY IF EXISTS "Admin can update orders" ON public.orders;

-- Create a new policy that allows updating orders
CREATE POLICY "Allow updating all orders"
ON public.orders
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Drop the blocking DELETE policy
DROP POLICY IF EXISTS "Admin can delete orders" ON public.orders;

-- Create a new policy that allows deleting orders
CREATE POLICY "Allow deleting all orders"
ON public.orders
FOR DELETE
USING (true);