
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

  console.log('Index render - loading:', loading, 'session:', !!session, 'profileLoading:', profileLoading, 'profile:', profile);

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

  // Show loading spinner while fetching profile (only if we're actually loading)
  if (profileLoading) {
    return <LoadingSpinner message="Henter profil..." />;
  }

  // If we have a session but no profile yet, something went wrong
  if (!profile) {
    return <LoadingSpinner message="Kunne ikke hente profil. Prøver igen..." />;
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
