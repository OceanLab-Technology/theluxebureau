"use client";

import { useMainStore } from "@/store/mainStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CartSummary() {
  const { cartItems, cartTotal, cartItemCount, cartLoading, products } =
    useMainStore();

  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const handleContinueShopping = () => {
    router.push("/products");
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-between items-end">
      <div className="flex-grow">
        <span className="text-lg font-medium">SUBTOTAL</span>

        <p className="text-sm text-stone-600 mb-6">
          TAXES AND SHIPPING CALCULATED AT CHECKOUT
        </p>
        <div className="flex justify-between items-center text-xl font-medium mb-8">
          <span>£{cartTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="ml-8">
        <Button
          onClick={handleCheckout}
          disabled={cartLoading || cartItems.length === 0}
          className="px-22 py-6 rounded-none bg-yellow-400 hover:bg-yellow-500 text-stone-700 font-medium uppercase tracking-wider"
        >
          CHECKOUT
        </Button>
      </div>
    </div>
  );
}
