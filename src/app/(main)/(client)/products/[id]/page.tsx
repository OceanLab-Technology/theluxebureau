import React from "react";
import { ProductDetailView } from "@/components/ProductComponents/ProductDetailView";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
  return (
    <div className="min-h-screen bg-background">
      <div className="md:mx-auto">
        <ProductDetailView productId={id} />
      </div>
    </div>
  );
}
