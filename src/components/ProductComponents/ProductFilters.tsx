"use client";

import React from "react";
import { motion } from "motion/react";

interface ProductFiltersProps {
  onFilterChange?: (filters: { category?: string }) => void;
  activeCategory?: string;
}

export function ProductFilters({
  onFilterChange,
  activeCategory = "Shop All",
}: ProductFiltersProps) {
  console.log("ProductFilters activeCategory:", activeCategory);
  
  const categories = [
    "Shop All",
    "Literature",
    "Drinks & Spirits",
    "Floral",
    "Home",
  ];

  const handleCategoryClick = (category: string) => {
    const categoryFilter = category === "Shop All" ? undefined : category;
    console.log("Clicked category:", category, "Sending filter:", categoryFilter);
    onFilterChange?.({ category: categoryFilter });
  };

  return (
    <motion.div
      className="md:flex hidden font-century lg:flex lg:flex-row flex-col items-center justify-center lg:gap-20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, staggerChildren: 0.1 }}
    >
      {categories.map((category, index) => (
        <motion.div
          key={category}
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <motion.span
            className={`text-[2rem] font-[400] cursor-pointer hover:text-[#FBD060] transition-all duration-200 ${
              activeCategory === category
                ? "text-secondary-foreground"
                : "text-muted"
            }`}
            onClick={() => handleCategoryClick(category)}
            whileHover={{
              scale: 1.08,
              color: "#FBD060",
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
            animate={
              activeCategory === category
                ? {
                    scale: [1, 1.05, 1],
                    transition: { duration: 0.3 },
                  }
                : {}
            }
          >
            {category}
          </motion.span>
        </motion.div>
      ))}
    </motion.div>
  );
}
