-- Ajouter un champ pour tracker si la commande a été envoyée à ZR Express
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS sent_to_zr_express BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS zr_express_response JSONB DEFAULT NULL;