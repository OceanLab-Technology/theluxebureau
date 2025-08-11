"use client";

import { useMainStore } from "@/store/mainStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export function CartIcon({ className }: { className?: string }) {
  const { cartItemCount, fetchCartItems, checkAuthStatus } = useMainStore();
  const router = useRouter();

  useEffect(() => {
    // Initialize cart - check auth status and fetch cart items
    const initializeCart = async () => {
      await checkAuthStatus();
      await fetchCartItems();
    };
    
    initializeCart();
  }, [checkAuthStatus, fetchCartItems]);

  const handleCartClick = () => {
    // No longer requires authentication to view cart
    router.push("/cart");
  };

  return (
    <>
      <button
        onClick={handleCartClick}
        className={cn(
          "relative cursor-pointer text-[15px] leading-[18px] font-schoolbook-cond font-[400]",
          className
        )}
      >
        CART ({cartItemCount})
      </button>
    </>
  );
}
