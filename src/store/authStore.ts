import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/lib/supabase/client";

interface AuthStore {
  isAuthenticated: boolean | null;
  user: any | null;
  loading: boolean;
  
  checkAuthStatus: () => Promise<boolean>;
  setAuth: (authenticated: boolean, user?: any) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: null,
      user: null,
      loading: false,

      checkAuthStatus: async () => {
        try {
          set({ loading: true });
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          const isAuth = !!user;
          
          set({ 
            isAuthenticated: isAuth, 
            user: user,
            loading: false 
          });
          
          return isAuth;
        } catch (error) {
          set({ 
            isAuthenticated: false, 
            user: null,
            loading: false 
          });
          return false;
        }
      },

      setAuth: (authenticated: boolean, user?: any) => {
        set({ 
          isAuthenticated: authenticated, 
          user: user || null 
        });
      },

      clearAuth: () => {
        set({ 
          isAuthenticated: false, 
          user: null 
        });
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
