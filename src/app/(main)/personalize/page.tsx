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
      if (!selectedProduct || selectedProduct.id !== productId) {
        fetchProductById(productId);
      }
    }
  }, [productId, selectedProduct, fetchProductById]);

  useEffect(() => {
    if (currentProduct && currentProduct.id === productId) {
      setSelectedProduct(currentProduct);
    }
  }, [currentProduct, productId, setSelectedProduct]);

  useEffect(() => {
    if (!productId && !selectedProduct) {
      window.history.back();
    }
  }, [productId, selectedProduct]);

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 min-h-screen">
      <div className="h-[calc(100vh-4.1rem)] items-center justify-center md:flex hidden">
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
