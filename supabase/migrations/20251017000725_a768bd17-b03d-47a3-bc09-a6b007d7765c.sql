-- Ajouter une politique explicite pour bloquer l'accès public en lecture aux commandes
-- Cela protège les informations personnelles des clients (noms, adresses, téléphones)
CREATE POLICY "Block public read access to orders"
ON public.orders
FOR SELECT
TO public
USING (false);