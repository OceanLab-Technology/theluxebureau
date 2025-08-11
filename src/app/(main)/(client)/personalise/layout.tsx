"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PersonaliseSkeleton } from "@/components/PersonaliseComponents/PersonaliseSkeleton";
import { LoginRequiredModal } from "@/components/ui/login-required-modal";

export default function PersonaliseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          setIsAuthenticated(false);
          setShowLoginModal(true);
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setShowLoginModal(true);
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
          setShowLoginModal(true);
        } else if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
          setShowLoginModal(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  const handleCloseModal = () => {
    setShowLoginModal(false);
    // Navigate back to products or previous page
    router.push('/products');
  };

  if (isLoading) {
    return <PersonaliseSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <>
        <PersonaliseSkeleton />
        <LoginRequiredModal
          isOpen={showLoginModal}
          onClose={handleCloseModal}
          feature="personalize products"
        />
      </>
    );
  }

  return <>{children}</>;
}
