"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PersonalizeSkeleton } from "@/components/PersonalizeComponents/PersonalizeSkeleton";

export default function PersonalizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          setIsAuthenticated(false);
          router.push('/auth/login?redirect=/personalize');
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        router.push('/auth/login?redirect=/personalize');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          router.push('/auth/login?redirect=/personalize');
        } else if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  if (isLoading) {
    return <PersonalizeSkeleton />;
  }

  if (!isAuthenticated) {
    return <PersonalizeSkeleton />;
  }

  return <>{children}</>;
}
