"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "./ProductGridSkeleton";
import { useMainStore } from "@/store/mainStore";
import { ChevronRight, Loader2 } from "lucide-react";

interface ProductGridProps {
  searchQuery?: string;
  selectedCategory?: string;
  priceRange?: [number, number];
  availability?: string;
  onCategoryChange?: (category: string) => void;
}

export function ProductGrid({
  searchQuery = "",
  selectedCategory = "",
  priceRange = [0, 5000],
  availability = "",
  onCategoryChange,
}: ProductGridProps) {
  const { products, loading, error, fetchProducts } = useMainStore();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const categories = ["Literature", "Drinks & Spirits", "Floral", "Home"];

  const pageVariants = {
    initial: {
      opacity: 0,
      filter: "blur(10px)",
    },
    in: {
      opacity: 1,
      filter: "blur(0px)",
    },
    out: {
      opacity: 0,
      filter: "blur(10px)",
    },
  };

  const pageTransition = {
    type: "tween" as const,
    ease: "easeInOut" as const,
    duration: 0.6,
  };

  const gridVariants = {
    hidden: {
      opacity: 0,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(8px)",
      transition: {
        duration: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      filter: "blur(5px)",
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
      },
    },
  };

  const getNextCategory = () => {
    if (!selectedCategory) return categories[0];
    const currentIndex = categories.indexOf(selectedCategory);
    return categories[(currentIndex + 1) % categories.length]; // Loop back to first if at end
  };

  const handleNextCategory = () => {
    if (onCategoryChange) {
      setIsTransitioning(true);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setTimeout(() => {
        const nextCategory = getNextCategory();
        onCategoryChange(nextCategory);
        setTimeout(() => setIsTransitioning(false), 600);
      }, 300);
    }
  };

  useEffect(() => {
    const params: any = {};

    if (selectedCategory) params.category = selectedCategory;
    if (searchQuery) params.name = searchQuery;

    fetchProducts(params);
  }, [selectedCategory, searchQuery, fetchProducts]);

  const filteredProducts = products.filter((product) => {
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const productAvailability = product.inventory > 0 ? "in-stock" : "sold-out";
    const matchesAvailability =
      !availability ||
      (availability === "in-stock" && productAvailability === "in-stock") ||
      (availability === "sold-out" && productAvailability === "sold-out");

    return matchesPrice && matchesAvailability;
  });

  if (loading && products.length === 0) {
    return <ProductGridSkeleton />;
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-[2rem] font-[400] mb-4">No products found</h3>
        <p className="text-muted">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedCategory}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="space-y-8 font-century"
      >
        <motion.div
          className="md:px-6 px-6 mb-15"
          initial={{ opacity: 0, filter: "blur(5px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.h2
            className="md:text-[1rem] text-[20px] font-[600] md:font-medium uppercase text-secondary-foreground"
            initial={{ opacity: 0, filter: "blur(3px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {selectedCategory === "" ? "Shop All" : selectedCategory}
          </motion.h2>
          <motion.p
            className="mt-2 md:text-[1.625rem] text-[1.1rem] md:w-[55.56rem] font-[100] md:leading-7"
            initial={{ opacity: 0, filter: "blur(3px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {selectedCategory === ""
              ? "Refined pieces that bring comfort, character, and an everyday reminder of your quiet generosity."
              : selectedCategory === "Literature"
              ? "The Luxe offers a curated selection of literature, from timeless classics to contemporary masterpieces, each chosen for its enduring impact and literary significance."
              : selectedCategory === "Drinks & Spirits"
              ? "Thoughtfully curated and artfully presented, our selection of wines and spirits transforms exceptional bottles into extraordinary gestures"
              : selectedCategory === "Floral"
              ? "Explore our exquisite floral arrangements, where each bloom is handpicked to create stunning displays that bring beauty and elegance to any occasion."
              : selectedCategory === "Home"
              ? "Discover our curated collection of home decor, where each piece is chosen for its unique design and ability to transform your living space into a haven of style and comfort."
              : ""}
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-products`}
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-2 gap-2 md:px-6 px-4 md:w-[90%]"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                custom={index}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="h-[15.75rem] px-10 bg-[rgba(80,70,45,0.19)] flex items-center md:justify-end justify-center"
          initial={{ opacity: 0, filter: "blur(5px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="text-foreground">
            <motion.h2
              className={`text-[1rem] font-medium uppercase text-secondary-foreground transition-opacity duration-200 ${
                isTransitioning ? "animate-pulse" : ""
              }`}
              animate={isTransitioning ? { opacity: [1, 0.5, 1] } : {}}
              transition={{
                duration: 0.3,
                repeat: isTransitioning ? Infinity : 0,
              }}
            >
              Next Section
            </motion.h2>
            <motion.div
              className={`flex items-center gap-2 text-[2rem] font-[100] cursor-pointer hover:text-[#FBD060] transition-all duration-200 transform hover:scale-105 ${
                isTransitioning ? "opacity-70" : "opacity-100"
              }`}
              onClick={handleNextCategory}
              whileHover={{ opacity: 0.8 }}
              whileTap={{ opacity: 0.6 }}
            >
              <motion.span
                className="transition-all duration-300"
                animate={isTransitioning ? { opacity: [1, 0.3, 1] } : {}}
                transition={{
                  duration: 0.5,
                  repeat: isTransitioning ? Infinity : 0,
                }}
              >
                {getNextCategory()}
              </motion.span>
              <motion.div
                animate={isTransitioning ? { rotate: 360 } : { rotate: 0 }}
                transition={{
                  duration: 0.5,
                  repeat: isTransitioning ? Infinity : 0,
                }}
              >
                <ChevronRight className="h-10 w-10" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {loading && products.length > 0 && (
          <motion.div
            className="grid grid-cols-2 md:gap-6 gap-3 md:px-10 px-4"
            initial={{ opacity: 0, filter: "blur(5px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(5px)" }}
          >
            {Array.from({ length: 2 }).map((_, index) => (
              <motion.div
                key={index}
                className="space-y-2 animate-pulse"
                initial={{ opacity: 0, filter: "blur(3px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="md:h-130 h-66 bg-muted/20 rounded"></div>
                <div className="h-4 bg-muted/20 rounded w-3/4"></div>
                <div className="h-4 bg-muted/20 rounded w-16"></div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
