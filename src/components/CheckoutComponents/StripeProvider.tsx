"use client";

// OLD STRIPE ELEMENTS APPROACH - COMMENTED OUT FOR REFERENCE
// This provider component wraps Stripe Elements for embedded payment forms
// Now replaced with simple checkout that redirects to Stripe's hosted page

import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

interface StripeProviderProps {
  children: React.ReactNode;
  clientSecret?: string;
}

export function StripeProvider({
  children,
  clientSecret,
}: StripeProviderProps) {
  const options = {
    // passing the client secret obtained from the server
    ...(clientSecret && { clientSecret }),
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#eab308", // yellow-500
        colorBackground: "#ffffff",
        colorText: "#1c1917", // stone-800
        colorDanger: "#dc2626",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "6px",
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
