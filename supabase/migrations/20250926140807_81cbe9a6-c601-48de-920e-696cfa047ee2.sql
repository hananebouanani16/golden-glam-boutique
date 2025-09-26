-- Sécuriser la table orders en ajoutant des politiques RLS appropriées

-- Supprimer toute politique SELECT publique existante s'il y en a
DROP POLICY IF EXISTS "Public read orders" ON public.orders;

-- Empêcher complètement l'accès en lecture publique aux commandes
-- car elles contiennent des données personnelles sensibles
CREATE POLICY "Block public access to orders" 
ON public.orders 
FOR SELECT 
USING (false);

-- Permettre seulement la mise à jour et suppression pour les admins authentifiés
-- (nécessitera l'implémentation d'un système d'auth Supabase plus tard)
CREATE POLICY "Admin can update orders" 
ON public.orders 
FOR UPDATE 
USING (false) -- Pour l'instant, bloquer complètement
WITH CHECK (false);

CREATE POLICY "Admin can delete orders" 
ON public.orders 
FOR DELETE 
USING (false); -- Pour l'instant, bloquer complètement

-- La politique INSERT existante est conservée pour permettre la création de commandes