
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, User, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CreateJournalForm from './CreateJournalForm';

interface Journal {
  id: string;
  content: string | null;
  created_at: string;
  author: {
    name: string;
  } | null;
  clients: {
    name: string;
  } | null;
}

const EmployeeJournals = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  const fetchJournals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user found');
        return;
      }

      console.log('Fetching journals for user:', user.id);
      const { data, error } = await supabase
        .from('journals')
        .select(`
          id,
          content,
          created_at,
          author:profiles!journals_author_id_fkey(name),
          clients(name)
        `)
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching journals:', error);
        toast({
          title: "Fejl",
          description: "Kunne ikke hente journaler",
          variant: "destructive",
        });
      } else {
        console.log('Fetched journals:', data);
        setJournals(data || []);
      }
    } catch (error) {
      console.error('Unexpected error fetching journals:', error);
      toast({
        title: "Uventet fejl",
        description: "Der opstod en fejl ved hentning af journaler",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('da-DK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Mine Journaler</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-gray-600">Indlæser journaler...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Opret Ny Journal</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showCreateForm ? (
            <CreateJournalForm 
              onSuccess={() => {
                setShowCreateForm(false);
                fetchJournals();
              }}
              onCancel={() => setShowCreateForm(false)}
            />
          ) : (
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Ny Journal
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Mine Journaler ({journals.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {journals.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Ingen journaler endnu</p>
              <p className="text-gray-500">Opret din første journal for at komme i gang</p>
            </div>
          ) : (
            <div className="space-y-4">
              {journals.map((journal) => (
                <div
                  key={journal.id}
                  className="bg-gradient-to-r from-white to-blue-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-4">
                      {journal.clients && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>Klient: {journal.clients.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(journal.created_at)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded border">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {journal.content || 'Ingen indhold tilgængeligt'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeJournals;
