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

  let productImages = [
    currentProduct?.image_1,
    currentProduct?.image_2,
    currentProduct?.image_3,
    currentProduct?.image_4,
    currentProduct?.image_5,
  ].filter(Boolean); // remove undefined/null

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 min-h-screen">
      <div className="h-[calc(100vh-4.1rem)] blur-xl overflow-hidden md:flex hidden flex-col">
        <div className="pb-4">
          <img
            className="h-[75vh] w-full"
            src={
              selectedProduct?.image ||
              selectedProduct?.image_1 ||
              "/image.png"
            }
            alt={selectedProduct?.name || "Product"}
          />
        </div>
        <div className="grid grid-cols-5 gap-4">
          {productImages.map((img, index) => (
            <div key={index} className="w-full h-28">
              <img
                className="object-cover w-full h-full"
                src={img || "/image.png"}
                alt={`Thumbnail ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-8 bg-background border-l relative">
        <PersonalizeForm />
      </div>
    </div>
  );
}
