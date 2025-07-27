"use client";

import React, { useState } from "react";
import { ProductCard } from "./ProductCard";

// Mock data for demonstration
const mockProducts = [
  {
    id: "1",
    name: "Dom Pérignon Vintage 2013",
    description:
      "An exceptional vintage ",
    price: 299,
    originalPrice: 349,
    image: "/product.jpg",
    category: "Champagne",
    availability: "in-stock" as const,
    tags: ["Premium", "Vintage", "Gift Box"],
  },
  {
    id: "2",
    name: "Baccarat Crystal Decanter",
    description:
      "Handcrafted crystal ",
    price: 1899,
    image: "/product.jpg",
    category: "Accessories",
    availability: "limited-edition" as const,
    tags: ["Crystal", "Handmade", "Luxury"],
  },
  {
    id: "3",
    name: "Krug Grande Cuvée",
    description:
      "A blend of 120 ",
    price: 189,
    image: "/product.jpg",
    category: "Champagne",
    availability: "in-stock" as const,
    tags: ["Blend", "Premium"],
  },
  {
    id: "4",
    name: "Macallan 25 Year Old",
    description:
      "Aged in sherry oak",
    price: 2499,
    image: "/product.jpg",
    category: "Whisky",
    availability: "sold-out" as const,
    tags: ["Aged", "Rare", "Sherry Cask"],
  },
  {
    id: "5",
    name: "Crystal Whisky Glass Set",
    description:
      "Set of 4 premium ",
    price: 159,
    originalPrice: 199,
    image: "/product.jpg",
    category: "Glassware",
    availability: "in-stock" as const,
    tags: ["Set", "Crystal", "Gift"],
  },
  {
    id: "6",
    name: "Hennessy Paradis",
    description:
      "A rare cognac blending ",
    price: 599,
    image: "/product.jpg",
    category: "Cognac",
    availability: "limited-edition" as const,
    tags: ["Rare", "Aged", "Premium"],
  },
];

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
  const [products] = useState(mockProducts);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;

    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    const matchesAvailability =
      !availability || product.availability === availability;

    return (
      matchesSearch && matchesCategory && matchesPrice && matchesAvailability
    );
  });

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
    <div className="grid grid-cols-2 gap-6 px-10">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
