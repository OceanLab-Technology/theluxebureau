"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePersonalizeStore } from "@/store/personalizeStore";
import { useMainStore } from "@/store/mainStore";
import PersonalizeForm from "@/components/PersonalizeComponents/PersonalizeForm";
import { motion, AnimatePresence } from "framer-motion";

export default function PersonalizeClient() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const { setSelectedProduct, selectedProduct } = usePersonalizeStore();
  const { fetchProductById, currentProduct } = useMainStore();

  useEffect(() => {
    if (productId && (!selectedProduct || selectedProduct.id !== productId)) {
      fetchProductById(productId);
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

  const productImages = [
    currentProduct?.image_1,
    currentProduct?.image_2,
    currentProduct?.image_3,
    currentProduct?.image_4,
    currentProduct?.image_5,
  ].filter(Boolean);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="personalize-panel"
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="grid md:grid-cols-2 grid-cols-1 min-h-screen font-century bg-background"
      >
        {/* LEFT IMAGE SECTION */}
        <motion.div
          key={selectedProduct?.id}
          initial={{ opacity: 0, scale: 0.975 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="h-[calc(100vh-4.1rem)] blur-xl overflow-hidden md:flex hidden flex-col"
        >
          <motion.div
            initial={{ opacity: 0, filter: "blur(16px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="pb-4"
          >
            <img
              className="h-[75vh] w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
              src={
                selectedProduct?.image ||
                selectedProduct?.image_1 ||
                "/image.png"
              }
              alt={selectedProduct?.name || "Product"}
            />
          </motion.div>

          <div className="grid grid-cols-5 gap-4 px-4">
            {productImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.35 + index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="w-full h-28 overflow-hidden rounded-xl"
              >
                <img
                  className="object-cover w-full h-full"
                  src={img || "/image.png"}
                  alt={`Thumbnail ${index + 1}`}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT FORM SECTION */}
        <motion.div
          initial={{ opacity: 0, x: 64 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 1.05,
            delay: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="px-6 py-8 bg-background border-l relative z-10"
        >
          <PersonalizeForm />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
