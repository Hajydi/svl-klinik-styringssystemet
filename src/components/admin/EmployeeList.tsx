
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Phone, DollarSign } from 'lucide-react';

interface Profile {
  id: string;
  name: string | null;
  phone: string | null;
  hourly_rate: number | null;
  role: string | null;
}

interface EmployeeListProps {
  employees: Profile[];
  onEmployeeUpdated: () => void;
}

const EmployeeList = ({ employees }: EmployeeListProps) => {
  if (employees.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Ingen medarbejdere endnu</p>
        <p className="text-sm">Opret den første medarbejder for at komme i gang</p>
      </div>
    );
  }

  return (
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
                    <Badge variant="secondary" className="text-xs">
                      Medarbejder
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
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EmployeeList;
