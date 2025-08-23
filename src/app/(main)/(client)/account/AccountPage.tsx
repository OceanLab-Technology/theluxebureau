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
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react"; 

const OrderSkeleton = () => (
  <div className="mb-8 space-y-10 animate-pulse">
    <div className="flex flex-col md:flex-row small-text md:items-start justify-between mb-4 md:mb-6">
      <div className="mb-4 md:mb-0 space-y-2">
        <div className="h-4 bg-stone-200 rounded w-24"></div>
        <div className="h-4 bg-stone-200 rounded w-32"></div>
        <div className="h-4 bg-stone-200 rounded w-20"></div>
      </div>
      <div className="h-10 bg-stone-200 rounded w-32"></div>
    </div>
    <div className="relative w-full">
      <div className="overflow-x-auto overflow-y-hidden hide-scrollbar">
        <div className="flex gap-4 pb-4 w-max">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex-shrink-0 bg-stone-200 w-[22rem] h-[26rem] relative rounded"
            ></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

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
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 3,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const supabase = createClient(); // Create client inside component

  const [profile, setProfile] = useState({
    name: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    shippingAddress: user?.user_metadata?.shipping_address || "",
    phoneNumber: user?.user_metadata?.phone_number || "",
    password: "••••••••••••••••••••",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false); 

  // Fetch user's orders
  const fetchOrders = async (page: number = 1) => {
    try {
      setIsLoadingOrders(true);
      const response = await fetch(`/api/orders/user?page=${page}`);
      if (response.ok) {
        const result = await response.json();
        setOrders(result.data || []);
        setPagination(
          result.pagination || {
            page: 1,
            limit: 3,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          }
        );
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
    fetchOrders(currentPage);
  }, [products, fetchProducts, currentPage]);

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

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const userName = profile.name || user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      <main className="relative grid grid-cols-1 md:grid-cols-5 md:flex-row flex-col md:pl-20 pl-4 min-h-[calc(100vh-64px)]">
        <div className="md:w-64 w-full col-span-1 md:py-35 py-8">
          <h1 className="block md:hidden text-[2rem] leading-[2.5rem] tracking-[.1rem] font-light mb-6 font-century">
            Welcome back,
            <br />
            {userName}
          </h1>
          <div className="md:space-y-1 md:pt-22 md:text-[1rem] small-text uppercase tracking-wider md:block flex md:flex-col flex-row space-x-4 md:space-x-0">
            <div 
              className={`text-secondary-foreground hover:text-stone-500 transition-colors cursor-pointer font-medium ${
                activeTab === 'orders' ? 'md:border-none border-b border-secondary-foreground md:border-b' : 'md:border-b-0'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              ORDER HISTORY
            </div>
            <div
              className={`text-secondary-foreground hover:text-stone-500 transition-colors cursor-pointer font-medium ${
                activeTab === 'profile' ? 'border-b border-secondary-foreground md:border-b-0' : ''
              }`}
              onClick={() => {
                setActiveTab('profile');
                if (window.innerWidth >= 768) {
                  document.getElementById("profile-settings")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
            >
              PROFILE SETTINGS
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="flex-1 md:py-20 py-6 md:px-10 px-0 col-span-4 ">
          <h1 className="md:block hidden text-[2.5rem] font-light mb-12 font-century">
            Welcome back, {userName}
          </h1>

          <div className="hidden md:block">
            <div className="mb-16">
              <h2 className="text-lg font-medium mb-6 border-b border-stone-300 small-text">
                ORDER HISTORY
              </h2>
              {isLoadingOrders ? (
                <div className="space-y-8">
                  {[1, 2, 3].map((item) => (
                    <OrderSkeleton key={item} />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-stone-500 mb-4">No orders found</div>
                  <Link href="/products"></Link>
                  <Button variant={"box_yellow"}>Start Shopping</Button>
                </div>
              ) : (
                orders.map((order, index) => {
                  const orderNumber = String(
                    pagination.total - (pagination.page - 1) * pagination.limit - index
                  ).padStart(3, "0");
                  return (
                    <div key={order.id} className="mb-8 space-y-10">
                      <div className="flex flex-col md:flex-row small-text md:items-start justify-between mb-4 md:mb-6">
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
                          <Button
                            variant="box_yellow"
                            className="px-14 h-10 rounded-sm"
                          >
                            VIEW ORDER
                          </Button>
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

              {/* Pagination Controls */}
              {isLoadingOrders ? (
                <div className="flex justify-center items-center space-x-4 mt-8 mb-8 animate-pulse">
                  <div className="h-10 bg-stone-200 rounded w-20"></div>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="w-10 h-10 bg-stone-200 rounded"
                      ></div>
                    ))}
                  </div>
                  <div className="h-10 bg-stone-200 rounded w-16"></div>
                </div>
              ) : (
                orders.length > 0 &&
                pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4 mt-8 mb-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!pagination.hasPrev || isLoadingOrders}
                      className="px-4 py-2"
                    >
                      Previous
                    </Button>

                    <div className="flex items-center space-x-2">
                      {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <Button
                          key={page}
                          variant={
                            currentPage === page ? "box_yellow" : "outline"
                          }
                          onClick={() => setCurrentPage(page)}
                          disabled={isLoadingOrders}
                          className="w-10 h-10"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!pagination.hasNext || isLoadingOrders}
                      className="px-4 py-2"
                    >
                      Next
                    </Button>
                  </div>
                )
              )}
            </div>

            <div className="pr-4 md:pr0" id="profile-settings">
              <h2 className="small-text mb-8 hidden md:block border-b border-stone-300 pb-1">
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
                      className="border-0 font-century focus:border-b border-stone-300 bg-transparent px-0 py-2 sm:py-3 text-secondary-foreground placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none md:text-[1.5rem]"
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
                      className="border-0 font-century focus:border-b border-stone-300 bg-transparent px-0 py-2 sm:py-3 text-secondary-foreground placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none md:text-[1.5rem]"
                      placeholder="johndoe@example.com"
                    />
                  </div>

                  <div className="border border-stone-300 p-4 md:p-6">
                    <Label className="block text-xs font-medium mb-2 tracking-wider uppercase text-stone-500">
                      BILLING ADDRESS
                    </Label>
                    <Input
                      value={profile.shippingAddress}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          shippingAddress: e.target.value,
                        })
                      }
                      className="border-0 font-century focus:border-b border-stone-300 bg-transparent px-0 py-2 sm:py-3 text-secondary-foreground placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none md:text-[1.5rem]"
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
                      className="border-0 font-century focus:border-b border-stone-300 bg-transparent px-0 py-2 sm:py-3 text-secondary-foreground placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none md:text-[1.5rem]"
                      placeholder="+44 222 333 4444"
                    />
                  </div>

                  <div className="border border-stone-300 p-4 md:p-6 md:col-span-1 relative">
                    <Label className="block text-xs font-medium mb-2 tracking-wider uppercase text-stone-500">
                      PASSWORD
                    </Label>
                    <div className="relative">
                      <Input
                        type={isPasswordVisible ? "text" : "password"} 
                        value={profile.password} 
                        onChange={(e) =>
                          setProfile({ ...profile, password: e.target.value })
                        }
                        className="border-0 font-century focus:border-b border-stone-300 bg-transparent px-0 py-2 sm:py-3 text-secondary-foreground placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none md:text-[1.5rem]"
                        placeholder="••••••••••••••••••••"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility} 
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-stone-500 hover:text-stone-700"
                      >
                        {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
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

          {/* Mobile tab view with animations */}
          <div className="md:hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, filter: 'blur(4px)', x: -20 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
                  exit={{ opacity: 0, filter: 'blur(4px)', x: 20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mb-16"
                >
                  <h2 className="text-lg font-medium mb-6 border-b border-stone-300 small-text">
                    ORDER HISTORY
                  </h2>
                  {isLoadingOrders ? (
                    <div className="space-y-8">
                      {[1, 2, 3].map((item) => (
                        <OrderSkeleton key={item} />
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-stone-500 mb-4">No orders found</div>
                      <Link href="/products"></Link>
                      <Button variant={"box_yellow"}>Start Shopping</Button>
                    </div>
                  ) : (
                    orders.map((order, index) => {
                      const orderNumber = String(
                        pagination.total - (pagination.page - 1) * pagination.limit - index
                      ).padStart(3, "0");
                      return (
                        <div key={order.id} className="mb-8 space-y-10">
                          <div className="flex flex-col md:flex-row small-text md:items-start justify-between mb-4 md:mb-6">
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
                              <Button
                                variant="box_yellow"
                                className="px-14 h-10 rounded-sm"
                              >
                                VIEW ORDER
                              </Button>
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

                  {/* Pagination Controls */}
                  {isLoadingOrders ? (
                    <div className="flex justify-center items-center space-x-4 mt-8 mb-8 animate-pulse">
                      <div className="h-10 bg-stone-200 rounded w-20"></div>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3].map((item) => (
                          <div
                            key={item}
                            className="w-10 h-10 bg-stone-200 rounded"
                          ></div>
                        ))}
                      </div>
                      <div className="h-10 bg-stone-200 rounded w-16"></div>
                    </div>
                  ) : (
                    orders.length > 0 &&
                    pagination.totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-4 mt-8 mb-8">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={!pagination.hasPrev || isLoadingOrders}
                          className="px-4 py-2"
                        >
                          Previous
                        </Button>

                        <div className="flex items-center space-x-2">
                          {Array.from(
                            { length: pagination.totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "box_yellow" : "outline"
                              }
                              onClick={() => setCurrentPage(page)}
                              disabled={isLoadingOrders}
                              className="w-10 h-10"
                            >
                              {page}
                            </Button>
                          ))}
                        </div>

                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={!pagination.hasNext || isLoadingOrders}
                          className="px-4 py-2"
                        >
                          Next
                        </Button>
                      </div>
                    )
                  )}
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, filter: 'blur(4px)', x: -20 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
                  exit={{ opacity: 0, filter: 'blur(4px)', x: 20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="pr-4 md:pr0"
                >
                  <h2 className="small-text mb-8 border-b border-stone-300 pb-1">
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
                          className="border-0 font-century focus:border-b border-stone-300 bg-transparent px-0 py-2 sm:py-3 text-secondary-foreground placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none md:text-[1.5rem]"
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
                          className="border-0 font-century focus:border-b border-stone-300 bg-transparent px-0 py-2 sm:py-3 text-secondary-foreground placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none md:text-[1.5rem]"
                          placeholder="johndoe@example.com"
                        />
                      </div>

                      <div className="border border-stone-300 p-4 md:p-6">
                        <Label className="block text-xs font-medium mb-2 tracking-wider uppercase text-stone-500">
                          DELIVERY ADDRESS
                        </Label>
                        <Input
                          value={profile.shippingAddress}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              shippingAddress: e.target.value,
                            })
                          }
                          className="border-0 font-century focus:border-b border-stone-300 bg-transparent px-0 py-2 sm:py-3 text-secondary-foreground placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none md:text-[1.5rem]"
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
                          className="border-0 font-century focus:border-b border-stone-300 bg-transparent px-0 py-2 sm:py-3 text-secondary-foreground placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none md:text-[1.5rem]"
                          placeholder="+44 222 333 4444"
                        />
                      </div>

                      
                    <div className="border border-stone-300 p-4 md:p-6 md:col-span-1 relative">
                      <Label className="block text-xs font-medium mb-2 tracking-wider uppercase text-stone-500">
                        PASSWORD
                      </Label>
                      <div className="relative">
                        <Input
                          type={isPasswordVisible ? "text" : "password"} 
                          value={profile.password} 
                          onChange={(e) =>
                            setProfile({ ...profile, password: e.target.value })
                          }
                          className="border-0 font-century focus:border-b border-stone-300 bg-transparent px-0 py-2 sm:py-3 text-secondary-foreground placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none md:text-[1.5rem]"
                          placeholder="••••••••••••••••••••"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility} 
                          className="absolute right-0 top-1/2 transform -translate-y-1/2 text-stone-500 hover:text-stone-700"
                        >
                          {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}