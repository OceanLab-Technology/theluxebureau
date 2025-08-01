"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useMainStore } from "@/store/mainStore";
import { usePersonalizeStore } from "@/store/personalizeStore";
import { AddToCartButton } from "@/components/CartComponents/AddToCartButton";
import { ProductDetailSkeleton } from "./ProductDetailSkeleton";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductRecommendations } from "./ProductRecommendations";

interface ProductDetailViewProps {
  productId: string;
}

export function ProductDetailView({ productId }: ProductDetailViewProps) {
  const { fetchProductById, currentProduct, detailedProductLoading } =
    useMainStore();
  const { setSelectedProduct, resetCheckout } = usePersonalizeStore();
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = [
    currentProduct?.image_1,
    currentProduct?.image_2,
    currentProduct?.image_3,
    currentProduct?.image_4,
  ];

  useEffect(() => {
    fetchProductById(productId);
  }, [productId, fetchProductById]);

  const handleImageChange = (index: number) => {
    if (index !== selectedImageIndex) {
      setTimeout(() => {
        setSelectedImageIndex(index);
      }, 150);
    }
  };

  const handlePersonalize = () => {
    if (currentProduct) {
      resetCheckout();
      setSelectedProduct(currentProduct);
      router.push(`/personalize?productId=${currentProduct.id}`);
    }
  };

  if (detailedProductLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!currentProduct) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link href="/products">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const availability = currentProduct.inventory > 0 ? "in-stock" : "sold-out";

  return (
    <>
      <div className="font-century">
        <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-6 overflow-hidden">
          <div className="space-y-4">
            <div className="lg:w-full lg:h-[60%] relative h-[30.5rem] bg-muted/20 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  src={
                    (currentProduct as any)[
                      `image_${selectedImageIndex + 1}`
                    ] || currentProduct.image_1!
                  }
                  alt={currentProduct.name}
                  className="h-full w-full object-cover"
                  initial={{
                    opacity: 0,
                    filter: "blur(10px)",
                  }}
                  animate={{
                    opacity: 1,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    filter: "blur(8px)",
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                />
              </AnimatePresence>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {Array.from({ length: images.length }).map((_, index) => (
                  <motion.span
                    key={index}
                    className={`h-2 w-2 rounded-full inline-block cursor-pointer ${
                      selectedImageIndex === index
                        ? "bg-[#FBD060]"
                        : "bg-background/50"
                    }`}
                    onClick={() => handleImageChange(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    animate={
                      selectedImageIndex === index ? { scale: [1, 1.2, 1] } : {}
                    }
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 px-4">
              {images.map((imageUrl, index) => {
                if (!imageUrl) return null;
                return (
                  <motion.button
                    key={index}
                    onClick={() => handleImageChange(index)}
                    className={`md:h-[10.375rem] md:w-[8.25rem] lg:w-full lg:h-[10%] bg-muted/20 overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-yellow-500"
                        : "border-transparent"
                    }`}
                    animate={
                      selectedImageIndex === index
                        ? {
                            borderColor: ["#eab308", "#fbbf24", "#eab308"],
                            transition: { duration: 0.5 },
                          }
                        : {}
                    }
                  >
                    <img
                      src={imageUrl}
                      alt={`${currentProduct.name} ${index + 1}`}
                      className="h-full w-full"
                    />
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="space-y-6 lg:py-20 py-8 lg:px-4 px-8">
            <div className="md:w-96">
              <div className="flex items-center gap-2 mb-2 text-stone-600">
                <span>{currentProduct.category}</span>
              </div>

              <h1 className="text-[2rem] leading-none text-secondary-foreground font-medium">{currentProduct.name}</h1>
              <span className="text-[2rem] font-medium">
                £{currentProduct.price}
              </span>
            </div>

            <p className="text-[1.3rem] leading-relaxed">
              {currentProduct.description}
            </p>

            <div className="inline-flex">
              <Button
                variant="box_yellow"
                size={"lg"}
                className="w-full px-20"
                onClick={handlePersonalize}
              >
                Personalize
              </Button>
            </div>

            {currentProduct.tags && currentProduct.tags.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {currentProduct.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {(currentProduct.why_we_chose_it ||
              currentProduct.about_the_maker ||
              currentProduct.particulars) && (
              <div className="mt-20">
                <Accordion type="single" collapsible className="">
                  {currentProduct.why_we_chose_it && (
                    <AccordionItem value="why-we-chose-it">
                      <AccordionTrigger className="text-left font-medium uppercase">
                        Why We Chose It
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {currentProduct.why_we_chose_it}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {currentProduct.about_the_maker && (
                    <AccordionItem value="about-the-maker">
                      <AccordionTrigger className="text-left font-medium uppercase">
                        About the Maker
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {currentProduct.about_the_maker}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {currentProduct.particulars && (
                    <AccordionItem value="particulars">
                      <AccordionTrigger className="text-left font-medium uppercase">
                        Particulars
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {currentProduct.particulars}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </div>
            )}
          </div>
        </div>
        <ProductRecommendations currentProductId={currentProduct.id!} />
      </div>
    </>
  );
}
