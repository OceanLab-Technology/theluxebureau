"use client";

import { useMainStore } from "@/store/mainStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export function CartIcon({ className }: { className?: string }) {
  const { cartItemCount, fetchCartItems } = useMainStore();
  const supabase = createClient();
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const {
  //       data: { session },
  //     } = await supabase.auth.getSession();
  //     setIsAuthenticated(!!session);
  //   };

  //   checkAuth();
  // }, [supabase]);

  const router = useRouter();

  useEffect(() => {
    // if (isAuthenticated) {
    //   fetchCartItems();
    // }
    fetchCartItems();
  }, [fetchCartItems]);

  const handleCartClick = () => {
    router.push("/cart");
  };

  return (
    <button
      onClick={handleCartClick}
      className={cn("relative cursor-pointer", className)}
    >
      CART ({cartItemCount})
    </button>
  );
}
