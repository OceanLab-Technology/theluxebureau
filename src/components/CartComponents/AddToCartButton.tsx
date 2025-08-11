"use client";

import { useState, useEffect } from "react";
import { useMainStore } from "@/store/mainStore";
import { Button } from "@/components/ui/button";
import { CartToast } from "@/components/ui/cart-toast";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthenticatedNavigation } from "@/hooks/use-authenticated-navigation";
import { LoginRequiredModal } from "@/components/ui/login-required-modal";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  productImage?: string;
  productPrice?: number;
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
  productImage,
  productPrice,
  className,
  variant = "default",
  size = "default",
}: AddToCartButtonProps) {
  const { addToCart, checkAuthStatus } = useMainStore();
  const router = useRouter();
  const { navigateWithAuth, showLoginModal, handleCloseModal, featureName } = useAuthenticatedNavigation();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      // addToCart now handles both authenticated and guest users
      await addToCart(productId, 1);
      setIsAdded(true);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
      
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCart = () => {
    setShowToast(false);
    router.push("/cart");
  };

  const handleCheckout = () => {
    setShowToast(false);
    navigateWithAuth("/checkout", "proceed to checkout");
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <>
      <div className="space-y-4">
        <Button
          onClick={handleAddToCart}
          disabled={isLoading}
          variant={variant}
          size={size}
          className={`${className} flex items-center justify-center gap-2`}
        >
          {isLoading ? "Adding..." : isAdded ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Added to Cart
            </>
          ) : "Add to Cart"}
        </Button>
      </div>

      <CartToast
        isVisible={showToast}
        onClose={handleCloseToast}
        productName={productName}
        productImage={productImage}
        productPrice={productPrice}
        onViewCart={handleViewCart}
        onCheckout={handleCheckout}
      />
      
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={handleCloseModal}
        feature={featureName}
      />
    </>
  );
}