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
      onClose();
    } else {
      router.push("/products");
    }
  };
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-[#FDF9ED]">
      <div className="max-w-md w-full space-y-6 text-left">
        {/* Header */}
        <div className="space-y-4">
          <h2 className="text-[#50462D] text-[30px] leading-[40px] lg:text-[36px] lg:leading-[48px] font-[400] font-century">
            Your cart is empty
          </h2>
          <p className="text-[#50462D] text-[14px] leading-[26px] lg:text-[18px] lg:leading-[28px] font-century">
            Looks like you haven’t added any items to your cart yet.
            <br />
            Start exploring our products and add something you love.
          </p>
        </div>

        {/* Continue Shopping Button */}
        <div className="">
          <button
            onClick={handleStartShopping}
            className="bg-[#FBD060] text-[#1E1204] font-schoolbook-cond font-[400] text-[0.70rem] leading-[119.58%] w-[18.812rem] h-[2.25rem] uppercase rounded-[6px] hover:opacity-90 transition-opacity lg:text-[0.75rem] lg:w-[20.812rem] lg:h-[2.5rem]"
          >

            CONTINUE SHOPPING &gt;
          </button>
        </div>
      </div>
    </div>
  );


}