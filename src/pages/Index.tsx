
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import AdminDashboard from '@/components/admin/AdminDashboard';
import EmployeeDashboard from '@/components/employee/EmployeeDashboard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const Index = () => {
  const { session, user, loading, handleLogout } = useAuth();
  const { profile, profileLoading } = useProfile(session);

  const handleLogin = () => {
    // The auth state change will handle the rest
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!session || !user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // Loading state while fetching profile
  if (profileLoading || !profile) {
    return <LoadingSpinner message="Henter profil..." />;
  }

  if (profile?.role === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  } else if (profile?.role === 'bruger' || profile?.role === 'medarbejder') {
    return <EmployeeDashboard onLogout={handleLogout} />;
  }

  // Fallback loading state
  return <LoadingSpinner message="Indlæser..." />;
};

export default Index;
