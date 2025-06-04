
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
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      console.log('Profile data:', data, 'Error:', error);
      
      if (error) {
        console.error('Error fetching profile:', error);
        setProfileError('Kunne ikke hente brugerprofil');
        toast({
          title: "Fejl",
          description: "Kunne ikke hente brugerprofil",
          variant: "destructive",
        });
        return;
      }
      
      if (!data) {
        // Create profile for admin user if it doesn't exist
        const userEmail = session?.user?.email || '';
        const isAdmin = userEmail === 'haj@svl.dk';
        
        const newProfile = {
          id: userId,
          email: userEmail,
          name: isAdmin ? 'Administrator' : session?.user?.user_metadata?.name || 'Standard Bruger',
          role: isAdmin ? 'admin' : 'bruger',
          full_name: isAdmin ? 'Administrator' : session?.user?.user_metadata?.name || '',
          hourly_rate: null
        };
        
        const { data: insertedData, error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();
          
        if (insertError) {
          console.error('Error creating profile:', insertError);
          setProfile(newProfile);
        } else {
          setProfile(insertedData);
        }
      } else {
        // Ensure admin role for haj@svl.dk
        if (session?.user?.email === 'haj@svl.dk' && data.role !== 'admin') {
          const updatedProfile = { ...data, role: 'admin' };
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', userId);
            
          if (updateError) {
            console.error('Error updating admin role:', updateError);
          }
          setProfile(updatedProfile);
        } else {
          setProfile(data);
        }
      }
    } catch (error: any) {
      console.error('Error in fetchProfile:', error);
      setProfileError('Uventet fejl ved hentning af profil');
      toast({
        title: "Fejl",
        description: "Der opstod en uventet fejl",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetching to avoid potential deadlocks
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

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [session]);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <p className="text-lg font-medium text-white">Indlæser SVL Coaching...</p>
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>
        <p className="text-lg font-medium text-white">Henter profil...</p>
      </div>
    </div>
  );
};

export default Index;
