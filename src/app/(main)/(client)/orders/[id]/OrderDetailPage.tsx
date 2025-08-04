"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

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
  // Calculate order number (this would ideally come from the database)
  const orderNumber = order.id.slice(-3).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-background font-century">
      <main className="relative flex md:flex-row flex-col md:px-20 px-4 min-h-[calc(100vh-64px)]">
        <div className="md:w-64 w-full md:py-20 py-6">
          <div className="md:space-y-2 md:pt-22 md:text-[1rem] text-xs uppercase tracking-wider">
            <Link 
              href="/account" 
              className="text-stone-500 hover:text-stone-800 md:mb-4 mb-0 block"
            >
              ← BACK TO ORDERS
            </Link>
          </div>
        </div>

        <div className="flex-1 md:py-20 py-6 md:px-10 px-0">
          <div className="mb-8">
            <div className="text-sm text-stone-500 uppercase tracking-wider mb-2">
              <Link href="/account" className="hover:text-stone-800">
                BACK TO ORDERS
              </Link>
            </div>
            <h1 className="text-3xl font-light mb-6">
              Order no.{orderNumber}
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column - Order Details */}
            <div>
              <div className="mb-8">
                <h2 className="text-xs text-stone-500 uppercase tracking-wider mb-4">
                  ORDER DETAILS
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-stone-500">Order created on:</span>{" "}
                    <span className="text-stone-800">
                      {new Date(order.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500">Total amount:</span>{" "}
                    <span className="text-stone-800 font-medium">
                      ${order.total_amount?.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500">Status:</span>{" "}
                    <span className="text-stone-800 capitalize">{order.status}</span>
                  </div>
                  <div>
                    <span className="text-stone-500">Payment status:</span>{" "}
                    <span className="text-stone-800 capitalize">{order.payment_status}</span>
                  </div>
                  <div>
                    <span className="text-stone-500">Delivery date:</span>{" "}
                    <span className="text-stone-800">
                      {new Date(order.delivery_date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recipient Information */}
              {order.recipient_name && (
                <div className="mb-8">
                  <h3 className="text-xs text-stone-500 uppercase tracking-wider mb-4">
                    RECIPIENT INFORMATION
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-stone-500">Name:</span>{" "}
                      <span className="text-stone-800">{order.recipient_name}</span>
                    </div>
                    {order.recipient_address && (
                      <div>
                        <span className="text-stone-500">Address:</span>{" "}
                        <span className="text-stone-800">{order.recipient_address}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="mb-8">
                <h3 className="text-xs text-stone-500 uppercase tracking-wider mb-4">
                  COMPONENTS
                </h3>
                <div className="space-y-4">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-stone-200">
                      <div className="w-16 h-16 bg-stone-100 relative">
                        <Image
                          src={item.products?.image_1 || "/placeholder.jpg"}
                          alt={item.products?.name || "Product"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-stone-800">
                          {item.products?.name}
                        </div>
                        <div className="text-xs text-stone-500">
                          Quantity: {item.quantity}
                        </div>
                        <div className="text-sm text-stone-800">
                          ${item.price_at_purchase?.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Product Images */}
            <div>
              <h3 className="text-xs text-stone-500 uppercase tracking-wider mb-4">
                PRODUCT IMAGES
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="bg-stone-100 aspect-square relative">
                    <Image
                      src={item.products?.image_1 || "/placeholder.jpg"}
                      alt={item.products?.name || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Personalization Details */}
          {order.personalization && order.personalization.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xs text-stone-500 uppercase tracking-wider mb-4">
                PERSONALIZATION DETAILS
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {order.personalization.map((personalization, index) => (
                  <div key={index} className="p-6 border border-stone-200">
                    <div className="text-sm font-medium mb-4">
                      Personalization #{index + 1}
                    </div>
                    <div className="space-y-2 text-sm">
                      {personalization.recipientName && (
                        <div>
                          <span className="text-stone-500">Recipient:</span>{" "}
                          <span className="text-stone-800">{personalization.recipientName}</span>
                        </div>
                      )}
                      {personalization.customMessage && (
                        <div>
                          <span className="text-stone-500">Message:</span>{" "}
                          <span className="text-stone-800">{personalization.customMessage}</span>
                        </div>
                      )}
                      {personalization.deliveryDate && (
                        <div>
                          <span className="text-stone-500">Delivery Date:</span>{" "}
                          <span className="text-stone-800">
                            {new Date(personalization.deliveryDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {personalization.preferredDeliveryTime && (
                        <div>
                          <span className="text-stone-500">Delivery Time:</span>{" "}
                          <span className="text-stone-800">{personalization.preferredDeliveryTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <Button 
              asChild
              className="bg-yellow-400 hover:bg-yellow-500 text-stone-800 px-6 py-2 text-xs uppercase tracking-wider"
            >
              <Link href="/account">BACK TO ACCOUNT</Link>
            </Button>
            {order.status === 'Active' && (
              <Button 
                variant="outline"
                className="border-stone-300 text-stone-800 px-6 py-2 text-xs uppercase tracking-wider"
              >
                TRACK ORDER
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
