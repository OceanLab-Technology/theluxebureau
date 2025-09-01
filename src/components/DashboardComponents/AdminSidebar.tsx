"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Home,
  FileText,
  TrendingUp,
  UserPlus,
  LogOutIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogoutButton } from "../AuthComponents/LogoutButton";
import { createClient } from "@/lib/supabase/client";

const menuItems = [
  {
    title: "MAIN",
    items: [
      {
        title: "Overview",
        url: "/admin",
        icon: Home,
      },
      {
        title: "Orders",
        url: "/admin/orders",
        icon: ShoppingCart,
      },
      {
        title: "Products",
        url: "/admin/products",
        icon: Package,
      },
      {
        title: "Clients",
        url: "/admin/customers",
        icon: Users,
      },
    ],
  },
  {
    title: "INSIGHTS",
    items: [
      {
        title: "Analytics",
        url: "/admin/analytics",
        icon: BarChart3,
      },
      {
        title: "Teams",
        url: "/admin/teams",
        icon: UserPlus,
      },
      {
        title: "Form Submissions",
        url: "/admin/forms",
        icon: FileText,
      },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar className="bg-background">
      <SidebarHeader className="border-b border-border bg-background">
        <div className="flex items-center justify-between py-[11.5px] px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="truncate font-[200] font-[Century-Old-Style] lowercase tracking-widest">
              the{" "}
              <span className="uppercase">
                <span className="italic">LUXE</span> BUREAU
              </span>
            </span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-background font-[Century-Old-Style]">
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs my-6 font-[300] text-muted-foreground">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="w-full"
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-6 text-sm"
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 bg-background">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin/settings" className="flex items-center gap-2">
                <Settings className="size-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={async () => {
                try {
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  localStorage.clear();
                  sessionStorage.clear();
                  router.push("/auth/login");
                } catch (error) {
                  console.error("Error during logout:", error);
                  router.push("/auth/login");
                }
              }}
            >
              <button className="flex items-center gap-2 w-full text-left">
                <LogOutIcon className="size-4" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
