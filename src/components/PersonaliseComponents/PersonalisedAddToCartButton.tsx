"use client";

import React, { useState, useEffect } from "react";
import { usePersonaliseStore } from "@/store/personaliseStore";
import { PersonalisedCartToast } from "@/components/ui/personalised-cart-toast";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

export function PersonalisedAddToCartButton({
  handleAddToCart,
  isAdded,
  isLoading,
}: {
  handleAddToCart: () => void;
  isLoading?: boolean;
  isAdded?: boolean;
}) {
  const { formData, selectedProduct, resetCheckout } = usePersonaliseStore();
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  // Show toast when item is successfully added
  useEffect(() => {
    if (isAdded) {
      setShowToast(true);
    }
  }, [isAdded]);

  const handleViewCart = () => {
    setShowToast(false);
    resetCheckout();
    router.push("/cart");
  };

  const handleContinueShopping = () => {
    setShowToast(false);
    resetCheckout();
    router.push("/products");
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <>
      <button
        onClick={handleAddToCart}
        disabled={isLoading || !selectedProduct}
        className="bg-[#FDCF5F] uppercase flex items-center justify-center gap-1 hover:bg-[#FDCF5F]/80 text-stone-800 tracking-wider text-[0.75rem] font-[400] px-[1.875rem] w-[11.56rem] md:text-sm md:py-[1.135rem] py-[.5rem] transition-colors cursor-pointer rounded-[0.25rem] leading-[119.58%] disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="text-xs md:text-sm">Adding...</span>
        ) : isAdded ? (
          <>
            <Check className="mr-1 h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden md:inline">Added to Cart</span>
            <span className="md:hidden">Added</span>
          </>
        ) : (
          <>
            <span className="hidden md:inline">Add to Cart</span>
            <span className="md:hidden">Add Gift</span>
          </>
        )}
      </button>

      <PersonalisedCartToast
        isVisible={showToast}
        onClose={handleCloseToast}
        productName={selectedProduct?.name || "Personalized Gift"}
        productImage={selectedProduct?.image_1}
        productPrice={selectedProduct?.price}
        onViewCart={handleViewCart}
        onContinueShopping={handleContinueShopping}
        personalisationData={{
          recipientName: formData.recipientName,
          headerText: formData.headerText,
          customMessage: formData.customMessage,
        }}
      />
    </>
  );
}
