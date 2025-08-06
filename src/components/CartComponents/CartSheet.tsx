"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartContainer } from "./CartContainer";
import { useMainStore } from "@/store/mainStore";
import { createClient } from "@/lib/supabase/client";
import { LoginRequiredModal } from "@/components/ui/login-required-modal";
import { cn } from "@/lib/utils";

interface CartSheetProps {
  className?: string;
  children?: React.ReactNode;
  fill?: string;
}

export function CartSheet({ className, children, fill }: CartSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { cartItemCount, fetchCartItems } = useMainStore();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
    });

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
    setIsOpen(true);
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <div>
            <button
              onClick={handleCartClick}
              className={cn(
                "md:block hidden relative cursor-pointer text-[15px] leading-[18px] font-schoolbook-cond font-[400]",
                className
              )}
            >
              {children || `CART (${cartItemCount})`}
            </button>
            <div className="md:hidden flex items-center justify-center">
              <svg
                onClick={handleCartClick}
                width="14"
                height="18"
                viewBox="0 0 14 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.9835 4.46778H10.1639V3.60493C10.1639 1.616 8.59822 0 6.67359 0C4.74897 0 3.1833 1.616 3.1833 3.60249V4.46534H0.361309C0.162943 4.46534 0 4.63352 0 4.83826V17.4202C0 17.6249 0.160582 17.7931 0.361309 17.7931H12.9835C13.1819 17.7931 13.3448 17.6274 13.3448 17.4202V4.8407C13.3448 4.63596 13.1842 4.46778 12.9835 4.46778ZM3.9012 3.60493C3.9012 2.02793 5.14334 0.745848 6.67123 0.745848C8.19912 0.745848 9.44127 2.02793 9.44127 3.60493V4.46778H3.9012V3.60493ZM12.6222 17.0497H0.720257V5.21119H3.17858V7.01487C3.17858 7.21961 3.33916 7.38779 3.53989 7.38779C3.74061 7.38779 3.9012 7.22205 3.9012 7.01487V5.21119H9.44363V7.01487C9.44363 7.21961 9.60421 7.38779 9.80494 7.38779C10.0057 7.38779 10.1663 7.22205 10.1663 7.01487V5.21119H12.6246V17.0473L12.6222 17.0497Z"
                  fill={fill || "#1e1204"}
                />
              </svg>
            </div>
          </div>
        </SheetTrigger>

        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className="md:px-6 px-4 py-8 border-l-0"
        >
          <CartContainer onClose={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        feature="access your cart"
      />
    </>
  );
}
