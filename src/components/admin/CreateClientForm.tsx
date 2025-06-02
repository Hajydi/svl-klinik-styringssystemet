
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, X } from 'lucide-react';

interface CreateClientFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface Employee {
  id: string;
  name: string;
  email: string;
}

const CreateClientForm = ({ onSuccess, onCancel }: CreateClientFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    assigned_to: ''
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email')
        .eq('role', 'medarbejder')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching employees:', error);
      } else {
        setEmployees(data || []);
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
        .from('clients')
        .insert({
          name: formData.name,
          email: formData.email || null,
          assigned_to: formData.assigned_to || null
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
          email: '',
          assigned_to: ''
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
      <div>
        <Select value={formData.assigned_to} onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Tildel til medarbejder (valgfri)" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name} ({employee.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
