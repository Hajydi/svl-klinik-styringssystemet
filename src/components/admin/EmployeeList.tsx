
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, DollarSign, Trash2, Edit } from 'lucide-react';

interface Profile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  hourly_rate: number | null;
  role: string | null;
}

interface EmployeeListProps {
  employees: Profile[];
  onEmployeeUpdated: () => void;
}

const EmployeeList = ({ onEmployeeUpdated }: EmployeeListProps) => {
  const [employees, setEmployees] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('role', 'admin')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching employees:', error);
        toast({
          title: "Fejl",
          description: "Kunne ikke hente medarbejdere",
          variant: "destructive",
        });
      } else {
        setEmployees(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Uventet fejl",
        description: "Der opstod en fejl ved hentning af medarbejdere",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [onEmployeeUpdated]);

  const deleteEmployee = async (employeeId: string) => {
    if (!confirm('Er du sikker på, at du vil slette denne medarbejder?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', employeeId);

      if (error) {
        toast({
          title: "Fejl",
          description: "Kunne ikke slette medarbejder",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succes",
          description: "Medarbejder slettet succesfuldt",
        });
        fetchEmployees();
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
          <div className="text-lg">Indlæser medarbejdere...</div>
        </CardContent>
      </Card>
    );
  }

  if (employees.length === 0) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <span>Medarbejdere</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Ingen medarbejdere endnu</p>
            <p className="text-sm">Opret den første medarbejder for at komme i gang</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5 text-blue-600" />
          <span>Medarbejdere ({employees.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {employees.map((employee) => (
            <Card key={employee.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {employee.name || 'Ukendt navn'}
                        </h3>
                        <p className="text-sm text-gray-600">{employee.email}</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {employee.role === 'medarbejder' ? 'Medarbejder' : employee.role}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      {employee.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{employee.phone}</span>
                        </div>
                      )}
                      {employee.hourly_rate && (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4" />
                          <span>{employee.hourly_rate} DKK/time</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteEmployee(employee.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeList;
