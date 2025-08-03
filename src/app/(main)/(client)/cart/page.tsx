"use client";

import { useEffect, useState } from "react";
import { useMainStore } from "@/store/mainStore";
import { CartContainer } from "@/components/CartComponents";
import { CartContainerSkeleton } from "@/components/CartComponents/CartSkeleton";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function CartPage() {
  const supabase = createClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const {
    cartItems,
    cartLoading,
    cartError,
    fetchCartItems,
    fetchProducts,
    products,
  } = useMainStore();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
    
    if (isAuthenticated) {
      fetchCartItems();
      if (products.length === 0) {
        fetchProducts();
      }
    }
  }, [fetchCartItems, fetchProducts, products.length, isAuthenticated]);

  if (isAuthenticated === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg">You need to be logged in to view your cart.</p>
      </div>
    );
  }

  
  if (cartLoading && cartItems.length === 0) {
    return (
      <div className="h-screen overflow-hidden">
        <div className="grid md:grid-cols-2 grid-cols-1">
          <img src="/image.png" alt="" className="object-cover md:block hidden" />
          <CartContainerSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="md:h-[calc(100vh+4rem)] overflow-hidden">
      <div className="grid md:grid-cols-2 grid-cols-1">
        <img src="/image.png" alt="" className="object-cover md:block hidden" />
        <CartContainer />
      </div>
    </div>
  );
}
