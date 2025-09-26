-- Sécuriser la table products en restreignant les opérations dangereuses

-- Supprimer les politiques publiques dangereuses existantes
DROP POLICY IF EXISTS "Public delete products" ON public.products;
DROP POLICY IF EXISTS "Public edit products" ON public.products;
DROP POLICY IF EXISTS "Public update products" ON public.products;

-- Maintenir la lecture publique pour l'affichage des produits (nécessaire pour le site)
-- mais seulement pour les produits non supprimés
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public can view active products" 
ON public.products 
FOR SELECT 
USING (deleted_at IS NULL);

-- Bloquer complètement les opérations de modification publiques
-- Cela nécessitera l'implémentation d'un système d'auth Supabase pour les admins

CREATE POLICY "Block public product creation" 
ON public.products 
FOR INSERT 
WITH CHECK (false);

CREATE POLICY "Block public product updates" 
ON public.products 
FOR UPDATE 
USING (false) 
WITH CHECK (false);

CREATE POLICY "Block public product deletion" 
ON public.products 
FOR DELETE 
USING (false);

-- Note: Les opérations d'administration devront passer par des fonctions
-- sécurisées ou un système d'authentification Supabase approprié