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
    <div className="max-w-md mx-auto flex justify-center items-center h-[calc(100vh-4rem)]">
      <div className="pt-6">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-stone-900">
              Your cart is empty
            </h2>
            <p className="text-stone-600">
              Looks like you haven't added any items to your cart yet. Start
              exploring our products and add some items you love.
            </p>
          </div>
          <div className="space-y-3">
            <Button onClick={handleStartShopping} className="w-full" size="lg">
              {onClose ? "Continue Shopping" : "Start Shopping"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="text-sm text-stone-500">
              Or browse our featured products below
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
