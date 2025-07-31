"use client";

import { useEffect } from "react";
import { useMainStore } from "@/store/mainStore";
import { CartContainer } from "@/components/CartComponents";
import { Loader2 } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <div className="grid md:grid-cols-2 grid-cols-1">
        <img src="/image.png" alt="" className="object-cover md:block hidden" />
        <CartContainer />
      </div>
    </div>
  );
}
