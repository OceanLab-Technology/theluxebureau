"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { useMainStore } from "@/store/mainStore";

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
    // Mock orders for demo - replace with actual API call
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
      <main className="relative flex px-20 min-h-[calc(100vh-64px)]">
        <div className="w-64 py-20">
          <div className="space-y-2 text-sm uppercase tracking-wider">
            <div className="text-stone-500 mb-4">ACCOUNT</div>
            <div className="text-stone-800 font-medium">ORDER HISTORY</div>
            <div className="text-stone-800 font-medium">PROFILE SETTINGS</div>
          </div>
        </div>

        <div className="flex-1 py-20 px-10">
          <h1 className="text-2xl font-light mb-12">
            Welcome back, {userName}
          </h1>

          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-medium">ORDER HISTORY</h2>
              <div className="text-sm text-stone-600">
                <div>ORDER NO: 001</div>
                <div>PLACED ON: 25 OCT 2024</div>
                <div>£500.00</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
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

            <div className="flex justify-end mb-12">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-stone-800 px-8 py-2 uppercase tracking-wider">
                VIEW ORDER
              </Button>
            </div>

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-medium">ORDER NO: 002</h2>
              <div className="text-sm text-stone-600">
                <div>PLACED ON: 15 OCT 2024</div>
                <div>£450.00</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
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

            <div className="flex justify-end">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-stone-800 px-8 py-2 uppercase tracking-wider">
                VIEW ORDER
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-8">PROFILE SETTINGS</h2>

            <form onSubmit={handleProfileUpdate}>
              <div className="grid grid-cols-2 gap-6">
                <div className="border border-stone-300 p-6">
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

                <div className="border border-stone-300 p-6">
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

                <div className="border border-stone-300 p-6">
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

                <div className="border border-stone-300 p-6">
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

                <div className="border border-stone-300 p-6">
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
      <Footer />
    </div>
  );
}
