"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { useMainStore } from "@/store/mainStore";
import { CheckoutButton } from "../Tools/CheckoutButton";
import { usePathname } from "next/navigation";

interface ProductDetailViewProps {
  productId: string;
}

export function ProductDetailView({ productId }: ProductDetailViewProps) {
  const pathname = usePathname();
  const { fetchProductById, currentProduct } = useMainStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchProductById(productId);
  }, [productId, fetchProductById]);

  const productPage = pathname.includes("/products/");

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

  return (
    <div className="max-w-7xl mx-auto font-century">
      {productPage && (
        <Link href="/products" className="flex items-center gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
      )}

      <div className={`${productPage ? "grid grid-cols-1 lg:grid-cols-2" : "grid-cols-1"} gap-12`}>
        <div className="space-y-4">
          <div className="aspect-square bg-muted/20 overflow-hidden">
            <Image
              src={currentProduct.image_1!}
              alt={currentProduct.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`aspect-square bg-muted/20 overflow-hidden border-2 transition-all ${
                  selectedImageIndex === index
                    ? "border-primary"
                    : "border-transparent"
                }`}
              >
                <Image
                  src={`${
                    (currentProduct as any)[`image_${index + 1}`] ||
                    currentProduct.image_1
                  }`}
                  alt={`${currentProduct.name} ${index + 1}`}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-stone-600">
              <span>{currentProduct.category}</span>
            </div>

            <h1 className="text-3xl font-semibold mb-4">
              {currentProduct.name}
            </h1>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold">
              ${currentProduct.price.toLocaleString()}
            </span>
            {isOnSale && (
              <span className="text-xl text-muted-foreground line-through">
                ${currentProduct.originalPrice!.toLocaleString()}
              </span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {currentProduct.description}
          </p>

          <div className="flex gap-4">
            <CheckoutButton
              productId={currentProduct.id!}
              price={currentProduct.price.toString()}
              description={currentProduct.description!}
            />

            <Button variant="outline" size="lg">
              <Heart className={`h-4 w-4`} />
            </Button>

            <Button variant="outline" size="lg">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
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
      </div>
    </div>
  );
}
