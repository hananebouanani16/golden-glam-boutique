-- Correction des politiques dupliquées et finalisation de la sécurité

-- Supprimer la politique INSERT dupliquée pour orders
DROP POLICY IF EXISTS "Allow public order creation" ON public.orders;

-- Vérifier que les autres politiques sont bien en place
-- La politique "Public can create orders" permet à tout le monde de créer une commande (nécessaire pour le checkout)
-- Les politiques "Admins can view/update/delete orders" restreignent l'accès aux admins uniquement

-- Note: Les politiques sont déjà en place, cette migration nettoie juste les doublons