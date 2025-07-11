
-- Drop and recreate the function with a secure search_path
DROP FUNCTION IF EXISTS public.auto_respond_to_chat();

CREATE OR REPLACE FUNCTION public.auto_respond_to_chat()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  auto_responses TEXT[] := ARRAY[
    'Bonjour! Je suis Nesrine, votre assistante virtuelle. Comment puis-je vous aider avec vos achats aujourd''hui? 💎',
    'Merci pour votre message! Je suis là pour vous aider à choisir parmi nos magnifiques sacs et bijoux. Que recherchez-vous? ✨',
    'Parfait! Laissez-moi vous guider dans votre sélection. Avez-vous une préférence pour les sacs ou les bijoux? 👜💍'
  ];
  response_text TEXT;
BEGIN
  -- Only respond to customer messages, not admin messages
  IF NEW.is_customer = true THEN
    -- Select a random response
    response_text := auto_responses[floor(random() * array_length(auto_responses, 1) + 1)];
    
    -- Insert auto-response after a short delay
    INSERT INTO public.chat_messages (message, is_customer, session_id, customer_name)
    VALUES (response_text, false, NEW.session_id, 'Nesrine Assistant');
  END IF;
  
  RETURN NEW;
END;
$$;
