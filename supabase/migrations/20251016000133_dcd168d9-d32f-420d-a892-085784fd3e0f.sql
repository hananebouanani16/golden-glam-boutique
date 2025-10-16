-- Correction des politiques de sécurité RLS

-- ========================================
-- 1. SÉCURISATION DE LA TABLE ORDERS
-- ========================================

-- Supprimer les politiques publiques dangereuses
DROP POLICY IF EXISTS "Allow reading all orders" ON public.orders;
DROP POLICY IF EXISTS "Allow updating all orders" ON public.orders;
DROP POLICY IF EXISTS "Allow deleting all orders" ON public.orders;

-- Créer un type enum pour les rôles
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Créer la table user_roles si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Activer RLS sur user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Créer une fonction sécurisée pour vérifier les rôles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Nouvelles politiques sécurisées pour orders
CREATE POLICY "Public can create orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all orders"
  ON public.orders
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders"
  ON public.orders
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete orders"
  ON public.orders
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- ========================================
-- 2. SÉCURISATION DE LA TABLE PROMOTIONS
-- ========================================

DROP POLICY IF EXISTS "Public insert promotions" ON public.promotions;
DROP POLICY IF EXISTS "Public update promotions" ON public.promotions;
DROP POLICY IF EXISTS "Public delete promotions" ON public.promotions;

CREATE POLICY "Admins can insert promotions"
  ON public.promotions
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update promotions"
  ON public.promotions
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete promotions"
  ON public.promotions
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- ========================================
-- 3. SÉCURISATION DE LA TABLE DELIVERY_RATES
-- ========================================

DROP POLICY IF EXISTS "Public insert delivery_rates" ON public.delivery_rates;
DROP POLICY IF EXISTS "Public update delivery_rates" ON public.delivery_rates;
DROP POLICY IF EXISTS "Public delete delivery_rates" ON public.delivery_rates;

CREATE POLICY "Admins can insert delivery_rates"
  ON public.delivery_rates
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update delivery_rates"
  ON public.delivery_rates
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete delivery_rates"
  ON public.delivery_rates
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- ========================================
-- 4. SÉCURISATION DE LA TABLE CHAT_SESSIONS
-- ========================================

DROP POLICY IF EXISTS "Allow own session updates" ON public.chat_sessions;

CREATE POLICY "Users can update own sessions"
  ON public.chat_sessions
  FOR UPDATE
  USING (session_id = current_setting('request.headers')::json->>'x-session-id')
  WITH CHECK (session_id = current_setting('request.headers')::json->>'x-session-id');

CREATE POLICY "Admins can update all sessions"
  ON public.chat_sessions
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ========================================
-- 5. POLITIQUE POUR USER_ROLES
-- ========================================

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));