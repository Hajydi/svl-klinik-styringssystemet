
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, Users, FileText, DollarSign, LogOut } from 'lucide-react';
import EmployeeCalendar from './EmployeeCalendar';
import EmployeeClients from './EmployeeClients';
import EmployeeJournals from './EmployeeJournals';
import EmployeeWages from './EmployeeWages';

interface EmployeeDashboardProps {
  onLogout: () => void;
}

const EmployeeDashboard = ({ onLogout }: EmployeeDashboardProps) => {
  const [activeTab, setActiveTab] = useState('kalender');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const tabs = [
    { id: 'kalender', label: 'Kalender', icon: Calendar },
    { id: 'klienter', label: 'Klienter', icon: Users },
    { id: 'journaler', label: 'Journaler', icon: FileText },
    { id: 'løn', label: 'Løn', icon: DollarSign },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'kalender':
        return <EmployeeCalendar />;
      case 'klienter':
        return <EmployeeClients />;
      case 'journaler':
        return <EmployeeJournals />;
      case 'løn':
        return <EmployeeWages />;
      default:
        return <EmployeeCalendar />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SVL Sportsterapi</h1>
                <p className="text-sm text-gray-600">Medarbejder Dashboard</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log ud</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation */}
          <div className="lg:w-64">
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
