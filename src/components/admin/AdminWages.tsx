
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Users } from 'lucide-react';

interface Wage {
  id: string;
  month: string;
  hours_worked: number | null;
  hourly_rate: number | null;
  total_salary: number | null;
  profiles?: {
    name: string;
  };
}

const AdminWages = () => {
  const [wages, setWages] = useState<Wage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchWages = async () => {
    try {
      const { data, error } = await supabase
        .from('wages')
        .select(`
          *,
          profiles!wages_employee_id_fkey (
            name
          )
        `)
        .order('month', { ascending: false });

      if (error) {
        toast({
          title: "Fejl",
          description: "Kunne ikke hente løndata",
          variant: "destructive",
        });
      } else {
        setWages(data || []);
      }
    } catch (error) {
      toast({
        title: "Uventet fejl",
        description: "Der opstod en fejl ved hentning af løndata",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWages();
  }, []);

  if (loading) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-8 text-center">
          <div className="text-lg">Indlæser løndata...</div>
        </CardContent>
      </Card>
    );
  }

  const totalSalaries = wages.reduce((sum, wage) => sum + (wage.total_salary || 0), 0);

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total udbetalinger</p>
              <p className="text-3xl font-bold text-green-600">
                {totalSalaries.toLocaleString('da-DK')} DKK
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span>Lønberegninger</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {wages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Ingen lønberegninger endnu</p>
            </div>
          ) : (
            <div className="space-y-4">
              {wages.map((wage) => (
                <div
                  key={wage.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {wage.profiles?.name || 'Ukendt medarbejder'}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{wage.month}</span>
                        <span>{wage.hours_worked || 0} timer</span>
                        <span>{wage.hourly_rate || 0} DKK/time</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-green-600">
                      {wage.total_salary?.toLocaleString('da-DK') || 0} DKK
                    </p>
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

export default AdminWages;
