"use client";

import React, { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { useMainStore } from "@/store/mainStore";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader2 } from "lucide-react";

interface ProductGridProps {
  searchQuery?: string;
  selectedCategory?: string;
  priceRange?: [number, number];
  availability?: string;
}

export function ProductGrid({
  searchQuery = "",
  selectedCategory = "",
  priceRange = [0, 5000],
  availability = "",
}: ProductGridProps) {
  const { products, loading, error, pagination, fetchProducts } =
    useMainStore();

  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const params: any = {
      page: currentPage,
      limit: 4,
    };

    if (selectedCategory) params.category = selectedCategory;
    if (searchQuery) params.name = searchQuery;

    fetchProducts(params);
  }, [currentPage, selectedCategory, searchQuery, fetchProducts]);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRetry = () => {
    fetchProducts({
      page: currentPage,
      limit: 4,
      category: selectedCategory || undefined,
      name: searchQuery || undefined,
    });
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center min-h-screen fixed inset-0 items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2 text-red-600">
          Error loading products
        </h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={handleRetry} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-century">
      <div className="md:px-10 px-4">
        <h2 className="text-xs font-medium uppercase text-muted-foreground">
          {selectedCategory === "" ? "All Products" : selectedCategory}
        </h2>
        <p className="mt-2 text-[18px] md:w-170 font-[100] leading-5">
          {selectedCategory === ""
            ? "Explore our diverse range of products, each handpicked for its quality and uniqueness."
            : selectedCategory === "Literature"
            ? "The Luxe offers a curated selection of literature, from timeless classics to contemporary masterpieces, each chosen for its enduring impact and literary significance."
            : selectedCategory === "Drinks & Spirits"
            ? "Thoughtfully curated and artfully presented, our selection of wines and spirits transforms exceptional bottles into extraordinary gestures"
            : selectedCategory === "Floral"
            ? "Explore our exquisite floral arrangements, where each bloom is handpicked to create stunning displays that bring beauty and elegance to any occasion."
            : selectedCategory === "Home"
            ? "Discover our curated collection of home decor, where each piece is chosen for its unique design and ability to transform your living space into a haven of style and comfort."
            : ""}
        </p>
      </div>
      <div className="grid grid-cols-2 md:gap-6 gap-3 md:px-10 px-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {loading && products.length > 0 && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.page > 1) {
                      handlePageChange(pagination.page - 1);
                    }
                  }}
                  className={
                    pagination.page <= 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
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
                }
              )}

              {pagination.totalPages > 5 &&
                pagination.page < pagination.totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

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
        </div>
      )}

      {pagination && (
        <div className="text-center text-sm text-muted-foreground mb-4">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
          {pagination.total} products
        </div>
      )}
    </div>
  );
}
