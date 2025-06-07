
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import AdminDashboard from '@/components/admin/AdminDashboard';
import EmployeeDashboard from '@/components/employee/EmployeeDashboard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const Index = () => {
  const { session, user, loading, handleLogout } = useAuth();
  const { profile, profileLoading, error, refetch } = useProfile(session);

  console.log('Index render - loading:', loading, 'session:', !!session, 'profileLoading:', profileLoading, 'profile:', profile, 'error:', error);

  const handleLogin = () => {
    // The auth state change will handle the rest
  };

  // Show loading spinner while checking auth state
  if (loading) {
    return <LoadingSpinner message="Indlæser..." />;
  }

  // Show login form if no session
  if (!session || !user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // Show loading spinner while fetching profile
  if (profileLoading) {
    return <LoadingSpinner message="Henter profil..." />;
  }

  // If there's an error fetching profile, show retry option
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <p className="text-lg font-medium text-white mb-4">Fejl ved hentning af profil</p>
          <p className="text-sm text-gray-300 mb-4">{error}</p>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Prøv igen
          </button>
        </div>
      </div>
    );
  }

  // If we have a session but no profile yet, something went wrong
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <p className="text-lg font-medium text-white mb-4">Ingen profil fundet</p>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-4"
          >
            Prøv igen
          </button>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Log ud
          </button>
        </div>
      </div>
    );
  }

  // Route based on user role
  if (profile.role === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  } else if (profile.role === 'bruger' || profile.role === 'medarbejder') {
    return <EmployeeDashboard onLogout={handleLogout} />;
  }

  // Fallback - should not reach here normally
  return <LoadingSpinner message="Indlæser dashboard..." />;
};

export default Index;
