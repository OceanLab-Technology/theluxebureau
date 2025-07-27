import React from "react";
import { ProductGrid } from "@/components/ProductComponents/ProductGrid";
import { ProductFilters } from "@/components/ProductComponents/ProductFilters";
import Header from "@/components/Header";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-25">
        <ProductFilters />
      </div>
      <div className="flex gap-8">
        <ProductGrid />
      </div>
    </div>
  );
}
