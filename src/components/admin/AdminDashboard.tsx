
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, LogOut } from 'lucide-react';
import CreateEmployeeForm from './CreateEmployeeForm';
import EmployeeList from './EmployeeList';

interface Profile {
  id: string;
  name: string | null;
  phone: string | null;
  hourly_rate: number | null;
  role: string | null;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [employees, setEmployees] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'medarbejder');

      if (error) {
        toast({
          title: "Fejl",
          description: "Kunne ikke hente medarbejdere",
          variant: "destructive",
        });
      } else {
        setEmployees(data || []);
      }
    } catch (error) {
      toast({
        title: "Uventet fejl",
        description: "Der opstod en fejl ved hentning af data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const handleEmployeeCreated = () => {
    setShowCreateForm(false);
    fetchEmployees();
    toast({
      title: "Succes!",
      description: "Ny medarbejder er oprettet",
    });
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SVL Sportsterapi</h1>
                <p className="text-sm text-gray-600">Admin Dashboard</p>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Plus className="w-5 h-5 text-blue-600" />
                  <span>Opret Ny Medarbejder</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showCreateForm ? (
                  <CreateEmployeeForm 
                    onSuccess={handleEmployeeCreated}
                    onCancel={() => setShowCreateForm(false)}
                  />
                ) : (
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 hover:scale-105"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Tilføj Medarbejder
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Medarbejdere ({employees.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EmployeeList 
                  employees={employees} 
                  onEmployeeUpdated={fetchEmployees}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
