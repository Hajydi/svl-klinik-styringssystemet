
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Plus } from 'lucide-react';

interface Booking {
  id: string;
  date: string;
  duration_minutes: number;
  price: number | null;
  notes: string | null;
  client?: {
    name: string;
  };
}

const EmployeeCalendar = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          clients (
            name
          )
        `)
        .eq('employee_id', (await supabase.auth.getUser()).data.user?.id)
        .order('date', { ascending: true });

      if (error) {
        toast({
          title: "Fejl",
          description: "Kunne ikke hente bookinger",
          variant: "destructive",
        });
      } else {
        setBookings(data || []);
      }
    } catch (error) {
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
    <div className="space-y-6">
      <Card className="shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Min Kalender</span>
          </CardTitle>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
            <Plus className="w-4 h-4 mr-2" />
            Ny Booking
          </Button>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Ingen bookinger endnu</p>
              <p className="text-sm">Dine kommende aftaler vil blive vist her</p>
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
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(booking.date).toLocaleDateString('da-DK')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{booking.duration_minutes} min</span>
                        </div>
                        {booking.price && (
                          <span className="font-medium">{booking.price} DKK</span>
                        )}
                      </div>
                      {booking.notes && (
                        <p className="text-sm text-gray-600 mt-2">{booking.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeCalendar;
