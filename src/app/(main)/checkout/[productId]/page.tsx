import React from "react";
import { CheckoutContainer } from "@/components/CheckoutComponents/CheckoutContainer";
import Image from "next/image";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#FDF6E4]">
      <div className="grid lg:grid-cols-2 min-h-screen">
        <div className="relative h-full min-h-[600px] lg:min-h-screen">
          <Image
            src="/product.jpg"
            alt="Luxury product"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            <CheckoutContainer useStripeElements={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
