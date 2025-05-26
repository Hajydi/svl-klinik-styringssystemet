
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, X } from 'lucide-react';

interface CreateEmployeeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateEmployeeForm = ({ onSuccess, onCancel }: CreateEmployeeFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    hourly_rate: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            hourly_rate: parseFloat(formData.hourly_rate),
            role: 'medarbejder'
          }
        }
      });

      if (authError) {
        toast({
          title: "Fejl ved oprettelse",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      if (authData.user) {
        // Insert profile data
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name: formData.name,
            phone: formData.phone,
            hourly_rate: parseFloat(formData.hourly_rate),
            role: 'medarbejder'
          });

        if (profileError) {
          toast({
            title: "Fejl ved profil oprettelse",
            description: profileError.message,
            variant: "destructive",
          });
          return;
        }
      }

      onSuccess();
      setFormData({
        name: '',
        email: '',
        phone: '',
        hourly_rate: '',
        password: ''
      });
    } catch (error) {
      toast({
        title: "Uventet fejl",
        description: "Der opstod en fejl ved oprettelse af medarbejder",
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
          placeholder="Fulde navn"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div>
        <Input
          placeholder="Telefon"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <div>
        <Input
          type="number"
          placeholder="Timepris (DKK)"
          value={formData.hourly_rate}
          onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
          required
        />
      </div>
      <div>
        <Input
          type="password"
          placeholder="Midlertidig adgangskode"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      <div className="flex space-x-2">
        <Button 
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {loading ? "Opretter..." : "Opret"}
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

export default CreateEmployeeForm;
