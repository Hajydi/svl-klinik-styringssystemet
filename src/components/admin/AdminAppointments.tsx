
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Plus, Clock, User, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

interface Appointment {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  status: string;
  client_id: string;
  employee_id: string;
  profiles: {
    name: string;
  };
  clients?: {
    name: string;
  };
}

interface Employee {
  id: string;
  name: string;
}

interface Client {
  id: string;
  name: string;
}

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    client_id: '',
    employee_id: '',
    status: 'scheduled'
  });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          profiles:employee_id (
            name
          ),
          clients:client_id (
            name
          )
        `)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
      } else {
        setAppointments(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name')
        .neq('role', 'admin')
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

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching clients:', error);
      } else {
        setClients(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchEmployees();
    fetchClients();
  }, []);

  const createAppointment = async () => {
    if (!formData.title || !formData.start_time || !formData.end_time || !formData.employee_id) {
      toast({
        title: "Manglende felter",
        description: "Udfyld alle påkrævede felter",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          title: formData.title,
          description: formData.description || null,
          start_time: formData.start_time,
          end_time: formData.end_time,
          client_id: formData.client_id || null,
          employee_id: formData.employee_id,
          status: formData.status,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) {
        toast({
          title: "Fejl",
          description: "Kunne ikke oprette aftale",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succes",
          description: "Aftale oprettet succesfuldt",
        });
        setFormData({
          title: '',
          description: '',
          start_time: '',
          end_time: '',
          client_id: '',
          employee_id: '',
          status: 'scheduled'
        });
        setShowCreateForm(false);
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Fejl",
        description: "Der opstod en fejl",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-8 text-center">
          <div className="text-lg">Indlæser aftaler...</div>
        </CardContent>
      </Card>
    );
  }

  const upcomingAppointments = appointments.filter(
    app => new Date(app.start_time) > new Date()
  );

  const todayAppointments = appointments.filter(
    app => format(new Date(app.start_time), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-400/80 to-indigo-500/80 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">I dag</p>
                <p className="text-2xl font-bold mt-1">{todayAppointments.length}</p>
              </div>
              <Calendar className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-400/80 to-emerald-500/80 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Kommende</p>
                <p className="text-2xl font-bold mt-1">{upcomingAppointments.length}</p>
              </div>
              <Clock className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-400/80 to-pink-500/80 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Total</p>
                <p className="text-2xl font-bold mt-1">{appointments.length}</p>
              </div>
              <MapPin className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Plus className="w-5 h-5 text-blue-600" />
              <span>Ny Aftale</span>
            </CardTitle>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              variant="outline"
            >
              {showCreateForm ? 'Annuller' : 'Opret Aftale'}
            </Button>
          </div>
        </CardHeader>
        {showCreateForm && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Titel"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Select value={formData.employee_id} onValueChange={(value) => setFormData({ ...formData, employee_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Vælg medarbejder" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Planlagt</SelectItem>
                  <SelectItem value="completed">Fuldført</SelectItem>
                  <SelectItem value="cancelled">Aflyst</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="datetime-local"
                placeholder="Start tid"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              />
              <Input
                type="datetime-local"
                placeholder="Slut tid"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              />
            </div>
            <Textarea
              placeholder="Beskrivelse (valgfri)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
            <Button
              onClick={createAppointment}
              disabled={creating}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {creating ? "Opretter..." : "Opret Aftale"}
            </Button>
          </CardContent>
        )}
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Alle Aftaler</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Ingen aftaler endnu</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{appointment.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            appointment.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : appointment.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {appointment.status === 'scheduled' ? 'Planlagt' : 
                             appointment.status === 'completed' ? 'Fuldført' : 'Aflyst'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{appointment.profiles?.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {format(new Date(appointment.start_time), 'dd. MMM yyyy HH:mm', { locale: da })}
                            </span>
                          </div>
                          {appointment.clients && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>{appointment.clients.name}</span>
                            </div>
                          )}
                        </div>
                        
                        {appointment.description && (
                          <p className="text-gray-700 text-sm">{appointment.description}</p>
                        )}
                      </div>
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

export default AdminAppointments;
