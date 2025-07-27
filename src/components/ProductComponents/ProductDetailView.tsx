"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Share2, ShoppingCart, Star } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  availability: "in-stock" | "limited-edition" | "sold-out";
  tags?: string[];
  specifications?: Record<string, string>;
  rating?: number;
  reviewCount?: number;
}

// Mock data - in a real app, this would come from an API
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Dom Pérignon Vintage 2013",
    description: "An exceptional vintage with remarkable finesse and elegance.",
    fullDescription: "This extraordinary wine delivers serious Dom Pérignon's a signature trinity of power, pure finesse. Filled with a fresh energy and a fluid execution, this vintage shows pure muscle hiding beneath a seductive exuberance. Dom Pérignon Vintage 2013 is an ideal wine to mark the end of a great year or celebrate new chances and memories such as our impending festive A stellar vintage.",
    price: 299,
    originalPrice: 349,
    images: ["/product.jpg", "/product.jpg", "/product.jpg", "/product.jpg"],
    category: "Champagne",
    availability: "in-stock",
    tags: ["Premium", "Vintage", "Gift Box"],
    specifications: {
      "Vintage": "2013",
      "Region": "Champagne, France",
      "Alcohol": "12.5%",
      "Volume": "750ml",
      "Grape Variety": "Chardonnay, Pinot Noir"
    },
    rating: 4.8,
    reviewCount: 124
  },
  {
    id: "2",
    name: "Baccarat Crystal Decanter",
    description: "Handcrafted crystal decanter with intricate blue and white patterns.",
    fullDescription: "This stunning Baccarat crystal decanter represents the pinnacle of French crystal craftsmanship. Each piece is meticulously handcrafted by master artisans, featuring intricate blue and white patterns that catch and reflect light beautifully. Perfect for serving premium spirits or as a decorative centerpiece.",
    price: 1899,
    images: ["/product.jpg", "/product.jpg", "/product.jpg"],
    category: "Accessories",
    availability: "limited-edition",
    tags: ["Crystal", "Handmade", "Luxury"],
    specifications: {
      "Material": "Baccarat Crystal",
      "Height": "30cm",
      "Capacity": "750ml",
      "Origin": "France",
      "Care": "Hand wash only"
    },
    rating: 4.9,
    reviewCount: 87
  }
];

interface ProductDetailViewProps {
  productId: string;
}

export function ProductDetailView({ productId }: ProductDetailViewProps) {
  const product = mockProducts.find(p => p.id === productId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link href="/products">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const isOnSale = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link href="/products" className="text-muted-foreground hover:text-foreground flex items-center text-sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-muted/20 rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImageIndex]}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`aspect-square bg-muted/20 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImageIndex === index ? "border-primary" : "border-transparent"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{product.category}</Badge>
              {product.availability === "limited-edition" && (
                <Badge className="bg-yellow-500 text-white">Limited Edition</Badge>
              )}
              {isOnSale && <Badge variant="destructive">Sale</Badge>}
            </div>
            
            <h1 className="text-3xl font-bold font-['Century_Old_Style'] mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating!) 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold">
              ${product.price.toLocaleString()}
            </span>
            {isOnSale && (
              <span className="text-xl text-muted-foreground line-through">
                ${product.originalPrice!.toLocaleString()}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {product.fullDescription}
          </p>

          {/* Specifications */}
          {product.specifications && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Specifications</h3>
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="space-y-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Quantity:</label>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-muted transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-muted transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="flex-1 bg-yellow-500/70 hover:bg-yellow-500 text-stone-700"
                disabled={product.availability === "sold-out"}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.availability === "sold-out" ? "Sold Out" : "Add to Cart"}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={isWishlisted ? "border-red-500 text-red-500" : ""}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>
              
              <Button variant="outline" size="lg">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
