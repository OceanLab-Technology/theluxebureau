"use client";

import dynamic from "next/dynamic";
import React from "react";

const ProductDetailsPage = dynamic(
  () => import("@/components/DashboardComponents/ProductDetailsPage"),
  { ssr: false }
);

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params); // Unwrap the params promise

  return <ProductDetailsPage productId={id} />;
}
