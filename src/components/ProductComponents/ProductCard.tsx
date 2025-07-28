"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/app/api/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const availability = product.inventory > 0 ? "in-stock" : "sold-out";
  const fallbackImage = product.image_2 || product.image_1;

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="transition-all font-century duration-300 overflow-hidden w-120 cursor-pointer">
        <div className="relative aspect-auto overflow-hidden h-130">
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

        <div className=" flex flex-col my-6">
          <h2 className="text-lg leading-tight">{product.name}</h2>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          <span className="text-lg font-semibold">
            ${product.price.toLocaleString()}
          </span>

          <div onClick={(e) => e.preventDefault()} className="">
            <Button
              size="sm"
              disabled={availability === "sold-out"}
              variant={"box_yellow"}
              className="px-20"
            >
              {availability === "sold-out" ? "Sold Out" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

