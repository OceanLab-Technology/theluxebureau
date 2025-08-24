"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/app/api/types";
import { AddToCartButton } from "@/components/CartComponents/AddToCartButton";
import { Button } from "../ui/button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const availability = product.inventory > 0 ? "in-stock" : "sold-out";
  const fallbackImage = product.image_2 || product.image_1;

  return (
    <div className="transition-all font-[Century-Old-Style] duration-300 overflow-hidden text-secondary-foreground p-0 md:p-[6px] h-[22rem] md:h-[44rem] flex flex-col justify-between w-full bg-[#f8f6ea] rounded-none md:rounded">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden w-full h-[15rem] md:h-[36rem] flex items-center justify-center">
          <img
            src={product.image_1 || fallbackImage!}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="flex flex-col mt-4 uppercase font-schoolbook-cond text-[1rem] leading-[1.2rem] font-[400] px-2 md:px-0">
          <h2 className="">{product.name}</h2>
          <span className="">£{product.price}</span>
        </div>
      </Link>
    </div>
  );
}
