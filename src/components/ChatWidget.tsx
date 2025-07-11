
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  message: string;
  is_customer: boolean;
  customer_name?: string;
  created_at: string;
}

const ChatWidget = () => {
  const { t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate session ID on component mount
  useEffect(() => {
    const generateSessionId = () => {
      return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };
    setSessionId(generateSessionId());
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages(prev => [...prev, newMessage]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  // Load existing messages when chat opens
  useEffect(() => {
    if (isOpen && sessionId) {
      loadMessages();
    }
  }, [isOpen, sessionId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      scrollToBottom();
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!customerName.trim()) {
      toast.error('Veuillez entrer votre nom');
      return;
    }

    setIsLoading(true);
    try {
      // Create session if it doesn't exist
      await supabase
        .from('chat_sessions')
        .upsert({
          session_id: sessionId,
          customer_name: customerName,
          is_active: true,
          updated_at: new Date().toISOString()
        });

      // Send message
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          message: newMessage,
          is_customer: true,
          customer_name: customerName,
          session_id: sessionId
        });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-80 h-96 flex flex-col border border-gold-200 dark:border-gold-800">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gold-400 to-gold-600 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8 border-2 border-white">
                <AvatarImage src="/lovable-uploads/285022db-a31d-4333-8f9d-08c7ce0263fb.png" alt="Nesrine" />
                <AvatarFallback className="bg-gold-300 text-gold-800 text-sm font-bold">N</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-white font-semibold text-sm">Nesrine Assistant</h3>
                <p className="text-gold-100 text-xs flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  En ligne
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
                  <Avatar className="h-16 w-16 mx-auto mb-2 border-4 border-gold-200">
                    <AvatarImage src="/lovable-uploads/285022db-a31d-4333-8f9d-08c7ce0263fb.png" alt="Nesrine" />
                    <AvatarFallback className="bg-gold-300 text-gold-800 text-lg font-bold">N</AvatarFallback>
                  </Avatar>
                  <p className="font-medium">Bonjour! Je suis Nesrine 👋</p>
                  <p className="text-xs mt-1">Votre assistante personnelle pour vos achats</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.is_customer ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.is_customer ? 'order-1' : 'order-2'}`}>
                    {!message.is_customer && (
                      <div className="flex items-center space-x-2 mb-1">
                        <Avatar className="h-6 w-6 border border-gold-300">
                          <AvatarImage src="/lovable-uploads/285022db-a31d-4333-8f9d-08c7ce0263fb.png" alt="Nesrine" />
                          <AvatarFallback className="bg-gold-300 text-gold-800 text-xs">N</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-gold-600 dark:text-gold-400">
                          Nesrine
                        </span>
                      </div>
                    )}
                    <div
                      className={`px-3 py-2 rounded-2xl text-sm ${
                        message.is_customer
                          ? 'bg-gold-500 text-white rounded-br-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md'
                      }`}
                    >
                      {message.message}
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${message.is_customer ? 'text-right' : 'text-left'}`}>
                      {formatTime(message.created_at)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {!customerName && (
              <div className="mb-3">
                <Input
                  placeholder="Votre nom..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="text-sm"
                />
              </div>
            )}
            <div className="flex space-x-2">
              <Input
                placeholder="Tapez votre message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isLoading}
                className="text-sm"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !newMessage.trim()}
                size="icon"
                className="bg-gold-500 hover:bg-gold-600 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
