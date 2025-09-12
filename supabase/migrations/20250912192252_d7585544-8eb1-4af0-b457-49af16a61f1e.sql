-- Fix critical security vulnerability: Remove public access to orders table
-- Customer orders contain sensitive personal information that should not be publicly accessible

-- Drop the existing overly permissive policies
DROP POLICY IF EXISTS "Public read orders" ON public.orders;
DROP POLICY IF EXISTS "Public update orders" ON public.orders;
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;

-- Create secure policies that only allow admin access
-- Since the app currently uses localStorage for orders and has admin auth system,
-- we'll restrict database access to admin operations only

-- Allow public to insert orders (for checkout functionality)
CREATE POLICY "Allow public order creation" ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Restrict reading orders - no public access
-- Orders can only be read by admin systems (no policy = no access except through service role)

-- Restrict updating orders - no public access  
-- Orders can only be updated by admin systems (no policy = no access except through service role)