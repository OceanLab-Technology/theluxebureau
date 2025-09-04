import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { createClient } from '@/lib/supabase/client';

export function useStoreAuth() {
  const setAuthStatus = useCartStore((state) => state.setAuthStatus);

  useEffect(() => {
    const checkAndSetAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setAuthStatus(!!user);
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthStatus(false);
      }
    };

    checkAndSetAuth();

    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthStatus(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, [setAuthStatus]);
}
