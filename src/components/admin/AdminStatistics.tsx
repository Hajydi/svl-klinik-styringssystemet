
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

interface Statistics {
  totalClients: number;
  totalBookings: number;
  totalRevenue: number;
  totalEmployees: number;
}

const AdminStatistics = () => {
  const [stats, setStats] = useState<Statistics>({
    totalClients: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalEmployees: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStatistics = async () => {
    try {
      // Fetch clients count
      const { count: clientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });

      // Fetch bookings count and total revenue
      const { data: bookingsData, count: bookingsCount } = await supabase
        .from('bookings')
        .select('price', { count: 'exact' });

      // Fetch employees count
      const { count: employeesCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'medarbejder');

      const totalRevenue = bookingsData?.reduce((sum, booking) => sum + (booking.price || 0), 0) || 0;

      setStats({
        totalClients: clientsCount || 0,
        totalBookings: bookingsCount || 0,
        totalRevenue,
        totalEmployees: employeesCount || 0,
      });
    } catch (error) {
      toast({
        title: "Fejl",
        description: "Kunne ikke hente statistik",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-8 text-center">
          <div className="text-lg">Indlæser statistik...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Klienter</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalClients}</p>
              </div>
              <Users className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookinger</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalBookings}</p>
              </div>
              <BarChart3 className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Omsætning</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.totalRevenue.toLocaleString('da-DK')} DKK
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Medarbejdere</p>
                <p className="text-3xl font-bold text-orange-600">{stats.totalEmployees}</p>
              </div>
              <Users className="w-10 h-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Klinik Oversigt</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Nøgletal</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gennemsnitlig booking værdi:</span>
                  <span className="font-medium">
                    {stats.totalBookings > 0 
                      ? Math.round(stats.totalRevenue / stats.totalBookings).toLocaleString('da-DK')
                      : 0
                    } DKK
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bookinger per medarbejder:</span>
                  <span className="font-medium">
                    {stats.totalEmployees > 0 
                      ? Math.round(stats.totalBookings / stats.totalEmployees)
                      : 0
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Klienter per medarbejder:</span>
                  <span className="font-medium">
                    {stats.totalEmployees > 0 
                      ? Math.round(stats.totalClients / stats.totalEmployees)
                      : 0
                    }
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Status</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">System kører normalt</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Database forbundet</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Alle moduler aktive</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatistics;
