"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/app/api/types";
import { AddToCartButton } from "@/components/CartComponents/AddToCartButton";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const availability = product.inventory > 0 ? "in-stock" : "sold-out";
  const fallbackImage = product.image_2 || product.image_1;

  return (
    <div className="transition-all font-century duration-300 overflow-hidden text-secondary-foreground">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-auto overflow-hidden w-[10.8125rem] h-[15.875rem] md:w-[100%] md:h-[59.1875rem] cursor-pointer">
          <img
            src={product.image_1 || fallbackImage!}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="flex flex-col my-6 uppercase font-schoolbook-cond text-[20px] leading-[24px] font-[400]">
          <h2 className="">{product.name}</h2>
          <span className="">£{product.price}</span>
        </div>
      </Link>

      {/* <div className="md:mt-4">
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
      </div> */}
    </div>
  );
}
