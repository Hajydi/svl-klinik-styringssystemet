
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import LoginForm from '@/components/auth/LoginForm';
import AdminDashboard from '@/components/admin/AdminDashboard';
import EmployeeDashboard from '@/components/employee/EmployeeDashboard';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  name: string;
  email: string;
  hourly_rate: number | null;
  role: string;
}

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      setProfileError(null);
      
      // Set a 5-second timeout for profile fetching
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
      );

      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
      
      console.log('Profile data:', data, 'Error:', error);
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create one
          console.log('Creating profile for user:', userId);
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: session?.user?.email || '',
              name: session?.user?.user_metadata?.name || 'Standard Bruger',
              role: session?.user?.email === 'admin@svl.dk' ? 'admin' : 'bruger'
            })
            .select()
            .single();
          
          if (createError) {
            console.error('Error creating profile:', createError);
            setProfileError('Kunne ikke oprette brugerprofil');
            toast({
              title: "Fejl",
              description: "Kunne ikke oprette brugerprofil",
              variant: "destructive",
            });
          } else {
            setProfile(newProfile);
          }
        } else {
          console.error('Error fetching profile:', error);
          setProfileError('Kunne ikke hente brugerprofil');
          toast({
            title: "Fejl",
            description: "Kunne ikke hente brugerprofil",
            variant: "destructive",
          });
        }
      } else {
        setProfile(data);
      }
    } catch (error: any) {
      console.error('Error fetching/creating profile:', error);
      if (error.message === 'Profile fetch timeout') {
        setProfileError('Timeout ved hentning af profil');
        toast({
          title: "Timeout",
          description: "Kunne ikke hente profil inden for 5 sekunder",
          variant: "destructive",
        });
      } else {
        setProfileError('Uventet fejl ved hentning af profil');
        toast({
          title: "Fejl",
          description: "Der opstod en uventet fejl",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to defer profile fetching and prevent deadlock
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setProfileError(null);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    setProfileError(null);
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

  // Show error if profile couldn't be fetched
  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <p className="text-lg font-medium text-gray-700 mb-4">{profileError}</p>
          <button
            onClick={() => fetchProfile(user.id)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
          >
            Prøv igen
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Log ud
          </button>
        </div>
      </div>
    );
  }

  if (profile?.role === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  } else if (profile?.role === 'bruger' || profile?.role === 'medarbejder') {
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
