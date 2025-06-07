
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

  const fetchProfile = async (userId: string) => {
    try {
      setProfileLoading(true);
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      console.log('Profile data:', data, 'Error:', error);
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (!data) {
        // Create profile if it doesn't exist
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
          
        if (!insertError && insertedData) {
          setProfile(insertedData);
        } else {
          // If insert fails, set the profile anyway for the session
          setProfile(newProfile);
        }
      } else {
        setProfile(data);
      }
    } catch (error: any) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchProfile(session.user.id);
    } else {
      setProfile(null);
      setProfileLoading(false);
    }
  }, [session?.user?.id]);

  return {
    profile,
    profileLoading
  };
};
