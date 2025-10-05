-- Sécuriser la table chat_messages contre l'accès public
-- Étape 1: S'assurer que RLS est activé
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Étape 2: Bloquer l'accès public en lecture
-- Cette policy bloque explicitement toute lecture publique non autorisée
CREATE POLICY "Block public access to chat messages"
ON public.chat_messages
FOR SELECT
USING (false);

-- Étape 3: Permettre aux administrateurs authentifiés de voir tous les messages
-- Note: Cette policy nécessitera l'implémentation de l'authentification admin
-- Pour l'instant, elle bloque tout accès jusqu'à ce que l'auth soit en place
CREATE POLICY "Admin can view all chat messages"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (
  -- TODO: Remplacer par has_role(auth.uid(), 'admin') une fois le système de rôles implémenté
  false  -- Temporairement désactivé jusqu'à l'implémentation de l'authentification
);

-- Étape 4: Sécuriser aussi chat_sessions
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Bloquer l'accès public en lecture aux sessions
CREATE POLICY "Block public access to chat sessions"
ON public.chat_sessions
FOR SELECT
USING (false);

-- Permettre aux admins de voir toutes les sessions
CREATE POLICY "Admin can view all chat sessions"
ON public.chat_sessions
FOR SELECT
TO authenticated
USING (
  -- TODO: Remplacer par has_role(auth.uid(), 'admin') une fois le système de rôles implémenté
  false  -- Temporairement désactivé jusqu'à l'implémentation de l'authentification
);