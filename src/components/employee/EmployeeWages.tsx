
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Clock, TrendingUp } from 'lucide-react';

interface Wage {
  id: string;
  month: string;
  hours_worked: number | null;
  hourly_rate: number | null;
  total_salary: number | null;
  generated_at: string;
}

const EmployeeWages = () => {
  const [wages, setWages] = useState<Wage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchWages = async () => {
    try {
      const { data, error } = await supabase
        .from('wages')
        .select('*')
        .eq('employee_id', (await supabase.auth.getUser()).data.user?.id)
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

  const currentMonth = wages.length > 0 ? wages[0] : null;
  const totalEarnings = wages.reduce((sum, wage) => sum + (wage.total_salary || 0), 0);

  return (
    <div className="space-y-6">
      {/* Oversigt */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Denne måned</p>
                <p className="text-2xl font-bold text-green-600">
                  {currentMonth?.total_salary ? `${currentMonth.total_salary.toLocaleString('da-DK')} DKK` : '0 DKK'}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Timer denne måned</p>
                <p className="text-2xl font-bold text-blue-600">
                  {currentMonth?.hours_worked || 0}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total indtjening</p>
                <p className="text-2xl font-bold text-purple-600">
                  {totalEarnings.toLocaleString('da-DK')} DKK
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historik */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span>Lønhistorik</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {wages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Ingen løndata endnu</p>
              <p className="text-sm">Lønberegninger vil blive vist her</p>
            </div>
          ) : (
            <div className="space-y-4">
              {wages.map((wage) => (
                <div
                  key={wage.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {wage.month}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{wage.hours_worked || 0} timer</span>
                      <span>{wage.hourly_rate || 0} DKK/time</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-green-600">
                      {wage.total_salary?.toLocaleString('da-DK') || 0} DKK
                    </p>
                    <p className="text-xs text-gray-500">
                      Beregnet {new Date(wage.generated_at).toLocaleDateString('da-DK')}
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

export default EmployeeWages;
