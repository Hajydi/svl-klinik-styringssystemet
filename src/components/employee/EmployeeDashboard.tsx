
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, FileText, DollarSign, Home } from 'lucide-react';
import Header from '@/components/layout/Header';
import ModernDashboard from '@/components/dashboard/ModernDashboard';
import EmployeeCalendar from './EmployeeCalendar';
import EmployeeClients from './EmployeeClients';
import EmployeeJournals from './EmployeeJournals';
import EmployeeWages from './EmployeeWages';

interface EmployeeDashboardProps {
  onLogout: () => void;
}

const EmployeeDashboard = ({ onLogout }: EmployeeDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'kalender', label: 'Kalender', icon: Calendar },
    { id: 'klienter', label: 'Klienter', icon: Users },
    { id: 'journaler', label: 'Journaler', icon: FileText },
    { id: 'løn', label: 'Løn', icon: DollarSign },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ModernDashboard />;
      case 'kalender':
        return <EmployeeCalendar />;
      case 'klienter':
        return <EmployeeClients />;
      case 'journaler':
        return <EmployeeJournals />;
      case 'løn':
        return <EmployeeWages />;
      default:
        return <ModernDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header onLogout={handleLogout} userRole="employee" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation */}
          <div className="lg:w-64">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
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
                      className={`w-full justify-start transition-all duration-200 ${
                        activeTab === tab.id 
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md" 
                          : "hover:bg-blue-50"
                      }`}
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
