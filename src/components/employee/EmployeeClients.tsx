
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Users, User, Mail, Plus, Trash2 } from 'lucide-react';
import CreateClientForm from './CreateClientForm';

interface Client {
  id: string;
  name: string;
  email: string | null;
  assigned_to: string | null;
  created_by: string | null;
}

const EmployeeClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('assigned_to', user.id)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching clients:', error);
        toast({
          title: "Fejl",
          description: "Kunne ikke hente klienter",
          variant: "destructive",
        });
      } else {
        setClients(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Uventet fejl",
        description: "Der opstod en fejl ved hentning af klienter",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const deleteClient = async (clientId: string) => {
    if (!confirm('Er du sikker på, at du vil slette denne klient?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) {
        toast({
          title: "Fejl",
          description: "Kunne ikke slette klient",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succes",
          description: "Klient slettet succesfuldt",
        });
        fetchClients();
      }
    } catch (error) {
      toast({
        title: "Uventet fejl",
        description: "Der opstod en fejl ved sletning",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-8 text-center">
          <div className="text-lg">Indlæser klienter...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Users className="w-5 h-5 text-green-600" />
            <span>Opret Ny Klient</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showCreateForm ? (
            <CreateClientForm 
              onSuccess={() => {
                setShowCreateForm(false);
                fetchClients();
              }}
              onCancel={() => setShowCreateForm(false)}
            />
          ) : (
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Ny Klient
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Mine Klienter ({clients.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Ingen klienter endnu</p>
              <p className="text-sm">Opret den første klient for at komme i gang</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clients.map((client) => (
                <Card key={client.id} className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{client.name}</h3>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          {client.email && (
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span>{client.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteClient(client.id)}
                        className="text-red-600 hover:text-red-700 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

export default EmployeeClients;
