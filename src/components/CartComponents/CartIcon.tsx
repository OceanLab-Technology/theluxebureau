"use client";

import { useMainStore } from "@/store/mainStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { LoginRequiredModal } from "@/components/ui/login-required-modal";

export function CartIcon({ className }: { className?: string }) {
  const { cartItemCount, fetchCartItems } = useMainStore();
  const supabase = createClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session?.user);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
    }
  }, [fetchCartItems, isAuthenticated]);

  const handleCartClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    router.push("/cart");
  };

  return (
    <>
      <button
        onClick={handleCartClick}
        className={cn("relative cursor-pointer text-[15px] leading-[18px] font-schoolbook-cond font-[400]", className)}
      >
        CART ({cartItemCount})
      </button>
      
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        feature="access your cart"
      />
    </>
  );
}
