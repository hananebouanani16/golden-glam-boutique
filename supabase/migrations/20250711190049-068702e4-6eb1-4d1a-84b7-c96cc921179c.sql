
-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  is_customer BOOLEAN NOT NULL DEFAULT true,
  customer_name TEXT,
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat sessions table to track active conversations
CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  customer_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is for customer support)
CREATE POLICY "Anyone can read chat messages" ON public.chat_messages
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert chat messages" ON public.chat_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read chat sessions" ON public.chat_sessions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert chat sessions" ON public.chat_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update chat sessions" ON public.chat_sessions
  FOR UPDATE USING (true);

-- Enable realtime for chat messages
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.chat_sessions REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_sessions;

-- Function to automatically respond to customer messages (simple auto-responder)
CREATE OR REPLACE FUNCTION public.auto_respond_to_chat()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger for auto-response
CREATE TRIGGER auto_respond_trigger
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_respond_to_chat();
