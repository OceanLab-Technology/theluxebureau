"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lock } from "lucide-react";
import { Product } from "@/app/api/types";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

interface CheckoutContainerProps {
  items: Product[];
}

export function CheckoutContainer({ items = [] }: CheckoutContainerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    checkInventoryAvailability,
    reserveCartInventory,
    releaseCartInventory,
  } = useCartStore();
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [emailWarning, setEmailWarning] = useState("");
  const [phoneWarning, setPhoneWarning] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailWarning(
        emailRegex.test(value) ? "" : "Please enter a valid email address."
      );
    }
    if (field === "phone") {
      const phoneRegex = /^\+?\d{10,15}$/;
      setPhoneWarning(
        value && !phoneRegex.test(value)
          ? "Please enter a valid phone number."
          : ""
      );
    }
  };

  const handleSimpleCheckout = async () => {
    setLoading(true);
    setError(null);

    if (
      !customerInfo.firstName ||
      !customerInfo.lastName ||
      !customerInfo.email
    ) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const inventoryAvailable = await checkInventoryAvailability();

      if (!inventoryAvailable) {
        setLoading(false);
        return;
      }

      const reservationSuccessful = await reserveCartInventory();

      if (!reservationSuccessful) {
        setLoading(false);
        return;
      }

      const total = items.reduce(
        (sum, item) => sum + item.price * ((item as any).quantity || 1),
        0
      );

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            ...item,
            quantity: (item as any).quantity || 1,
          })),
          customerInfo,
          recipientInfo: {
            firstName: customerInfo.firstName,
            lastName: customerInfo.lastName,
            email: customerInfo.email,
            phone: customerInfo.phone,
          },
          personalisation: items.map((item) => item.customData || ""),
          // ✅ Extract deliveryDate from first customData entry
          deliveryDate: items?.[0]?.customData?.deliveryDate || "",
          notes: "",
          total,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();

      if (data.sessionId) {
        const stripe = (window as any).Stripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        );
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      setError(error.message || "Failed to proceed to checkout");

      try {
        await releaseCartInventory();
        toast.error("Inventory reservation released due to checkout error");
      } catch (releaseError) {
        console.error("Failed to release inventory:", releaseError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-none border-none bg-transparent">
      <CardContent className="space-y-6 px-4 ">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <input
                id="firstName"
                value={customerInfo.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="John"
                className="border-0 w-full focus:border-b border-stone-500 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-sm sm:text-base"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <input
                id="lastName"
                value={customerInfo.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Doe"
                className="border-0 w-full focus:border-b border-stone-500 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-sm sm:text-base"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <input
              id="email"
              type="email"
              value={customerInfo.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="mary.oliver@example.com"
              className="border-0 w-full focus:border-b border-stone-500 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-sm sm:text-base"
              disabled={loading}
            />
            {emailWarning && (
              <p className="text-[#50462D] text-[12px] mt-0.5 font-[Marfa]">
                {emailWarning}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <input
              id="phone"
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder=" +44 0777 888 999"
              className="border-0 w-full focus:border-b border-stone-500 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-sm sm:text-base"
              disabled={loading}
            />
            {phoneWarning && (
              <p className="text-[#50462D] text-[12px] mt-0.5 font-[Marfa]">
                {phoneWarning}
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={handleSimpleCheckout}
          disabled={
            loading ||
            !customerInfo.firstName ||
            !customerInfo.lastName ||
            !customerInfo.email
          }
          className="w-full bg-[#FBD060] hover:bg-[#F9C74F] text-stone-800 font-medium py-3 rounded-[0.25rem]"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>Pay Now</>
          )}
        </Button>

        <div className="text-center">
          <Badge variant="outline" className="text-stone-600 border-stone-300">
            <Lock className="h-3 w-3 mr-1" />
            Secured by Stripe
          </Badge>
          <p
            className="text-xs font-[ABC Marfa] !font-[ABC Marfa] text-stone-500 mt-2"
            style={{ fontFamily: "ABC Marfa, sans-serif" }}
          >
            You will be redirected to Stripe's secure payment page
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
