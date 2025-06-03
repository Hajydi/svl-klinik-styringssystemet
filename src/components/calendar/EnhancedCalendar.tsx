
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, User, MapPin, Filter, Plus } from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';
import { da } from 'date-fns/locale';

interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  client_name?: string;
  employee_name?: string;
  status: string;
  type: 'appointment' | 'booking';
}

const EnhancedCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'appointments' | 'bookings'>('all');
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      // Fetch appointments with explicit joins to avoid ambiguity
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          id,
          title,
          start_time,
          end_time,
          status,
          employee_profiles:profiles!appointments_employee_id_fkey (name),
          client_profiles:clients!appointments_client_id_fkey (name)
        `)
        .order('start_time', { ascending: true });

      // Fetch bookings with explicit joins
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          date,
          duration_minutes,
          employee_profiles:profiles!bookings_employee_id_fkey (name),
          client_profiles:clients!bookings_client_id_fkey (name)
        `)
        .order('date', { ascending: true });

      if (appointmentsError || bookingsError) {
        console.error('Error fetching events:', appointmentsError || bookingsError);
        toast({
          title: "Fejl",
          description: "Kunne ikke hente kalender data",
          variant: "destructive",
        });
        return;
      }

      const allEvents: CalendarEvent[] = [
        ...(appointments || []).map(apt => ({
          id: apt.id,
          title: apt.title,
          start_time: apt.start_time,
          end_time: apt.end_time,
          client_name: apt.client_profiles?.name,
          employee_name: apt.employee_profiles?.name,
          status: apt.status,
          type: 'appointment' as const
        })),
        ...(bookings || []).map(booking => ({
          id: booking.id,
          title: `Booking - ${booking.client_profiles?.name || 'Ukendt klient'}`,
          start_time: booking.date,
          end_time: new Date(new Date(booking.date).getTime() + booking.duration_minutes * 60000).toISOString(),
          client_name: booking.client_profiles?.name,
          employee_name: booking.employee_profiles?.name,
          status: 'scheduled',
          type: 'booking' as const
        }))
      ];

      setEvents(allEvents);
      setFilteredEvents(allEvents);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Uventet fejl",
        description: "Der opstod en fejl ved hentning af kalender data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;
    if (filter !== 'all') {
      filtered = events.filter(event => event.type === filter.slice(0, -1));
    }
    setFilteredEvents(filtered);
  }, [events, filter]);

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => 
      isSameDay(parseISO(event.start_time), date)
    );
  };

  const todayEvents = getEventsForDate(new Date());
  const selectedDateEvents = getEventsForDate(selectedDate);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (loading) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-8 text-center">
          <div className="text-lg">Indlæser kalender...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">I dag</p>
                <p className="text-2xl font-bold">{todayEvents.length}</p>
              </div>
              <Calendar className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Aftaler</p>
                <p className="text-2xl font-bold">
                  {events.filter(e => e.type === 'appointment').length}
                </p>
              </div>
              <User className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Bookinger</p>
                <p className="text-2xl font-bold">
                  {events.filter(e => e.type === 'booking').length}
                </p>
              </div>
              <Clock className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
              <MapPin className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Kalender</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarUI
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              locale={da}
            />
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">Filter:</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  Alle
                </Button>
                <Button
                  variant={filter === 'appointments' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('appointments')}
                >
                  Aftaler
                </Button>
                <Button
                  variant={filter === 'bookings' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('bookings')}
                >
                  Bookinger
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Events */}
        <Card className="lg:col-span-2 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>
                  {format(selectedDate, 'EEEE d. MMMM yyyy', { locale: da })}
                </span>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Ny
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Ingen arrangementer på denne dag</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <Card key={event.id} className={`border-l-4 ${
                    event.type === 'appointment' ? 'border-l-blue-500' : 'border-l-purple-500'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{event.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(event.status)}`}>
                              {event.status === 'scheduled' ? 'Planlagt' : 
                               event.status === 'completed' ? 'Fuldført' : 'Aflyst'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>
                                {format(parseISO(event.start_time), 'HH:mm')} - 
                                {format(parseISO(event.end_time), 'HH:mm')}
                              </span>
                            </div>
                            {event.employee_name && (
                              <div className="flex items-center space-x-2">
                                <User className="w-4 h-4" />
                                <span>{event.employee_name}</span>
                              </div>
                            )}
                            {event.client_name && (
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>{event.client_name}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                event.type === 'appointment' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {event.type === 'appointment' ? 'Aftale' : 'Booking'}
                              </span>
                            </div>
                          </div>
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
    </div>
  );
};

export default EnhancedCalendar;
