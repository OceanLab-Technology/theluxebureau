"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
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
