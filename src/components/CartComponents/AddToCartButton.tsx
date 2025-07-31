"use client";

import { useState } from "react";
import { useMainStore } from "@/store/mainStore";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "destructive"
    | "ghost"
    | "link"
    | "box_yellow";
  size?: "sm" | "default" | "lg";
}

export function AddToCartButton({
  productId,
  productName,
  className,
  variant = "default",
  size = "default",
}: AddToCartButtonProps) {
  const { addToCart, cartLoading } = useMainStore();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    try {
      await addToCart(productId, 1);
      setIsAdded(true);
      toast.success(`${productName} added to cart!`);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      toast.error("Failed to add item to cart");
    }
  };

  if (isAdded) {
    return (
      <Button
        variant="outline"
        size={size}
        className={`${className} border-green-600 text-green-700 w-full`}
        disabled
      >
        <Check className="mr-2 h-4 w-4" />
        Added to Cart
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleAddToCart}
        disabled={cartLoading}
        variant={variant}
        size={size}
        className={className}
      >
        {cartLoading ? "Adding..." : "Add to Cart"}
      </Button>
    </div>
  );
}
