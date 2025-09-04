"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useProductStore } from "@/store/productStore";
import { usePersonaliseStore } from "@/store/personaliseStore";

export function LogoutButton() {
  const router = useRouter();
  const resetCart = useCartStore((state) => state.resetCart);
  const resetProducts = useProductStore((state) => state.resetProducts);
  const resetPersonaliseStore = usePersonaliseStore((state) => state.resetCheckout);

  const logout = async () => {
    try {
      const supabase = createClient();
      
      resetCart();
      resetProducts();
      resetPersonaliseStore();
      
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error during logout:", error);
      router.push("/auth/login");
    }
  };

  return (
    <button
      className="text-secondary-foreground hover:text-stone-500 small-text font-medium cursor-pointer"
      onClick={logout}
    >
      LOGOUT
    </button>
  );
}
