
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
            hourly_rate: parseFloat(formData.hourly_rate) || null,
            phone: formData.phone,
            role: 'medarbejder'
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        toast({
          title: "Fejl ved oprettelse",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      if (authData.user) {
        // Wait a moment for the trigger to execute, then check if profile was created
        setTimeout(async () => {
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (!existingProfile) {
            // If trigger didn't work, create profile manually
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: authData.user.id,
                email: formData.email,
                name: formData.name,
                phone: formData.phone,
                hourly_rate: parseFloat(formData.hourly_rate) || null,
                role: 'medarbejder'
              });

            if (profileError) {
              console.error('Profile error:', profileError);
              toast({
                title: "Fejl ved profil oprettelse",
                description: profileError.message,
                variant: "destructive",
              });
              return;
            }
          } else {
            // Update profile with additional data if needed
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                phone: formData.phone,
                hourly_rate: parseFloat(formData.hourly_rate) || null
              })
              .eq('id', authData.user.id);

            if (updateError) {
              console.error('Update error:', updateError);
            }
          }

          toast({
            title: "Succes",
            description: "Medarbejder oprettet succesfuldt",
          });

          onSuccess();
          setFormData({
            name: '',
            email: '',
            phone: '',
            hourly_rate: '',
            password: ''
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
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
          placeholder="Telefonnummer"
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
