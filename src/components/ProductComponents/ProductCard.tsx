"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from 'next-view-transitions';
import { Product } from "@/app/api/types";
import { AddToCartButton } from "@/components/CartComponents/AddToCartButton";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const availability = product.inventory > 0 ? "in-stock" : "sold-out";
  const fallbackImage = product.image_2 || product.image_1;

  return (
    <div className="transition-all font-century duration-300 overflow-hidden md:w-120">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-auto overflow-hidden md:h-130 h-66 cursor-pointer">
          <Image
            src={product.image_1 || fallbackImage!}
            alt={product.name}
            fill
            className="object-cover h-96 transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              if (fallbackImage && e.currentTarget.src !== fallbackImage) {
                e.currentTarget.src = fallbackImage;
              }
            }}
          />
        </div>

        <div className="flex flex-col md:my-3 my-2">
          <h2 className="md:text-[16px]">{product.name}</h2>
          <span className="md:text-[16px] font-medium">
            ${product.price}
          </span>
        </div>
      </Link>

      <div className="md:mt-4">
        {availability === "sold-out" ? (
          <Button
            size="sm"
            disabled
            variant="outline"
            className="md:px-20"
          >
            Sold Out
          </Button>
        ) : (
          <AddToCartButton
            productId={product.id!}
            productName={product.name}
            productImage={product.image_1}
            productPrice={product.price}
            size="sm"
            variant="box_yellow"
            className="md:px-20"
          />
        )}
      </div>
    </div>
  );
}

