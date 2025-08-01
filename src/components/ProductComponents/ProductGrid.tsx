"use client";

import React, { useState, useEffect, useRef } from "react";
import { ProductCard } from "./ProductCard";
import { useMainStore } from "@/store/mainStore";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { motion, AnimatePresence } from "framer-motion";

export function ProductGrid({ searchQuery = "", selectedCategory = "", priceRange = [0, 5000], availability = "" }: ProductGridProps) {
  const { products, loading, error, pagination, fetchProducts } = useMainStore();
  const [currentPage, setCurrentPage] = useState(1);

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params: any = {
      page: currentPage,
      limit: 4,
    };

    if (selectedCategory) params.category = selectedCategory;
    if (searchQuery) params.name = searchQuery;

    fetchProducts(params);

    // Scroll to product grid on page change
    // if (gridRef.current) {
    //   gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    // }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, selectedCategory, searchQuery, fetchProducts]);

  const filteredProducts = products.filter((product) => {
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const productAvailability = product.inventory > 0 ? "in-stock" : "sold-out";
    const matchesAvailability =
      !availability ||
      (availability === "in-stock" && productAvailability === "in-stock") ||
      (availability === "sold-out" && productAvailability === "sold-out");

    return matchesPrice && matchesAvailability;
  });

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-8 font-century mb-10" ref={gridRef}>
      {/* Header and Description */}
      <div className="md:px-10 px-4">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {selectedCategory === "" ? "All Products" : selectedCategory}
        </h2>
        <p className="mt-2 text-[26px] md:w-180 font-[100] leading-7">
          {selectedCategory === ""
            ? "Explore our diverse range of products, each handpicked for its quality and uniqueness."
            : selectedCategory === "Literature"
            ? "The Luxe offers a curated selection of literature, from timeless classics to contemporary masterpieces..."
            : selectedCategory === "Drinks & Spirits"
            ? "Thoughtfully curated and artfully presented..."
            : selectedCategory === "Floral"
            ? "Explore our exquisite floral arrangements..."
            : selectedCategory === "Home"
            ? "Discover our curated collection of home decor..."
            : ""}
        </p>
      </div>

      {/* Product Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage + (loading ? "-loading" : "")}
          className="grid grid-cols-2 md:gap-6 gap-3 md:px-10 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2 animate-pulse">
                <div className="md:h-130 h-66 bg-muted/20 rounded" />
                <div className="h-4 bg-muted/20 rounded w-3/4" />
                <div className="h-4 bg-muted/20 rounded w-16" />
              </div>
            ))
          ) : (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.page > 1) {
                      handlePageChange(pagination.page - 1);
                    }
                  }}
                  className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNum);
                      }}
                      isActive={pageNum === pagination.page}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {/* Ellipsis */}
              {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.page < pagination.totalPages) {
                      handlePageChange(pagination.page + 1);
                    }
                  }}
                  className={
                    pagination.page >= pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.div>
      )}
    </div>
  );
}
