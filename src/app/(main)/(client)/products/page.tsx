"use client";

import React, { useState } from "react";
import { ProductGrid } from "@/components/ProductComponents/ProductGrid";
import { ProductFilters } from "@/components/ProductComponents/ProductFilters";

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Shop All");

  const handleFilterChange = (filters: { category?: string }) => {
    setSelectedCategory(filters.category || "Shop All");
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-background">
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
