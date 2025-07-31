"use client";

import React, { useState, useEffect } from "react";
// import { StripeProvider } from "./StripeProvider";
// import { StripeCheckoutForm } from "./StripeCheckoutForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Lock } from "lucide-react";
import { Product } from "@/app/api/types";

interface CheckoutContainerProps {
  items: Product[];
  useStripeElements?: boolean;
}

export function CheckoutContainer({ 
  items = [], 
  useStripeElements = false 
}: CheckoutContainerProps) {
  // Commented out: Old Stripe Elements approach
  // const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Simple checkout form state
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  /* Commented out: Old Stripe Elements implementation
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
  */

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSimpleCheckout = async () => {
    setLoading(true);
    setError(null);

    // Basic validation
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      // Calculate total
      const total = items.reduce((sum, item) => 
        sum + item.price * ((item as any).quantity || 1), 0
      );

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map(item => ({
            ...item,
            quantity: (item as any).quantity || 1
          })),
          customerInfo,
          total,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();
      
      if (data.sessionId) {
        // Redirect to Stripe Checkout
        const stripe = (window as any).Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      setError(error.message || "Failed to proceed to checkout");
    } finally {
      setLoading(false);
    }
  };

  /* Commented out: Old Stripe Elements loading and error states
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
  */

  // Simple checkout form
  return (
    <Card className="shadow-none border-none bg-transparent">
      <CardContent className="space-y-6 px-4 ">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={customerInfo.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="John"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={customerInfo.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Doe"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={customerInfo.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="john@example.com"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              disabled={loading}
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={handleSimpleCheckout}
          disabled={loading || !customerInfo.firstName || !customerInfo.lastName || !customerInfo.email}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-stone-800 font-medium py-3"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay Now - Secure Checkout
            </>
          )}
        </Button>

        <div className="text-center">
          <Badge variant="outline" className="text-stone-600 border-stone-300">
            <Lock className="h-3 w-3 mr-1" />
            Secured by Stripe
          </Badge>
          <p className="text-xs text-stone-500 mt-2">
            You will be redirected to Stripe's secure payment page
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
