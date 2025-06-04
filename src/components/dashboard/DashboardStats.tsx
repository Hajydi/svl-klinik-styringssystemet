
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Calendar, Users, CheckCircle } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  gradient: string;
  textColor: string;
}

const StatCard = ({ title, value, icon: Icon, gradient, textColor }: StatCardProps) => (
  <Card className={`relative overflow-hidden ${gradient} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 backdrop-blur-sm bg-white/10`}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${textColor} opacity-90`}>
            {title}
          </p>
          <p className={`text-3xl font-bold ${textColor} mt-2`}>
            {value}
          </p>
        </div>
        <div className={`w-12 h-12 ${textColor} bg-white/30 rounded-lg flex items-center justify-center backdrop-blur-sm shadow-inner`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {/* Enhanced 3D effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none"></div>
      <div className="absolute inset-0 border border-white/30 rounded-lg pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
    </CardContent>
  </Card>
);

const DashboardStats = () => {
  // Mock data - will be replaced with real data from Supabase
  const stats = [
    {
      title: "Aktiv Omsætning",
      value: "125.750 DKK",
      icon: DollarSign,
      gradient: "bg-gradient-to-br from-emerald-400/80 to-green-500/80",
      textColor: "text-white"
    },
    {
      title: "Gennemførte Aftaler",
      value: "247",
      icon: CheckCircle,
      gradient: "bg-gradient-to-br from-blue-400/80 to-indigo-500/80",
      textColor: "text-white"
    },
    {
      title: "Dagens Bookinger",
      value: "12",
      icon: Calendar,
      gradient: "bg-gradient-to-br from-purple-400/80 to-pink-500/80",
      textColor: "text-white"
    },
    {
      title: "Aktive Medarbejdere",
      value: "8",
      icon: Users,
      gradient: "bg-gradient-to-br from-orange-400/80 to-red-500/80",
      textColor: "text-white"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          gradient={stat.gradient}
          textColor={stat.textColor}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
