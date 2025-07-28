"use client";

import React, { useState } from "react";
import { ProductGrid } from "@/components/ProductComponents/ProductGrid";
import { ProductFilters } from "@/components/ProductComponents/ProductFilters";
import Header from "@/components/Header";

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Shop All");

  const handleFilterChange = (filters: { category?: string }) => {
    setSelectedCategory(filters.category || "Shop All");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-25">
        <ProductFilters 
          onFilterChange={handleFilterChange}
          activeCategory={selectedCategory}
        />
      </div>
      <div className="flex gap-8">
        <ProductGrid 
          selectedCategory={selectedCategory === "Shop All" ? "" : selectedCategory}
        />
      </div>
    </div>
  );
}
