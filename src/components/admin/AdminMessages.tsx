
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Send, User, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { da } from 'date-fns/locale';

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  profiles: {
    name: string;
  };
}

interface Employee {
  id: string;
  name: string;
  email: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles:sender_id (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email')
        .neq('role', 'admin')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching employees:', error);
      } else {
        setEmployees(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchEmployees();
  }, []);

  const sendMessage = async () => {
    if (!messageContent.trim() || !selectedEmployee) return;

    setSending(true);
    try {
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          content: messageContent,
          sender_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (messageError) {
        toast({
          title: "Fejl",
          description: "Kunne ikke sende besked",
          variant: "destructive",
        });
        return;
      }

      // Get the created message ID
      const { data: newMessage } = await supabase
        .from('messages')
        .select('id')
        .eq('content', messageContent)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (newMessage) {
        // Add recipient
        const { error: recipientError } = await supabase
          .from('message_recipients')
          .insert({
            message_id: newMessage.id,
            recipient_id: selectedEmployee
          });

        if (recipientError) {
          console.error('Error adding recipient:', recipientError);
        }
      }

      toast({
        title: "Succes",
        description: "Besked sendt succesfuldt",
      });

      setMessageContent('');
      setSelectedEmployee('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Fejl",
        description: "Der opstod en fejl ved afsendelse",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-8 text-center">
          <div className="text-lg">Indlæser beskeder...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>Send Besked</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Vælg medarbejder...</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} ({employee.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <Textarea
              placeholder="Skriv din besked her..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <Button
            onClick={sendMessage}
            disabled={sending || !messageContent.trim() || !selectedEmployee}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Send className="w-4 h-4 mr-2" />
            {sending ? "Sender..." : "Send Besked"}
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>Sendte Beskeder</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Ingen beskeder endnu</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          {message.profiles?.name || 'Ukendt'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(message.created_at), {
                            addSuffix: true,
                            locale: da
                          })}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700">{message.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMessages;
