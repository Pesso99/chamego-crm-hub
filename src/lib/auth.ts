import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

export async function checkUserRole(userId: string, role: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('has_role', {
    _user_id: userId,
    _role: role as 'admin' | 'user',
  });

  if (error) {
    console.error('Error checking role:', error);
    return false;
  }

  return data === true;
}

export async function signOut() {
  await supabase.auth.signOut();
}
