"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  availability: "in-stock" | "limited-edition" | "sold-out";
  tags?: string[];
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="transition-all font-century duration-300 overflow-hidden w-120 hover:shadow-lg cursor-pointer">
        <div className="relative aspect-auto overflow-hidden h-130">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover h-96 transition-transform duration-300 hover:scale-105"
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

          <div onClick={(e) => e.preventDefault()}>
            <Button
              size="sm"
              disabled={product.availability === "sold-out"}
              className="bg-yellow-500/70 uppercase text-xs hover:bg-yellow-500 text-stone-700 px-10 inline-block rounded-sm py-2"
            >
              {product.availability === "sold-out" ? "Sold Out" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
