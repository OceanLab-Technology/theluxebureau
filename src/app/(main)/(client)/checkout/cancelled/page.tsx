import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutCancelledPage() {
  return (
    // <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
    //   <div className="max-w-md w-full text-center space-y-6">
    //     <h1 className="text-4xl font-[Century-Old-Style] text-secondary-foreground">Payment Cancelled</h1>
    //     <p className="text-stone-600 text-sm">
    //       Your payment was cancelled. No charges were made.
    //     </p>
    //     <p className="text-sm text-stone-600">
    //       Your items are still in your cart. You can try checking out again or continue shopping.
    //     </p>
    //     <div className="flex flex-col gap-3">
    //       <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-stone-800">
    //         <Link href="/checkout">Try Again</Link>
    //       </Button>
    //       <Button asChild variant="outline" className="w-full border-stone-300">
    //         <Link href="/products">Continue Shopping</Link>
    //       </Button>
    //     </div>
    //     <p className="text-xs text-stone-500 font-[Marfa]">
    //       Need help? Email us at support@luxebureau.com
    //     </p>
    //   </div>
    // </div>

    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-transparent">
      <div className="max-w-md w-full space-y-6 text-left">
        {/* Header */}
        <div className="space-y-4">
          <h2 className="text-[#50462D] text-[30px] leading-[40px] lg:text-[36px] lg:leading-[48px] font-[400] font-[Century-Old-Style]">
            Payment Cancelled
          </h2>
          <p className="text-[#50462D] text-[14px] leading-[26px] lg:text-[18px] lg:leading-[28px] font-[Century-Old-Style]">
            Your payment was cancelled. No charges were made.
          </p>
        </div>

        {/* Continue Shopping Button */}
        <div className="">
          <div className="flex flex-col gap-3">
            <Button className="bg-[#FBD060] hover:bg-[#FBD060]/80 text-[#1E1204] font-schoolbook-cond font-[400] text-[0.70rem] leading-[119.58%] w-[18.812rem] h-[2rem] uppercase rounded-[0.25rem] hover:opacity-90 transition-opacity lg:text-[0.90rem] lg:w-[25.812rem] lg:h-[2.5rem]">
              <Link href="/checkout">Try Again</Link>
            </Button>
            <Button variant="outline" className="bg-[#50462D] hover:bg-[#50462D]/80 text-[#FAF7E7] hover:text-text-[#FAF7E7] font-schoolbook-cond font-[400] text-[0.70rem] leading-[119.58%] w-[18.812rem] h-[2rem] uppercase rounded-[0.25rem] hover:opacity-90 transition-opacity lg:text-[0.90rem] lg:w-[25.812rem] lg:h-[2.5rem]">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


