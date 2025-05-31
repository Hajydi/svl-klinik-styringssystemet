
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import LoginForm from '@/components/auth/LoginForm';
import AdminDashboard from '@/components/admin/AdminDashboard';
import EmployeeDashboard from '@/components/employee/EmployeeDashboard';

interface Profile {
  id: string;
  name: string | null;
  phone: string | null;
  hourly_rate: number | null;
  role: string | null;
}

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetching with setTimeout to prevent deadlock
          setTimeout(async () => {
            try {
              const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              console.log('Profile data:', data, 'Error:', error);
              
              if (!error && data) {
                setProfile(data);
              } else if (!data) {
                // Create profile if it doesn't exist
                console.log('Creating profile for user:', session.user.id);
                const { data: newProfile, error: createError } = await supabase
                  .from('profiles')
                  .insert({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.name || null,
                    role: session.user.email === 'admin@svl.dk' ? 'admin' : 'medarbejder'
                  })
                  .select()
                  .single();
                
                if (!createError && newProfile) {
                  setProfile(newProfile);
                }
              }
            } catch (error) {
              console.error('Error fetching/creating profile:', error);
            }
          }, 100);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => {
    // The auth state change will handle the rest
  };

  const handleLogout = () => {
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <p className="text-lg font-medium text-gray-700">Indlæser SVL Sportsterapi...</p>
        </div>
      </div>
    );
  }

  if (!session || !user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (profile?.role === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  } else if (profile?.role === 'medarbejder') {
    return <EmployeeDashboard onLogout={handleLogout} />;
  }

  // Loading state while fetching profile
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>
        <p className="text-lg font-medium text-gray-700">Henter profil...</p>
      </div>
    </div>
  );
};

export default Index;
