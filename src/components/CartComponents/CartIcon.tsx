"use client";

import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export function CartIcon({ className }: { className?: string }) {
  const { cartItemCount, fetchCartItems } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleCartClick = () => {
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
