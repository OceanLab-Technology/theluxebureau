"use client";

import React from "react";

interface ProductFiltersProps {
  onFilterChange?: (filters: { category?: string }) => void;
  activeCategory?: string;
}

export function ProductFilters({ onFilterChange, activeCategory = "Shop All" }: ProductFiltersProps) {
  const categories = [
    "Shop All",
    "Literature",
    "Drinks & Spirits",
    "Floral",
    "Home",
  ];

  const handleCategoryClick = (category: string) => {
    const categoryFilter = category === "Shop All" ? undefined : category;
    onFilterChange?.({ category: categoryFilter });
  };

  return (
    <div className="flex font-century md:flex-row flex-col md:items-center items-end justify-end md:gap-30">
      {categories.map((category) => (
        <div key={category} className="flex flex-col gap-2">
          <span
            className={`text-[22px] font-[400] cursor-pointer transition-colors duration-200 ${
              activeCategory === category ? "text-primary" : "text-stone-400"
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </span>
        </div>
      ))}
    </div>
  );
}