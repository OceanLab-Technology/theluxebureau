"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/DashboardComponents/AdminSidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          setIsAuthenticated(false);
          router.push('/auth/login?redirect=/admin');
          return;
        }
        
        setIsAuthenticated(true);

        // Check if user is admin
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError || !profile || profile.role !== 'admin') {
          setIsAdmin(false);
          router.push('/products'); // Redirect non-admin users to products
          return;
        }
        
        setIsAdmin(true);
      } catch (error) {
        console.error('Admin auth check error:', error);
        setIsAuthenticated(false);
        router.push('/auth/login?redirect=/admin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setIsAdmin(false);
          router.push('/auth/login?redirect=/admin');
        } else if (event === 'SIGNED_IN' && session) {
          checkAdminAuth(); // Re-check admin status
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <AdminSidebar  />
        <SidebarInset>
          <div className="flex-1 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
