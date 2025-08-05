"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useMainStore } from "@/store/mainStore";
import { LogoutButton } from "@/components/AuthComponents/LogoutButton";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

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
  id: string;
  customer_name: string;
  customer_email: string;
  recipient_name: string;
  recipient_address: string;
  delivery_date: string;
  notes?: string;
  status: "New" | "Active" | "Complete";
  total_amount: number;
  created_at: string;
  updated_at: string;
  stripe_session_id?: string;
  stripe_payment_intent_id?: string;
  payment_status: "pending" | "completed" | "failed" | "refunded";
  order_items?: Array<{
    id: string;
    order_id: string;
    products: {
      id: string;
      name: string;
      image_1: string;
    };
    quantity: number;
    price_at_purchase: number;
    custom_data?: any;
  }>;
  personalization?: any;
}

interface AccountPageProps {
  user: User | null;
}

export default function AccountPage({ user }: AccountPageProps) {
  const { products, fetchProducts } = useMainStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const supabase = createClient(); // Create client inside component

  const [profile, setProfile] = useState({
    name: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    shippingAddress: user?.user_metadata?.shipping_address || "",
    phoneNumber: user?.user_metadata?.phone_number || "",
    password: "••••••••••••••••••••",
  });

  // Fetch user's orders
  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const response = await fetch("/api/orders/user");
      if (response.ok) {
        const result = await response.json();
        setOrders(result.data || []);
      } else {
        console.error("Failed to fetch orders");
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
    fetchOrders();
  }, [products, fetchProducts]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      const { error, data } = await supabase.auth.updateUser({
        data: {
          full_name: profile.name,
          shipping_address: profile.shippingAddress,
          phone_number: profile.phoneNumber,
        },
        password:
          profile.password !== "••••••••••••••••••••"
            ? profile.password
            : undefined,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const userName = profile.name || user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidde">
      <main className="relative grid grid-cols-1 md:grid-cols-5 md:flex-row flex-col md:pl-20 pl-4 min-h-[calc(100vh-64px)]">
        <div className="md:w-64 w-full col-span-1 md:py-20 py-8">
          <h1 className="block md:hidden md:text-[2rem] text-[1.5rem] font-light mb-6">
            Welcome back,
            <br />
            {userName}
          </h1>
          <div className="md:space-y-2 md:pt-22 md:text-[1rem] font-century text-xs uppercase tracking-wider md:block flex md:flex-col flex-row space-x-4 md:space-x-0">
            <div className="text-stone-500  md:mb-4 mb-0 md:block cursor-pointer hidden">
              ACCOUNT
            </div>
            <div className="text-stone-800 hover:text-stone-500 transition-colors cursor-pointer font-medium">
              ORDER HISTORY
            </div>
            <div className="text-stone-800 hover:text-stone-500 transition-colors cursor-pointer font-medium">
              PROFILE SETTINGS
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="flex-1 md:py-20 py-6 md:px-10 px-0 col-span-4 ">
          <h1 className="md:block hidden text-2xl font-light mb-12">
            Welcome back, {userName}
          </h1>

          <div className="mb-16">
            <h2 className="text-lg font-medium mb-6 border-b border-stone-300">
              ORDER HISTORY
            </h2>
            {isLoadingOrders ? (
              <div className="text-center py-8">
                <div className="text-stone-500">Loading orders...</div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-stone-500 mb-4">No orders found</div>
                <Link href="/products"></Link>
                <Button variant={"box_yellow"}>Start Shopping</Button>
              </div>
            ) : (
              orders.map((order, index) => {
                const orderNumber = String(index + 1).padStart(3, "0");
                return (
                  <div key={order.id} className="mb-8 space-y-10">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 md:mb-6">
                      <div className="mb-4 uppercase md:mb-0 text-[#50462D] text-[0.93rem]">
                        <h3 className="">Order no.{orderNumber}</h3>
                        <h3 className="">
                          {new Date(order.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </h3>
                        <h3 className="">${order.total_amount?.toFixed(2)}</h3>
                      </div>
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="box_yellow" className="px-14 h-10 rounded-sm">VIEW ORDER</Button>
                      </Link>
                    </div>
                    {order.order_items && order.order_items.length > 0 && (
                      <div className="relative w-full">
                        <div className="overflow-x-auto overflow-y-hidden hide-scrollbar">
                          <div className="flex gap-4 pb-4 w-max">
                            {order.order_items.map((item, itemIndex) => (
                              <div
                                key={`${item.id}-${itemIndex}`}
                                className="flex-shrink-0 bg-stone-100 w-[22rem] h-[26rem] relative"
                              >
                                <Image
                                  src={
                                    item.products?.image_1 || "/placeholder.jpg"
                                  }
                                  alt={item.products?.name || "Product"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="pr-4 md:pr0">
            <h2 className="text-lg font-medium mb-8 hidden md:block">
              PROFILE SETTINGS
            </h2>
            <form>
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
                    className="border-0 focus:border-b border-stone-300 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-sm sm:text-base"
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
                    className="border-0 focus:border-b border-stone-300 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-sm sm:text-base"
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
                    className="border-0 focus:border-b border-stone-300 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-sm sm:text-base"
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
                    className="border-0 focus:border-b border-stone-300 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-sm sm:text-base"
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
                    className="border-0 focus:border-b border-stone-300 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-sm sm:text-base"
                    placeholder="••••••••••••••••••••"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                {profile.name !== user?.user_metadata?.full_name ||
                profile.shippingAddress !==
                  user?.user_metadata?.shipping_address ||
                profile.phoneNumber !== user?.user_metadata?.phone_number ||
                profile.password !== "••••••••••••••••••••" ? (
                  <div className="mt-6">
                    <Button
                      variant={"box_yellow"}
                      onClick={handleProfileUpdate}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
