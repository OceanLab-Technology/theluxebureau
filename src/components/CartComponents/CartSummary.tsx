"use client";

import { useMainStore } from "@/store/mainStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CartSummary() {
  const { cartItems, cartTotal, cartLoading } = useMainStore();

  const router = useRouter();

  console.log("CartSummary rendered with items:", cartItems.length, "Total:", cartTotal);
  

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-between items-end">
      <div className="md:flex-grow">
        <span className="md:text-lg font-medium">SUBTOTAL</span>

        <p className="md:text-sm text-xs text-stone-600 mb-6">
          TAXES AND SHIPPING CALCULATED AT CHECKOUT
        </p>
        <div className="flex justify-between items-center text-xl font-medium mb-8">
          <span>£{cartTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="ml-8 md:pb-0 pb-10">
        <Button
          onClick={handleCheckout}
          disabled={cartLoading || cartItems.length === 0}
          className="md:px-22 md:py-6 rounded-none bg-yellow-400 hover:bg-yellow-500 text-stone-700 font-medium uppercase tracking-wider"
        >
          CHECKOUT
        </Button>
      </div>
    </div>
  );
}
