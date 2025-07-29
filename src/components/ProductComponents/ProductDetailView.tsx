"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useMainStore } from "@/store/mainStore";
import { AddToCartButton } from "@/components/CartComponents/AddToCartButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "../Header";

interface ProductDetailViewProps {
  productId: string;
}

export function ProductDetailView({ productId }: ProductDetailViewProps) {
  const { fetchProductById, currentProduct, detailedProductLoading } =
    useMainStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchProductById(productId);
  }, [productId, fetchProductById]);

  if (detailedProductLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-muted-foreground">
          <Loader2 className="animate-spin h-6 w-6 mr-2 inline-block" />
        </div>
      </div>
    );
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

  const isOnSale =
    currentProduct.originalPrice &&
    currentProduct.originalPrice > currentProduct.price;

  const availability = currentProduct.inventory > 0 ? "in-stock" : "sold-out";

  return (
    <>
      {/* <Header /> */}
      <div className="font-century">
        {/* <div className="mb-8">
          <Link
            href="/products"
            className="text-muted-foreground hover:text-foreground flex items-center text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-muted/20 overflow-hidden">
              <Image
                src={
                  (currentProduct as any)[`image_${selectedImageIndex + 1}`] ||
                  currentProduct.image_1!
                }
                alt={currentProduct.name}
                width={400}
                height={400}
                className="w-[950px] h-[1080px] object-cover"
              />
            </div>

            <div className="grid grid-cols-4 gap-4 py-2 px-8">
              {Array.from({ length: 4 }, (_, index) => {
                const imageUrl = (currentProduct as any)[`image_${index + 1}`];
                if (!imageUrl) return null;

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-muted/20 overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-yellow-500"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={imageUrl}
                      alt={`${currentProduct.name} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-[212px] h-[262px] object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-6 p-25">
            <div className="w-66">
              <div className="flex items-center gap-2 mb-2 text-stone-600">
                <span>{currentProduct.category}</span>
              </div>

              <h1 className="text-3xl font-medium">{currentProduct.name}</h1>
              <span className="text-3xl font-medium">
                ${currentProduct.price}
              </span>
            </div>

            <p className="text-muted-foreground text-base leading-relaxed">
              {currentProduct.description}
            </p>

            <div className="space-y-4">
              {availability === "in-stock" ? (
                <AddToCartButton
                  productId={currentProduct.id!}
                  productName={currentProduct.name}
                  size="lg"
                  variant="box_yellow"
                  className="w-full"
                />
              ) : (
                <Button size="lg" disabled className="w-full">
                  Sold Out
                </Button>
              )}
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
              <div className="mt-25">
                <Accordion type="single" collapsible className="w-full">
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
      </div>
    </>
  );
}
