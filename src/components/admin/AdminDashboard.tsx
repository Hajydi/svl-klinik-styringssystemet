
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, FileText, DollarSign, BarChart3, LogOut } from 'lucide-react';
import EmployeeList from './EmployeeList';
import CreateEmployeeForm from './CreateEmployeeForm';
import AdminCalendar from './AdminCalendar';
import AdminClients from './AdminClients';
import AdminJournals from './AdminJournals';
import AdminWages from './AdminWages';
import AdminStatistics from './AdminStatistics';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('medarbejdere');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const handleEmployeeCreated = () => {
    setShowCreateForm(false);
    setRefreshKey(prev => prev + 1);
  };

  const tabs = [
    { id: 'medarbejdere', label: 'Medarbejdere', icon: Users },
    { id: 'klienter', label: 'Klienter', icon: Users },
    { id: 'journaler', label: 'Journaler', icon: FileText },
    { id: 'kalender', label: 'Kalender', icon: Calendar },
    { id: 'løn', label: 'Lønberegning', icon: DollarSign },
    { id: 'statistik', label: 'Statistik', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'medarbejdere':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>Opret Ny Medarbejder</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showCreateForm ? (
                    <CreateEmployeeForm 
                      onSuccess={handleEmployeeCreated}
                      onCancel={() => setShowCreateForm(false)}
                    />
                  ) : (
                    <Button 
                      onClick={() => setShowCreateForm(true)}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Tilføj Medarbejder
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <EmployeeList key={refreshKey} employees={[]} onEmployeeUpdated={() => {}} />
            </div>
          </div>
        );
      case 'klienter':
        return <AdminClients />;
      case 'journaler':
        return <AdminJournals />;
      case 'kalender':
        return <AdminCalendar />;
      case 'løn':
        return <AdminWages />;
      case 'statistik':
        return <AdminStatistics />;
      default:
        return <div>Vælg et modul fra menuen</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SVL Sportsterapi</h1>
                <p className="text-sm text-gray-600">Admin Dashboard</p>
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

export default AdminDashboard;
