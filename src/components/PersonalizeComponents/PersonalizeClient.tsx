"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePersonalizeStore } from "@/store/personalizeStore";
import { useMainStore } from "@/store/mainStore";
import PersonalizeForm from "@/components/PersonalizeComponents/PersonalizeForm";

export default function PersonalizeClient() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const { setSelectedProduct, selectedProduct, resetCheckout } =
    usePersonalizeStore();
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

  const images = [
    currentProduct?.image_1,
    currentProduct?.image_2,
    currentProduct?.image_3,
    currentProduct?.image_4,
  ].filter(Boolean);

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 min-h-screen pt-8">
      <div className="blur-xl md:flex hidden flex-col">
        <div className="space-y-4">
          <div className="lg:w-full lg:h-[60%] relative h-[30.5rem] bg-muted/20 overflow-hidden">
            <img
              src={currentProduct?.image || currentProduct?.image_1}
              alt={currentProduct?.name}
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {Array.from({ length: images.length }).map((_, index) => (
                <span
                  key={index}
                  className="h-2 w-2 rounded-full inline-block bg-background/50"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 px-4">
            {images.map((imageUrl, index) => (
              <button
                key={index}
                className="md:h-[10.375rem] md:w-[8.25rem] lg:w-full lg:h-full bg-muted/20 overflow-hidden border-2 border-transparent"
              >
                <img
                  src={imageUrl}
                  alt={`${currentProduct?.name} ${index + 1}`}
                  className="h-full w-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-8 bg-background border-l relative">
        <PersonalizeForm />
      </div>
    </div>
  );
}
