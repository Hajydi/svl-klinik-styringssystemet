
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, MapPin } from 'lucide-react';

interface ScheduleItem {
  id: string;
  time: string;
  client: string;
  employee: string;
  service: string;
  duration: string;
  status: 'upcoming' | 'in-progress' | 'completed';
}

const TodaySchedule = () => {
  // Mock data - will be replaced with real data from Supabase
  const todaySchedule: ScheduleItem[] = [
    {
      id: '1',
      time: '09:00',
      client: 'Lars Nielsen',
      employee: 'Maria Andersen',
      service: 'Sportsmassage',
      duration: '60 min',
      status: 'completed'
    },
    {
      id: '2',
      time: '10:30',
      client: 'Anna Hansen',
      employee: 'Peter Sørensen',
      service: 'Fysioterapi',
      duration: '45 min',
      status: 'in-progress'
    },
    {
      id: '3',
      time: '12:00',
      client: 'Thomas Larsen',
      employee: 'Maria Andersen',
      service: 'Konsultation',
      duration: '30 min',
      status: 'upcoming'
    },
    {
      id: '4',
      time: '14:00',
      client: 'Sophie Kristensen',
      employee: 'Peter Sørensen',
      service: 'Sportsmassage',
      duration: '60 min',
      status: 'upcoming'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'upcoming':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Gennemført';
      case 'in-progress':
        return 'I gang';
      case 'upcoming':
        return 'Kommende';
      default:
        return status;
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-xl">
          <Calendar className="w-6 h-6 text-blue-600" />
          <span>Dagens Program</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {todaySchedule.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Ingen aftaler i dag</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todaySchedule.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-blue-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="flex items-center space-x-1 text-sm font-medium text-gray-900">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>{item.time}</span>
                    </div>
                    <span className="text-xs text-gray-500">{item.duration}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.client}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{item.employee}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{item.service}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                  {getStatusText(item.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaySchedule;
