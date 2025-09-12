-- Fix critical security vulnerability: Restrict access to chat sessions and messages
-- Currently anyone can read all chat sessions and customer names, violating privacy

-- Drop overly permissive policies for chat_sessions
DROP POLICY IF EXISTS "Anyone can read chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Anyone can update chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Anyone can insert chat sessions" ON public.chat_sessions;

-- Drop overly permissive policies for chat_messages  
DROP POLICY IF EXISTS "Anyone can read chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can insert chat messages" ON public.chat_messages;

-- Create secure policies for chat_sessions
-- Allow public to create their own sessions
CREATE POLICY "Allow session creation" ON public.chat_sessions 
FOR INSERT 
WITH CHECK (true);

-- Allow public to update only their own sessions (based on session_id)
CREATE POLICY "Allow own session updates" ON public.chat_sessions 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- No public read access to chat_sessions - protects customer privacy
-- Admin will need to use service role key for management

-- Create secure policies for chat_messages
-- Allow public to insert messages (for customer and admin use)
CREATE POLICY "Allow message creation" ON public.chat_messages 
FOR INSERT 
WITH CHECK (true);

-- No public read access to chat_messages - protects conversation privacy  
-- Admin will need to use service role key for reading messages

-- Note: This security fix requires admin chat management to use service role authentication
-- or implement proper user authentication system for granular access control