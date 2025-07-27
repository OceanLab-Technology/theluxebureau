"use client";

import React from "react";
import { ProductCard } from "./ProductCard";

// Mock data for recommendations
const recommendedProducts = [
  {
    id: "3",
    name: "Krug Grande Cuvée",
    description: "A blend of 120 different wines from 10 or more different years, creating an exceptional champagne experience.",
    price: 189,
    image: "/product.jpg",
    category: "Champagne",
    availability: "in-stock" as const,
    tags: ["Blend", "Premium"]
  },
  {
    id: "4",
    name: "Macallan 25 Year Old",
    description: "Aged in sherry oak casks, this whisky offers rich dried fruits and spice with an incredibly smooth finish.",
    price: 2499,
    image: "/product.jpg",
    category: "Whisky",
    availability: "sold-out" as const,
    tags: ["Aged", "Rare", "Sherry Cask"]
  },
  {
    id: "5",
    name: "Crystal Whisky Glass Set",
    description: "Set of 4 premium crystal glasses designed specifically for whisky tasting and appreciation.",
    price: 159,
    originalPrice: 199,
    image: "/product.jpg",
    category: "Glassware",
    availability: "in-stock" as const,
    tags: ["Set", "Crystal", "Gift"]
  }
];

interface ProductRecommendationsProps {
  currentProductId: string;
}

export function ProductRecommendations({ currentProductId }: ProductRecommendationsProps) {
  // Filter out the current product from recommendations
  const filteredRecommendations = recommendedProducts.filter(
    product => product.id !== currentProductId
  );

  if (filteredRecommendations.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-['Century_Old_Style'] mb-4">
          You may also like
        </h2>
        <p className="text-muted-foreground">
          Discover more exceptional products from our curated collection
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecommendations.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
