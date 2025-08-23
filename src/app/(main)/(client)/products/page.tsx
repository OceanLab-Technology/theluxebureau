"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/ProductComponents/ProductGrid";
import { ProductFilters } from "@/components/ProductComponents/ProductFilters";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("Shop All");

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory("Shop All");
    }
  }, [searchParams]);

  const handleFilterChange = (filters: { category?: string }) => {
    const newCategory = filters.category || "Shop All";
    setSelectedCategory(newCategory);
    const params = new URLSearchParams(searchParams.toString());
    if (filters.category && filters.category !== "Shop All") {
      params.set("category", filters.category);
    } else {
      params.delete("category");
    }
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category && category !== "") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-background">
      <div className="mx-auto px-4 md:py-40 py-8">
        <ProductFilters
          onFilterChange={handleFilterChange}
          activeCategory={selectedCategory}
        />
      </div>
      <div className="flex gap-8">
        <ProductGrid
          selectedCategory={
            selectedCategory === "Shop All" ? "" : selectedCategory
          }
          onCategoryChange={handleCategoryChange}
        />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
