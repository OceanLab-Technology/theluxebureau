"use client";

import { useEffect } from "react";
import { useMainStore } from "@/store/mainStore";
import { CartContainer } from "@/components/CartComponents";
import { CartContainerSkeleton } from "@/components/CartComponents/CartSkeleton";

export default function CartPage() {
  const {
    cartItems,
    cartLoading,
    fetchCartItems,
    fetchProducts,
    products,
    checkAuthStatus,
  } = useMainStore();

  useEffect(() => {
    const initializePage = async () => {
      await checkAuthStatus();
      await fetchCartItems();
      if (products.length === 0) {
        await fetchProducts();
      }
    };
    
    initializePage();
  }, [checkAuthStatus, fetchCartItems, fetchProducts, products.length]);

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
