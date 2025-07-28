"use client";

import React, { useState } from "react";
import { CheckoutContainer } from "@/components/CheckoutComponents/CheckoutContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ExternalLink, Sparkles } from "lucide-react";

const sampleItems = [
  {
    id: "wine-collection-1",
    name: "Premium Wine Collection",
    price: 299.99,
    quantity: 1,
    image: "/product.jpg",
  },
  {
    id: "wine-bottle-1",
    name: "Vintage Bordeaux 2018",
    price: 89.99,
    quantity: 2,
    image: "/product.jpg",
  },
];

export default function CheckoutDemoPage() {
  const [checkoutMethod, setCheckoutMethod] = useState<"elements" | "redirect">("elements");

  const total = sampleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-century text-stone-800 mb-4">
            Stripe Integration Demo
          </h1>
          <p className="text-lg text-stone-600 mb-8">
            Choose between Stripe Elements (embedded) or Stripe Checkout (redirect)
          </p>
          
          {/* Method Selection */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant={checkoutMethod === "elements" ? "default" : "outline"}
              onClick={() => setCheckoutMethod("elements")}
              className={`flex items-center gap-2 ${
                checkoutMethod === "elements" 
                  ? "bg-yellow-500 hover:bg-yellow-600 text-stone-800" 
                  : ""
              }`}
            >
              <CreditCard className="h-4 w-4" />
              Stripe Elements
              <Badge variant="secondary" className="ml-2">
                <Sparkles className="h-3 w-3 mr-1" />
                Recommended
              </Badge>
            </Button>
            <Button
              variant={checkoutMethod === "redirect" ? "default" : "outline"}
              onClick={() => setCheckoutMethod("redirect")}
              className={`flex items-center gap-2 ${
                checkoutMethod === "redirect" 
                  ? "bg-yellow-500 hover:bg-yellow-600 text-stone-800" 
                  : ""
              }`}
            >
              <ExternalLink className="h-4 w-4" />
              Stripe Checkout
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Method Description */}
          <div className="lg:col-span-1">
            <Card className="border-stone-200 h-fit">
              <CardHeader>
                <CardTitle className="text-lg">
                  {checkoutMethod === "elements" ? "Stripe Elements" : "Stripe Checkout"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {checkoutMethod === "elements" ? (
                  <>
                    <p className="text-stone-600">
                      Embedded payment form that keeps customers on your site. 
                      Provides a seamless, customizable checkout experience.
                    </p>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium text-green-700">✓ Better user experience</p>
                      <p className="font-medium text-green-700">✓ Customizable design</p>
                      <p className="font-medium text-green-700">✓ Full control over flow</p>
                      <p className="font-medium text-green-700">✓ Real-time validation</p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-stone-600">
                      Redirects to Stripe's hosted checkout page. 
                      Quick to implement with minimal code required.
                    </p>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium text-green-700">✓ Quick implementation</p>
                      <p className="font-medium text-green-700">✓ Stripe's UI/UX</p>
                      <p className="font-medium text-green-700">✓ Multi-language support</p>
                      <p className="font-medium text-blue-700">→ Redirects away from site</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutContainer
              items={sampleItems}
              total={total}
              useStripeElements={checkoutMethod === "elements"}
            />
          </div>
        </div>

        {/* Integration Notes */}
        <div className="mt-12">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">Integration Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-blue-700">
              <div>
                <h4 className="font-semibold mb-2">Stripe Elements Implementation:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Uses <code className="bg-blue-100 px-2 py-1 rounded">@stripe/react-stripe-js</code> for React components</li>
                  <li>• Creates PaymentIntent on the server</li>
                  <li>• Handles payment confirmation client-side</li>
                  <li>• Webhook processes successful payments</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Required Environment Variables:</h4>
                <ul className="space-y-1 text-sm font-mono">
                  <li>• NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</li>
                  <li>• STRIPE_SECRET_KEY</li>
                  <li>• STRIPE_WEBHOOK_SECRET (for webhooks)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
