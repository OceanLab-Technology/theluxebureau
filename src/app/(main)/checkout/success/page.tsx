import React from "react";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'next-view-transitions';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FDF6E4] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="border-stone-200 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-century text-stone-800">
              Payment Successful!
            </CardTitle>
            <p className="text-stone-600 mt-2">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-stone-700">
                <Package className="w-5 h-5" />
                <span className="font-medium">Order confirmation sent to your email</span>
              </div>
              
              <p className="text-sm text-stone-600">
                You will receive a tracking number once your order ships.
                Delivery typically takes 3-5 business days.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-stone-800">
                <Link href="/products">
                  Continue Shopping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full border-stone-300">
                <Link href="/account">
                  View Order History
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
