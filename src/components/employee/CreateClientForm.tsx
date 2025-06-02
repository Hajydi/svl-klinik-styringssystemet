
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, X } from 'lucide-react';

interface CreateClientFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateClientForm = ({ onSuccess, onCancel }: CreateClientFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Fejl",
          description: "Du skal være logget ind for at oprette klienter",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('clients')
        .insert({
          name: formData.name,
          email: formData.email || null,
          assigned_to: user.id
        });

      if (error) {
        console.error('Error creating client:', error);
        toast({
          title: "Fejl ved oprettelse",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succes",
          description: "Klient oprettet succesfuldt",
        });

        onSuccess();
        setFormData({
          name: '',
          email: ''
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Uventet fejl",
        description: "Der opstod en fejl ved oprettelse af klient",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Klient navn"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Input
          type="email"
          placeholder="Email (valgfri)"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div className="flex space-x-2">
        <Button 
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {loading ? "Opretter..." : "Opret Klient"}
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

export default CreateClientForm;
