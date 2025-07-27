"use client";

import React from "react";

interface ProductFiltersProps {
  onFilterChange?: (filters: any) => void;
}

export function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const categories = [
    "Shop All",
    "Literature",
    "Drinks & Spirits",
    "Floral",
    "Home",
  ];

  const [activeCategory, setActiveCategory] =
    React.useState("Drinks & Spirits");

  return (
    <div className="flex font-century items-center justify-end gap-30">
      {categories.map((category) => (
        <div key={category} className="flex flex-col gap-2">
          <span
            className={`text-xl font-semibold cursor-pointer transition-colors duration-200 ${
              activeCategory === category ? "text-primary" : "text-stone-400"
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </span>
        </div>
      ))}
    </div>
  );
}
