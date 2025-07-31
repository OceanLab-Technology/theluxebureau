"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useMainStore } from "@/store/mainStore";
import { LogoutButton } from "@/components/AuthComponents/LogoutButton";

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    shipping_address?: string;
    phone_number?: string;
  };
}

interface Order {
  id: number;
  items: any[];
  date: string;
}

interface AccountPageProps {
  user: User | null;
}

export default function AccountPage({ user }: AccountPageProps) {
  const { products, fetchProducts } = useMainStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState({
    name: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    shippingAddress: user?.user_metadata?.shipping_address || "",
    phoneNumber: user?.user_metadata?.phone_number || "",
    password: "••••••••••••••••••••",
  });

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
    setOrders([
      {
        id: 1,
        items: products.slice(0, 3),
        date: "2024-01-15",
      },
      {
        id: 2,
        items: products.slice(1, 3),
        date: "2024-01-10",
      },
    ]);
  }, [products, fetchProducts]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update logic here
    console.log("Profile updated:", profile);
  };

  const userName = profile.name || user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen flex flex-col bg-background font-century">
      <main className="relative flex md:flex-row flex-col md:px-20 px-4 min-h-[calc(100vh-64px)]">
        <div className="md:w-64 w-full md:py-20 py-6">
          <h1 className="block md:hidden text-2xl font-light mb-6">
            Welcome back,
            <br />
            {userName}
          </h1>
          <div className="md:space-y-2 md:text-sm text-xs uppercase tracking-wider md:block flex md:flex-col flex-row space-x-4 md:space-x-0">
            <div className="text-stone-500 md:mb-4 mb-0 md:block hidden">
              ACCOUNT
            </div>
            <div className="text-stone-800 font-medium">ORDER HISTORY</div>
            <div className="text-stone-800 font-medium">PROFILE SETTINGS</div>
            <LogoutButton/>
          </div>
        </div>

        <div className="flex-1 md:py-20 py-6 md:px-10 px-0">
          <h1 className="md:block hidden text-2xl font-light mb-12">
            Welcome back, {userName}
          </h1>

          <div className="mb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-8">
              <div className="mb-2 md:mb-0">
                <div className="text-xs text-stone-500 uppercase tracking-wider">
                  DELIVERED
                </div>
                <div className="text-sm font-medium">FRIDAY 01, APRIL</div>
                <div className="text-lg font-medium">£286.27</div>
              </div>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-stone-800 px-6 py-2 text-xs uppercase tracking-wider w-fit">
                VIEW ORDER
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6 mb-8">
              {products.slice(0, 3).map((product, index) => (
                <div key={product.id || index} className="bg-stone-100">
                  <div className="aspect-square relative">
                    <Image
                      src={product.image_1 || "/placeholder.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-8">
              <div className="mb-2 md:mb-0">
                <div className="text-xs text-stone-500 uppercase tracking-wider">
                  DELIVERED
                </div>
                <div className="text-sm font-medium">WEDNESDAY 18, JANUARY</div>
                <div className="text-lg font-medium">£64.73</div>
              </div>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-stone-800 px-6 py-2 text-xs uppercase tracking-wider w-fit">
                VIEW ORDER
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-6 mb-8">
              {products.slice(1, 3).map((product, index) => (
                <div key={product.id || index} className="bg-stone-100">
                  <div className="aspect-square relative">
                    <Image
                      src={product.image_1 || "/placeholder.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-8 hidden md:block">
              PROFILE SETTINGS
            </h2>

            <form onSubmit={handleProfileUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="border border-stone-300 p-4 md:p-6">
                  <Label className="block text-xs font-medium mb-2 tracking-wider uppercase text-stone-500">
                    NAME
                  </Label>
                  <Input
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="border-0 border-b border-stone-400 bg-transparent px-0 py-2 text-stone-800 focus:border-stone-600 focus:ring-0 outline-none rounded-none"
                    placeholder="John Doe"
                  />
                </div>

                <div className="border border-stone-300 p-4 md:p-6">
                  <Label className="block text-xs font-medium mb-2 tracking-wider uppercase text-stone-500">
                    EMAIL ADDRESS
                  </Label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="border-0 border-b border-stone-400 bg-transparent px-0 py-2 text-stone-800 focus:border-stone-600 focus:ring-0 outline-none rounded-none"
                    placeholder="johndoe@example.com"
                  />
                </div>

                <div className="border border-stone-300 p-4 md:p-6">
                  <Label className="block text-xs font-medium mb-2 tracking-wider uppercase text-stone-500">
                    SHIPPING ADDRESS
                  </Label>
                  <Input
                    value={profile.shippingAddress}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        shippingAddress: e.target.value,
                      })
                    }
                    className="border-0 border-b border-stone-400 bg-transparent px-0 py-2 text-stone-800 focus:border-stone-600 focus:ring-0 outline-none rounded-none"
                    placeholder="206 Batran's Street, 39, 2044 Ontario..."
                  />
                </div>

                <div className="border border-stone-300 p-4 md:p-6">
                  <Label className="block text-xs font-medium mb-2 tracking-wider uppercase text-stone-500">
                    PHONE NUMBER
                  </Label>
                  <Input
                    value={profile.phoneNumber}
                    onChange={(e) =>
                      setProfile({ ...profile, phoneNumber: e.target.value })
                    }
                    className="border-0 border-b border-stone-400 bg-transparent px-0 py-2 text-stone-800 focus:border-stone-600 focus:ring-0 outline-none rounded-none"
                    placeholder="+1 222 333 4444"
                  />
                </div>

                <div className="border border-stone-300 p-4 md:p-6 md:col-span-1">
                  <Label className="block text-xs font-medium mb-2 tracking-wider uppercase text-stone-500">
                    PASSWORD
                  </Label>
                  <Input
                    type="password"
                    value={profile.password}
                    onChange={(e) =>
                      setProfile({ ...profile, password: e.target.value })
                    }
                    className="border-0 border-b border-stone-400 bg-transparent px-0 py-2 text-stone-800 focus:border-stone-600 focus:ring-0 outline-none rounded-none"
                    placeholder="••••••••••••••••••••"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
