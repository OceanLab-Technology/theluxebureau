"use client";

import { useMainStore } from "@/store/mainStore";
import React from "react";
import { ProductCard } from "./ProductCard";

interface ProductRecommendationsProps {
  currentProductId: string;
}

export function ProductRecommendations({
  currentProductId,
}: ProductRecommendationsProps) {
  const { products, fetchProducts } = useMainStore();
  React.useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, []);

  const filteredRecommendations = products
    .filter((product) => {
      return product.id !== currentProductId && product.inventory > 0;
    })
    .slice(0, 2); // Limit to 2 recommendations

  if (filteredRecommendations.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 p-10">
      <div className="mb-8">
        <h2 className="text-3xl font-[200] font-['Century_Old_Style'] mb-4">
          You may also like
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {filteredRecommendations.map((product) => (
          <ProductCard key={product.id} product={product}  />
        ))}
      </div>
    </section>
  );
}