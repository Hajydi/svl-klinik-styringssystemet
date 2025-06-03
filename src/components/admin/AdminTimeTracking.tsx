
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Clock, Plus, Calendar, DollarSign, User } from 'lucide-react';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

interface TimeEntry {
  id: string;
  hours_worked: number;
  hourly_rate: number;
  total_amount: number;
  work_date: string;
  description: string;
  is_paid: boolean;
  profiles: {
    name: string;
  };
}

interface Employee {
  id: string;
  name: string;
  hourly_rate: number;
}

const AdminTimeTracking = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [hours, setHours] = useState('');
  const [workDate, setWorkDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  const fetchTimeEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select(`
          *,
          profiles:employee_id (
            name
          )
        `)
        .order('work_date', { ascending: false });

      if (error) {
        console.error('Error fetching time entries:', error);
      } else {
        setTimeEntries(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, hourly_rate')
        .neq('role', 'admin')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching employees:', error);
      } else {
        setEmployees(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeEntries();
    fetchEmployees();
  }, []);

  const createTimeEntry = async () => {
    if (!selectedEmployee || !hours || !workDate) return;

    const employee = employees.find(e => e.id === selectedEmployee);
    if (!employee) return;

    setCreating(true);
    try {
      const { error } = await supabase
        .from('time_entries')
        .insert({
          employee_id: selectedEmployee,
          hours_worked: parseFloat(hours),
          hourly_rate: employee.hourly_rate || 0,
          work_date: workDate,
          description: description || null
        });

      if (error) {
        toast({
          title: "Fejl",
          description: "Kunne ikke oprette tidsregistrering",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succes",
          description: "Tidsregistrering oprettet succesfuldt",
        });
        setSelectedEmployee('');
        setHours('');
        setDescription('');
        setWorkDate(format(new Date(), 'yyyy-MM-dd'));
        fetchTimeEntries();
      }
    } catch (error) {
      console.error('Error creating time entry:', error);
      toast({
        title: "Fejl",
        description: "Der opstod en fejl",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const markAsPaid = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('time_entries')
        .update({ 
          is_paid: true,
          paid_at: new Date().toISOString()
        })
        .eq('id', entryId);

      if (error) {
        toast({
          title: "Fejl",
          description: "Kunne ikke markere som betalt",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succes",
          description: "Markeret som betalt",
        });
        fetchTimeEntries();
      }
    } catch (error) {
      console.error('Error marking as paid:', error);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-8 text-center">
          <div className="text-lg">Indlæser tidsregistreringer...</div>
        </CardContent>
      </Card>
    );
  }

  const totalUnpaid = timeEntries
    .filter(entry => !entry.is_paid)
    .reduce((sum, entry) => sum + (entry.total_amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-400/80 to-emerald-500/80 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Ubetalte Timer</p>
                <p className="text-2xl font-bold mt-1">
                  {timeEntries.filter(e => !e.is_paid).reduce((sum, e) => sum + e.hours_worked, 0)} timer
                </p>
              </div>
              <Clock className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-400/80 to-indigo-500/80 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Ubetalt Løn</p>
                <p className="text-2xl font-bold mt-1">{totalUnpaid.toFixed(2)} DKK</p>
              </div>
              <DollarSign className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-400/80 to-pink-500/80 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Total Registreringer</p>
                <p className="text-2xl font-bold mt-1">{timeEntries.length}</p>
              </div>
              <Calendar className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Plus className="w-5 h-5 text-blue-600" />
            <span>Tilføj Tidsregistrering</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Vælg medarbejder" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} ({employee.hourly_rate || 0} DKK/time)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                type="number"
                step="0.5"
                placeholder="Antal timer"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="date"
                value={workDate}
                onChange={(e) => setWorkDate(e.target.value)}
              />
            </div>
            <div>
              <Input
                placeholder="Beskrivelse (valgfri)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={createTimeEntry}
            disabled={creating || !selectedEmployee || !hours}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            {creating ? "Opretter..." : "Tilføj Tidsregistrering"}
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Alle Tidsregistreringer</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {timeEntries.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Ingen tidsregistreringer endnu</p>
            </div>
          ) : (
            <div className="space-y-4">
              {timeEntries.map((entry) => (
                <Card key={entry.id} className={`border-l-4 ${entry.is_paid ? 'border-l-green-500' : 'border-l-orange-500'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{entry.profiles?.name}</span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(entry.work_date), 'dd. MMM yyyy', { locale: da })}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Timer:</span>
                            <span className="ml-1 font-medium">{entry.hours_worked}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Timepris:</span>
                            <span className="ml-1 font-medium">{entry.hourly_rate} DKK</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Total:</span>
                            <span className="ml-1 font-medium">{entry.total_amount} DKK</span>
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              entry.is_paid 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {entry.is_paid ? 'Betalt' : 'Ubetalt'}
                            </span>
                          </div>
                        </div>
                        {entry.description && (
                          <p className="text-sm text-gray-600 mt-2">{entry.description}</p>
                        )}
                      </div>
                      {!entry.is_paid && (
                        <Button
                          onClick={() => markAsPaid(entry.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Marker som betalt
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTimeTracking;
