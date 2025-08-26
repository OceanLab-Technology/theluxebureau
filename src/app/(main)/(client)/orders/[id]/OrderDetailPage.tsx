"use client";

import React from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/AuthComponents/LogoutButton";

import { Product } from "@/app/api/types";
import { NonUnderlineProductCard } from "@/components/CheckoutComponents/NonUnderlineProductCard";

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface OrderItem {
  id: string;
  order_id: string;
  products: {
    id: string;
    name: string;
    image_1: string;
    price?: number;
  };
  quantity: number;
  price_at_purchase: number;
  custom_data?: any;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  recipient_name: string;
  recipient_address: string;
  delivery_date: string;
  notes?: string;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  payment_status: string;
  delivery_status?: string;
  order_items: OrderItem[];
  personalization?: any[];
}

interface OrderDetailPageProps {
  order: Order;
  user: User;
}

export default function OrderDetailPage({ order, user }: OrderDetailPageProps) {
  const orderNumber = order.id.slice(-3).padStart(3, "0");

  const formattedData: Product[] = order.order_items.map((item) => ({
    id: item.products.id,
    name: item.products.name,
    image_1: item.products.image_1,
    price: item.price_at_purchase,
    inventory: 1,
    quantity: item.quantity,
    customData: item.custom_data || {},
    contains_alcohol: false,
    variants: "",
    selectedVariant: ""
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background font-[Marfa]">
      <main className="relative grid md:grid-cols-5 grid-cols-1 md:px-20 px-4 min-h-[calc(100vh-64px)]">
        <div className="md:w-64 w-full md:py-20 py-6 col-span-1">
          <div className="small-text uppercase md:flex hidden md:flex-col flex-row space-x-4 md:space-x-0">
            <Link
              href="/account"
              className="hover:text-stone-800 text-muted transition-colors"
            >
              BACK TO ORDERS
            </Link>
            <div className="md:mt-30 flex flex-col items-start space-y-1">
              <Link
                href="/account"
                className="text-stone-800 font-medium hover:text-stone-500"
              >
                ORDER HISTORY
              </Link>
              <Link
                href="/account"
                className="text-stone-800 font-medium hover:text-stone-500"
              >
                PROFILE SETTINGS
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>

        <div className="flex-1 md:py-20 py-6 md:px-10 px-0 col-span-4">
          <div className="mb-6">
            <h2 className="border-b mb-2 small-text pb-1 text-secondary-foreground font-semibold w-full">
              ORDER HISTORY
            </h2>
          </div>

          <div className="mb-8">
            <div className="flex flex-col md:items-start justify-between mb-1 md:mb-2">
              <div className="mb-2 uppercase small-text md:mb-2">
                <h3 className="mb-1">Order no.{orderNumber}</h3>
                <h3 className="mb-1">
                  {new Date(order.created_at).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long"
                  }).toUpperCase()}
                </h3>
                <h3 className="">£{order.total_amount?.toFixed(2)}</h3>
              </div>
            </div>

            {order.order_items && order.order_items.length > 0 && (
              <div className="mb-6">
                <div className="relative">
                  <div className="space-y-12 pb-4">
                    {order.order_items.map((item, itemIndex) => (
                      <div key={item.id} className="flex-shrink-0">
                        <NonUnderlineProductCard
                          isOrder={true}
                          product={formattedData[itemIndex]}
                          index={itemIndex}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}