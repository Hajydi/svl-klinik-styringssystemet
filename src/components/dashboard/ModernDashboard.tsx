
import React from 'react';
import DashboardStats from './DashboardStats';
import TodaySchedule from './TodaySchedule';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, BarChart3 } from 'lucide-react';

const ModernDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <DashboardStats />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule - Takes 2 columns */}
        <div className="lg:col-span-2">
          <TodaySchedule />
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Plus className="w-5 h-5 text-blue-600" />
                <span>Hurtige Handlinger</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Calendar className="w-4 h-4 mr-2" />
                Ny Booking
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Ny Klient
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Vis Rapporter
              </Button>
            </CardContent>
          </Card>
          
          {/* Mini Calendar Preview */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-green-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>Kalender Oversigt</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-2xl font-bold text-emerald-600">12</p>
                <p className="text-sm text-gray-600">Bookinger i dag</p>
                <Button variant="link" className="mt-2 text-emerald-600">
                  Se fuld kalender
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;
