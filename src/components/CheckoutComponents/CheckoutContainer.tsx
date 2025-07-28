"use client";

import React, { useState, useEffect } from "react";
import { StripeProvider } from "./StripeProvider";
import { StripeCheckoutForm } from "./StripeCheckoutForm";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutContainerProps {
  items?: CheckoutItem[];
  total?: number;
  useStripeElements?: boolean;
}

export function CheckoutContainer({ 
  items = [], 
  total = 0, 
  useStripeElements = true 
}: CheckoutContainerProps) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkoutItems = items.length > 0 ? items : [
    {
      id: "1",
      name: "Luxury Wine Collection",
      price: 299.99,
      quantity: 1,
      image: "/product.jpg",
    },
  ];

  const subtotal = items.length > 0 ? total : 299.99;
  const shipping = 15.0;
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + shipping + tax;

  useEffect(() => {
    if (useStripeElements) {
      createPaymentIntent();
    }
  }, [useStripeElements]);

  const createPaymentIntent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/stripe/payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: checkoutItems,
          customerInfo: {
            firstName: "",
            lastName: "",
            email: "",
            address: "",
            city: "",
            postalCode: "",
            country: "United States",
          },
          total: finalTotal,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const data = await response.json();
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        throw new Error(data.error || "Failed to create payment intent");
      }
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      setError(error.message || "Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };

  if (useStripeElements && loading) {
    return (
      <Card className="border-stone-200">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
            <span className="text-stone-600">Initializing secure payment...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (useStripeElements && error) {
    return (
      <Card className="border-red-200">
        <CardContent className="py-12 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={createPaymentIntent}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-stone-800 rounded-md font-medium"
          >
            Try Again
          </button>
        </CardContent>
      </Card>
    );
  }

  // Render Stripe Elements checkout
  if (useStripeElements && clientSecret) {
    return (
      <StripeProvider clientSecret={clientSecret}>
        <StripeCheckoutForm
          items={checkoutItems}
          total={subtotal}
          clientSecret={clientSecret}
        />
      </StripeProvider>
    );
  }
}
