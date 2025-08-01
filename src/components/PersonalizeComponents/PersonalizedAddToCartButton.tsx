"use client";

import { useState } from "react";
import { useMainStore } from "@/store/mainStore";
import { usePersonalizeStore } from "@/store/personalizeStore";
import { PersonalizedCartToast } from "@/components/ui/personalized-cart-toast";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

export function PersonalizedAddToCartButton() {
  const { addToCart } = useMainStore();
  const { formData, selectedProduct, resetCheckout } = usePersonalizeStore();
  const router = useRouter();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedProduct) return;

    try {
      setIsLoading(true);

      const personalizationData = {
        yourName: formData.yourName,
        recipientName: formData.recipientName,
        recipientAddress: formData.recipientAddress,
        recipientCity: formData.recipientCity,
        recipientEmail: formData.recipientEmail,
        deliveryDate: formData.deliveryDate,
        preferredDeliveryTime: formData.preferredDeliveryTime,
        headerText: formData.headerText,
        selectedQuote: formData.selectedQuote,
        customMessage: formData.customMessage,
        smsUpdates: formData.smsUpdates,
        isPersonalized: true,
      };

      await addToCart(selectedProduct.id!, 1, personalizationData);
      setIsAdded(true);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 6000);

      setTimeout(() => setIsAdded(false), 3000);
    } catch (error) {
      console.error("Failed to add personalized item to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        className="bg-[#FDCF5F] px-5 flex items-center justify-center gap-1 hover:bg-[#FDCF5F]/80 text-stone-800 font-medium tracking-wider text-sm py-2.5 rounded-none transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          "Adding to Cart..."
        ) : isAdded ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Added to Cart
          </>
        ) : (
          <>Add Personalized Gift</>
        )}
      </button>

      <PersonalizedCartToast
        isVisible={showToast}
        onClose={handleCloseToast}
        productName={selectedProduct?.name || "Personalized Gift"}
        productImage={selectedProduct?.image_1}
        productPrice={selectedProduct?.price}
        onViewCart={handleViewCart}
        onContinueShopping={handleContinueShopping}
        personalizationData={{
          recipientName: formData.recipientName,
          headerText: formData.headerText,
          customMessage: formData.customMessage,
        }}
      />
    </>
  );
}
