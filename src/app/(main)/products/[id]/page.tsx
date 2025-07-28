import React from "react";
import { ProductDetailView } from "@/components/ProductComponents/ProductDetailView";
import { ProductRecommendations } from "@/components/ProductComponents/ProductRecommendations";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ProductDetailView productId={id} />
        <ProductRecommendations currentProductId={id} />
      </div>
    </div>
  );
}
