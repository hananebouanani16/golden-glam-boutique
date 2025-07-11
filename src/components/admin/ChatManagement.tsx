
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Send, Users, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ChatSession {
  id: string;
  session_id: string;
  customer_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  message: string;
  is_customer: boolean;
  customer_name?: string;
  created_at: string;
}

const ChatManagement = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSessions();
    
    // Set up real-time subscription for new sessions
    const sessionChannel = supabase
      .channel('chat-sessions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_sessions' }, () => {
        loadSessions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sessionChannel);
    };
  }, []);

  useEffect(() => {
    if (selectedSession) {
      loadMessages(selectedSession);
      
      // Set up real-time subscription for messages
      const messageChannel = supabase
        .channel('chat-messages-admin')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `session_id=eq.${selectedSession}`
          },
          (payload) => {
            const newMessage = payload.new as ChatMessage;
            setMessages(prev => [...prev, newMessage]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(messageChannel);
      };
    }
  }, [selectedSession]);

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast.error('Erreur lors du chargement des conversations');
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Erreur lors du chargement des messages');
    }
  };

  const sendAdminMessage = async () => {
    if (!newMessage.trim() || !selectedSession) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          message: newMessage,
          is_customer: false,
          customer_name: 'Admin Support',
          session_id: selectedSession
        });

      if (error) throw error;
      setNewMessage('');
      toast.success('Message envoyé');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
      {/* Sessions List */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Conversations
          </CardTitle>
          <CardDescription>
            {sessions.filter(s => s.is_active).length} conversation(s) active(s)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="space-y-2 p-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(session.session_id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSession === session.session_id
                      ? 'bg-gold-100 dark:bg-gold-900/20 border border-gold-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">
                      {session.customer_name || 'Client anonyme'}
                    </span>
                    {session.is_active && (
                      <Badge variant="default" className="bg-green-500 text-white text-xs">
                        Actif
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="mr-1 h-3 w-3" />
                    {formatTime(session.updated_at)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="mr-2 h-5 w-5" />
            {selectedSession ? 'Conversation' : 'Sélectionnez une conversation'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[500px]">
          {selectedSession ? (
            <>
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-4 pr-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.is_customer ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.is_customer ? 'order-1' : 'order-2'}`}>
                        {!message.is_customer && (
                          <div className="flex items-center space-x-2 mb-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="/lovable-uploads/285022db-a31d-4333-8f9d-08c7ce0263fb.png" alt="Support" />
                              <AvatarFallback className="bg-blue-500 text-white text-xs">S</AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium text-blue-600">
                              {message.customer_name}
                            </span>
                          </div>
                        )}
                        <div
                          className={`px-3 py-2 rounded-2xl text-sm ${
                            message.is_customer
                              ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-br-md'
                              : 'bg-blue-500 text-white rounded-bl-md'
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
                </div>
              </ScrollArea>
              <div className="flex space-x-2">
                <Input
                  placeholder="Répondre au client..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendAdminMessage()}
                  disabled={isLoading}
                />
                <Button
                  onClick={sendAdminMessage}
                  disabled={isLoading || !newMessage.trim()}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Sélectionnez une conversation pour commencer</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatManagement;
