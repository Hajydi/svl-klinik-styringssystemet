
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FileText, X } from 'lucide-react';

interface CreateJournalFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface Client {
  id: string;
  name: string;
}

const CreateJournalForm = ({ onSuccess, onCancel }: CreateJournalFormProps) => {
  const [formData, setFormData] = useState({
    content: '',
    client_id: ''
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAssignedClients();
  }, []);

  const fetchAssignedClients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .eq('assigned_to', user.id)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching clients:', error);
      } else {
        setClients(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('journals')
        .insert({
          content: formData.content,
          client_id: formData.client_id || null
        });

      if (error) {
        console.error('Error creating journal:', error);
        toast({
          title: "Fejl ved oprettelse",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succes",
          description: "Journal oprettet succesfuldt",
        });

        onSuccess();
        setFormData({
          content: '',
          client_id: ''
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Uventet fejl",
        description: "Der opstod en fejl ved oprettelse af journal",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Select value={formData.client_id} onValueChange={(value) => setFormData({ ...formData, client_id: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Vælg klient (valgfri)" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Textarea
          placeholder="Skriv journal indhold..."
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="min-h-32"
          required
        />
      </div>
      <div className="flex space-x-2">
        <Button 
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          <FileText className="w-4 h-4 mr-2" />
          {loading ? "Opretter..." : "Opret Journal"}
        </Button>
        <Button 
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};

export default CreateJournalForm;
