"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePersonalizeStore } from "@/store/personalizeStore";
import { useMainStore } from "@/store/mainStore";
import PersonalizeForm from "@/components/PersonalizeComponents/PersonalizeForm";

export default function PersonalizePage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const { setSelectedProduct, selectedProduct, resetCheckout } = usePersonalizeStore();
  const { fetchProductById, currentProduct } = useMainStore();

  useEffect(() => {
    if (productId) {
      // If there's a product ID and it's different from the current one, fetch it
      if (!selectedProduct || selectedProduct.id !== productId) {
        fetchProductById(productId);
      }
    }
  }, [productId, selectedProduct, fetchProductById]);

  useEffect(() => {
    // When the product is fetched, set it as the selected product
    if (currentProduct && currentProduct.id === productId) {
      setSelectedProduct(currentProduct);
    }
  }, [currentProduct, productId, setSelectedProduct]);

  // If no product is selected and no productId is provided, redirect back
  useEffect(() => {
    if (!productId && !selectedProduct) {
      window.history.back();
    }
  }, [productId, selectedProduct]);

  return (
    <div className="grid grid-cols-2 min-h-screen">
      <div className="h-[calc(100vh-4.1rem)] flex items-center justify-center">
        {selectedProduct?.image_1 ? (
          <img 
            className="object-cover h-full w-full" 
            src={selectedProduct.image_1} 
            alt={selectedProduct.name || "Product"} 
          />
        ) : (
          <img className="object-cover h-full w-full" src="/image.png" alt="" />
        )}
      </div>
      <div className="px-6 py-8">
        <PersonalizeForm />
      </div>
    </div>
  );
}
