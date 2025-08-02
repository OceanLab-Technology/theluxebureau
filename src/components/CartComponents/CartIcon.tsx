"use client";

import { useMainStore } from "@/store/mainStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export function CartIcon({ className }: { className?: string }) {
  const { cartItemCount, fetchCartItems } = useMainStore();

  const router = useRouter();

  useEffect(() => {
    // Fetch cart items when component mounts
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
