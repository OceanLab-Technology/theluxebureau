"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useMainStore } from "@/store/mainStore";
import { usePersonalizeStore } from "@/store/personalizeStore";

export function LogoutButton() {
  const router = useRouter();
  const resetMainStore = useMainStore((state) => state.resetStore);
  const resetPersonalizeStore = usePersonalizeStore((state) => state.resetCheckout);

  const logout = async () => {
    try {
      const supabase = createClient();
      
      resetMainStore();
      resetPersonalizeStore();
      
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
      className="text-secondary-foreground hover:text-stone-500 font-medium cursor-pointer"
      onClick={logout}
    >
      LOGOUT
    </button>
  );
}
