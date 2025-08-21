"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface EmptyCartProps {
  onClose?: () => void;
}

export function EmptyCart({ onClose }: EmptyCartProps) {
  const router = useRouter();

  const handleStartShopping = () => {
    if (onClose) {
      onClose(); // Close the sheet instead of navigating
    } else {
      router.push("/products"); // Navigate if not in sheet (legacy behavior)
    }
  };

  return (
    <div className=" min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <h2 className="text-[#40362c] font-century text-3xl font-[500] leading-tight">
            Your cart is empty
          </h2>
          
          <p className="text-[oklch(54.45%_0.0296_76.5643)] font-century text-[16px] font-[400] leading-6">
            Looks like you haven't added any items to your cart yet.
            <br />
            Start exploring our products and add something you love.
          </p>
        </div>

        {/* Continue Shopping Button */}
        <div className="pt-4">
          <button
            onClick={handleStartShopping}
            className="w-full bg-[#E8B851] text-[#6B5B3F] font-schoolbook-cond text-[14px] uppercase tracking-[0.1em] py-4 px-8 rounded-none border-none hover:bg-[#D4A441] transition-colors duration-200 font-[400]"
          >
            CONTINUE SHOPPING &gt;
          </button>
        </div>
      </div>
    </div>
  );
}