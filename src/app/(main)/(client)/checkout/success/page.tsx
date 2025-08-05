import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-century text-secondary-foreground">Payment Successful</h1>
        <p className="text-stone-600 text-sm">
          Thank you for your purchase. Your order has been confirmed and a confirmation has been sent to your email.
        </p>
        <div className="flex flex-col gap-3">
          <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-stone-800">
            <Link href="/products">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline" className="w-full border-stone-300">
            <Link href="/account">View Order History</Link>
          </Button>
        </div>
        <p className="text-xs text-stone-500">
          Need help? Email us at support@luxebureau.com
        </p>
      </div>
    </div>
  );
}
