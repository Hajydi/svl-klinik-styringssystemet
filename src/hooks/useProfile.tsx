
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  name: string;
  email: string;
  hourly_rate: number | null;
  role: string;
}

export const useProfile = (session: Session | null) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (userId: string, userEmail: string) => {
    try {
      setProfileLoading(true);
      setError(null);
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      console.log('Profile data:', data, 'Error:', error);
      
      if (error) {
        console.error('Error fetching profile:', error);
        setError(error.message);
        return;
      }
      
      if (!data) {
        // Create profile if it doesn't exist
        const isAdmin = userEmail === 'haj@svl.dk';
        
        const newProfile = {
          id: userId,
          email: userEmail,
          name: isAdmin ? 'Administrator' : session?.user?.user_metadata?.name || 'Standard Bruger',
          role: isAdmin ? 'admin' : 'bruger',
          full_name: isAdmin ? 'Administrator' : session?.user?.user_metadata?.name || '',
          hourly_rate: null
        };
        
        console.log('Creating new profile:', newProfile);
        
        const { data: insertedData, error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .maybeSingle();
          
        if (!insertError && insertedData) {
          console.log('Profile created successfully:', insertedData);
          setProfile(insertedData);
        } else {
          console.error('Failed to create profile:', insertError);
          // Set the profile anyway for the session
          setProfile(newProfile);
        }
      } else {
        console.log('Profile found:', data);
        setProfile(data);
      }
    } catch (error: any) {
      console.error('Error in fetchProfile:', error);
      setError(error.message);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      const userEmail = session.user.email || '';
      fetchProfile(session.user.id, userEmail);
    } else {
      setProfile(null);
      setProfileLoading(false);
      setError(null);
    }
  }, [session?.user?.id]);

  return {
    profile,
    profileLoading,
    error,
    refetch: () => {
      if (session?.user) {
        const userEmail = session.user.email || '';
        fetchProfile(session.user.id, userEmail);
      }
    }
  };
};
