
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, DollarSign, LogOut } from 'lucide-react';

interface Profile {
  id: string;
  name: string | null;
  phone: string | null;
  hourly_rate: number | null;
  role: string | null;
}

interface EmployeeProfileProps {
  onLogout: () => void;
}

const EmployeeProfile = ({ onLogout }: EmployeeProfileProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            toast({
              title: "Fejl",
              description: "Kunne ikke hente profil data",
              variant: "destructive",
            });
          } else {
            setProfile(data);
          }
        }
      } catch (error) {
        toast({
          title: "Uventet fejl",
          description: "Der opstod en fejl ved hentning af profil",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Indlæser...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SVL Sportsterapi</h1>
                <p className="text-sm text-gray-600">Min Profil</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log ud</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {profile?.name || 'Velkommen'}
            </CardTitle>
            <p className="text-gray-600">Medarbejder</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-3 mb-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Navn</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  {profile?.name || 'Ikke angivet'}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-3 mb-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Telefon</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  {profile?.phone || 'Ikke angivet'}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border md:col-span-2">
                <div className="flex items-center space-x-3 mb-3">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Timepris</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  {profile?.hourly_rate ? `${profile.hourly_rate} DKK/time` : 'Ikke angivet'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EmployeeProfile;
