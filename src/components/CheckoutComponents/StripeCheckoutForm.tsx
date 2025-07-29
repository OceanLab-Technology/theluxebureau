"use client";

import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Product } from "@/app/api/types";

interface StripeCheckoutFormProps {
  items?: Product[];
  clientSecret: string;
}

export function StripeCheckoutForm({
  clientSecret,
}: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "An error occurred");
        setLoading(false);
        return;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
      });

      if (confirmError) {
        setError(confirmError.message || "Payment failed");
      } else {
        console.log("Payment succeeded!");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setError(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-century">
      <div className="border-stone-200">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <PaymentElement
                options={{
                  layout: "auto",
                  fields: {
                    billingDetails: {
                      email: "auto",
                      address: "auto",
                      name: "auto",
                      phone: "auto",
                    },
                  },
                }}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              variant={"box_yellow"}
              disabled={loading || !stripe || !elements}
              className="w-full text-stone-700 font-[200] py-3 cursor-pointer "
            >
              {loading ? "Processing Payment..." : "Pay now"}
            </Button>
          </form>
        </div>
      </div>

      <div className="text-center">
        <Badge variant="outline" className="text-stone-600 border-stone-300">
          <Lock className="h-3 w-3 mr-1" />
          Secured by Stripe
        </Badge>
        <p className="text-xs text-stone-500 mt-2">
          Your payment information is encrypted and secure
        </p>
      </div>
    </div>
  );
}
