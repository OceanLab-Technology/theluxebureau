"use client";
import dynamic from "next/dynamic";

const ProductDetailsPage = dynamic(() => import("@/components/DashboardComponents/ProductDetailsPage"), {
  ssr: false, // Disable server-side rendering for client-only component
});

export default function Page({ params }: { params: { id: string } }) {
  return <ProductDetailsPage productId={params.id} />;
}
