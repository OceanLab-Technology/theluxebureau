"use client";

import { useEffect, useState } from "react";
import { useMainStore } from "@/store/mainStore";
import { CartContainer } from "@/components/CartComponents";
import { CartContainerSkeleton } from "@/components/CartComponents/CartSkeleton";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function CartPage() {
  const {
    cartItems,
    cartLoading,
    cartError,
    fetchCartItems,
    fetchProducts,
    products,
  } = useMainStore();

  useEffect(() => {
    fetchCartItems();
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchCartItems, fetchProducts, products.length]);


  if (cartLoading && cartItems.length === 0) {
    return (
      <div className="h-screen overflow-hidden">
        <div className="grid md:grid-cols-2 grid-cols-1">
          <img
            src="/image.png"
            alt=""
            className="object-cover md:block hidden"
          />
          <CartContainerSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="md:h-[calc(100vh+4rem)] overflow-hidden font-century">
      <div className="grid md:grid-cols-2 grid-cols-1">
        <img src="/image.png" alt="" className="object-cover md:block hidden" />
        <CartContainer />
      </div>
    </div>
  );
}
