
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Users } from 'lucide-react';

interface Booking {
  id: string;
  date: string;
  duration_minutes: number;
  price: number | null;
  employee?: {
    name: string;
  };
  client?: {
    name: string;
  };
}

const AdminCalendar = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles!bookings_employee_id_fkey (
            name
          ),
          clients (
            name
          )
        `)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: "Fejl",
          description: "Kunne ikke hente bookinger",
          variant: "destructive",
        });
      } else {
        setBookings(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Uventet fejl",
        description: "Der opstod en fejl ved hentning af bookinger",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

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
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span>Alle Bookinger ({bookings.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Ingen bookinger endnu</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-l-4 border-l-blue-500 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {booking.client?.name || 'Ukendt klient'}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>{new Date(booking.date).toLocaleDateString('da-DK')}</span>
                      <span>{booking.duration_minutes} min</span>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{booking.employee?.name || 'Ukendt medarbejder'}</span>
                      </div>
                    </div>
                  </div>
                  {booking.price && (
                    <span className="font-medium text-lg text-green-600">
                      {booking.price} DKK
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminCalendar;
