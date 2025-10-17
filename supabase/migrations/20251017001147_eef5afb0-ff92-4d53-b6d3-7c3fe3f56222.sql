-- Bloquer les insertions publiques directes dans la table orders
-- Les commandes doivent maintenant passer par l'edge function create-order qui valide les données
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;

-- Créer une nouvelle politique qui bloque toutes les insertions publiques directes
CREATE POLICY "Block direct public inserts"
ON public.orders
FOR INSERT
TO public
WITH CHECK (false);

-- Note: L'edge function create-order utilise la service_role_key et peut donc insérer des commandes
-- malgré cette politique, car elle s'exécute avec les privilèges du service