import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-transparent">
      <div className="max-w-md w-full space-y-6 text-left">
        {/* Header */}
        <div className="space-y-4">
          <h2 className="text-[#50462D] text-[30px] leading-[40px] lg:text-[36px] lg:leading-[48px] font-[400] font-[Century-Old-Style]">
            Payment Successful
          </h2>
          <p className="text-[#50462D] text-[14px] leading-[26px] lg:text-[18px] lg:leading-[28px] font-[Century-Old-Style]">
            Thank you for your purchase, your order has been confirmed and a confirmation has been sent to your email address.
          </p>
        </div>

        {/* Continue Shopping Button */}
        <div className="">
          <div className="flex flex-col gap-3">
            <Button className="bg-[#FBD060] hover:bg-[#FBD060]/80 text-[#1E1204] font-schoolbook-cond font-[400] text-[0.70rem] leading-[119.58%] w-[18.812rem] h-[2rem] uppercase rounded-[0.25rem] hover:opacity-90 transition-opacity lg:text-[0.90rem] lg:w-[25.812rem] lg:h-[2.5rem]">
              <Link href="/products">Continue Shopping</Link>
            </Button>
            <Button variant="outline" className="bg-[#50462D] hover:bg-[#50462D]/80 text-[#FAF7E7] hover:text-text-[#FAF7E7] font-schoolbook-cond font-[400] text-[0.70rem] leading-[119.58%] w-[18.812rem] h-[2rem] uppercase rounded-[0.25rem] hover:opacity-90 transition-opacity lg:text-[0.90rem] lg:w-[25.812rem] lg:h-[2.5rem]">
              <Link href="/account">View Order History</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


// <button
//   onClick={handleBack}
//   disabled={isLoading}
//   className="bg-[#50462D] hover:bg-[#50462D]/80 text-[#FAF7E7] tracking-wider text-[0.75rem] font-[400] px-[1.875rem] w-[11.56rem] md:text-sm md:py-[1.135rem] transition-colors cursor-pointer rounded-[0.25rem] leading-[119.58%] disabled:opacity-50 disabled:cursor-not-allowed"
// >
