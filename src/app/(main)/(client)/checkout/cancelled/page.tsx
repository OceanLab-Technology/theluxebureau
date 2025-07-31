import React from "react";
import { XCircle, ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function CheckoutCancelledPage() {
  return (
    <div className="min-h-screen bg-[#FDF6E4] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="border-stone-200 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-century text-stone-800">
              Payment Cancelled
            </CardTitle>
            <p className="text-stone-600 mt-2">
              Your payment was cancelled and no charges were made.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-stone-600">
                Your items are still saved in your cart. You can continue shopping
                or try checking out again when you're ready.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-stone-800">
                <Link href="/checkout">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Try Again
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full border-stone-300">
                <Link href="/products">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
            
            <div className="text-center text-xs text-stone-500">
              Need help? Contact us at support@luxebureau.com
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
