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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Header */}
        <div className="space-y-6">
          <h2 className="text-[#50462D] text-[34px] font-normal leading-[40px]" style={{ fontFamily: 'Century Old Style Std' }}>
            Your cart is empty
          </h2>
          
          <p className="text-[#50462D] text-[18px] font-normal leading-[22px]" style={{ fontFamily: 'Century Old Style Std' }}>
            Looks like you haven't added any items to your cart yet.
            Start exploring our products and add something you love.
          </p>
        </div>
        
        {/* Continue Shopping Button */}
        <div className="pt-4">
          <button
            onClick={handleStartShopping}
            className="bg-[#FBD060] text-[#1E1204] font-[SchoolBook] font-[400] text-[12px] leading-[120%]  tracking-[0.15em] uppercase text-center pt-[18px] pr-[32px] pb-[18px] pl-[32px] gap-[10px] rounded-[6px] hover:opacity-90 transition-opacity duration-200"
          >
            CONTINUE SHOPPING &gt;
          </button>
        </div>
      </div>
    </div>
  );
}