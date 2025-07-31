import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutCancelledPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-stone-800">Payment Cancelled</h1>
        <p className="text-stone-600 text-sm">
          Your payment was cancelled. No charges were made.
        </p>
        <p className="text-sm text-stone-600">
          Your items are still in your cart. You can try checking out again or continue shopping.
        </p>
        <div className="flex flex-col gap-3">
          <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-stone-800">
            <Link href="/checkout">Try Again</Link>
          </Button>
          <Button asChild variant="outline" className="w-full border-stone-300">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
        <p className="text-xs text-stone-500">
          Need help? Email us at support@luxebureau.com
        </p>
      </div>
    </div>
  );
}
