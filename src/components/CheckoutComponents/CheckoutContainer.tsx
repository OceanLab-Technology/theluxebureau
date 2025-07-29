"use client";

import React, { useState, useEffect } from "react";
import { StripeProvider } from "./StripeProvider";
import { StripeCheckoutForm } from "./StripeCheckoutForm";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Product } from "@/app/api/types";

interface CheckoutContainerProps {
  items: Product[];
  useStripeElements?: boolean;
}

export function CheckoutContainer({ 
  items = [], 
  useStripeElements = true 
}: CheckoutContainerProps) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          items,
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

  if (useStripeElements && clientSecret) {
    return (
      <StripeProvider clientSecret={clientSecret}>
        <StripeCheckoutForm
          items={items}
          clientSecret={clientSecret}
        />
      </StripeProvider>
    );
  }
}
