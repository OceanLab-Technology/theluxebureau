"use client";

import { useMainStore } from "@/store/mainStore";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { ProductCard } from "./ProductCard";

interface ProductRecommendationsProps {
  currentProductId: string;
}

export function ProductRecommendations({
  currentProductId,
}: ProductRecommendationsProps) {
  const { products, loading, fetchProducts } = useMainStore();
  React.useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, []);

  const filteredRecommendations = products
    .filter((product) => {
      if (product.id === currentProductId) return false;
      if (product.product_variants && product.product_variants.length > 0) {
        return product.product_variants.some(
          variant => variant.inventory > variant.qty_blocked
        );
      }
      return (product as any).inventory > 0;
    })
    .slice(0, 2);


  if (loading && products.length === 0) {
    return (
      <section className="py-10 px-4">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (filteredRecommendations.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 py-10 px-4">
      <div className="mb-8">
        <h2 className="text-[2rem] font-[200] font-['Century_Old_Style'] mb-4">
          You may also like
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2 md:w-[80%]">
        {filteredRecommendations.map((product) => (
          <ProductCard key={product.id} product={product}  />
        ))}
      </div>
    </section>
  );
}