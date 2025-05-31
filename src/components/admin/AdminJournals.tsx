
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FileText, User } from 'lucide-react';

interface Journal {
  id: string;
  content: string;
  created_at: string;
  clients?: {
    name: string;
  };
  author?: {
    name: string;
  };
}

const AdminJournals = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchJournals = async () => {
    try {
      const { data, error } = await supabase
        .from('journals')
        .select('id, content, created_at, author_id, clients(name), author:profiles(name)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching journals:', error);
        toast({
          title: "Fejl",
          description: "Kunne ikke hente journaler",
          variant: "destructive",
        });
        setJournals([]);
      } else {
        // Handle the data properly with the new author alias
        const validJournals: Journal[] = (data || []).map(journal => ({
          id: journal.id,
          content: journal.content,
          created_at: journal.created_at,
          clients: journal.clients,
          author: journal.author
        }));
        setJournals(validJournals);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Uventet fejl",
        description: "Der opstod en fejl ved hentning af journaler",
        variant: "destructive",
      });
      setJournals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  if (loading) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-8 text-center">
          <div className="text-lg">Indlæser journaler...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span>Alle Journaler ({journals.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {journals.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Ingen journaler endnu</p>
          </div>
        ) : (
          <div className="space-y-4">
            {journals.map((journal) => (
              <Card key={journal.id} className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {journal.clients?.name || 'Ukendt klient'}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Af: {journal.author?.name || 'Ukendt'} • {new Date(journal.created_at).toLocaleDateString('da-DK')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{journal.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminJournals;
