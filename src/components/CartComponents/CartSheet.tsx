"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartContainer } from "./CartContainer";
import { useMainStore } from "@/store/mainStore";

interface CartSheetProps {
  className?: string;
  children?: React.ReactNode;
  fill?: string;
}

export function CartSheet({ className, children, fill }: CartSheetProps) {
  const { 
    cartItemCount, 
    fetchCartItems, 
    checkAuthStatus, 
    isCartSheetOpen, 
    setCartSheetOpen 
  } = useMainStore();

  useEffect(() => {
    const initializeCart = async () => {
      await checkAuthStatus();
      await fetchCartItems();
    };

    initializeCart();
  }, [checkAuthStatus, fetchCartItems]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  const handleCartClick = () => {
    console.log('Cart clicked, current state:', isCartSheetOpen);
    setCartSheetOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    console.log('Sheet open change:', open);
    setCartSheetOpen(open);
  };

  return (
    <>
      <button 
        onClick={handleCartClick} 
        className="cursor-pointer bg-transparent border-none p-0 m-0 relative flex items-center justify-center"
      >
        <div className="hidden md:flex relative items-center justify-center">
          {cartItemCount > 0 ? (
            <img src="/cart_full.svg" alt="Cart Icon" className="h-6 w-6" />
          ) : (
            <img
              src="/cart_empty.svg"
              alt="Empty Cart Icon"
              className="h-6 w-6"
            />
          )}
        </div>
        
        <div className="md:hidden relative flex items-center justify-center">
          {cartItemCount > 0 ? (
            <img src="/cart_full.svg" alt="Cart Icon" className="h-5 w-5" />
          ) : (
            <img
              src="/cart_empty.svg"
              alt="Empty Cart Icon"
              className="h-5 w-5"
            />
          )}
        </div>
      </button>

      <Sheet open={isCartSheetOpen} onOpenChange={handleOpenChange}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className="md:px-6 px-4 py-8 border-l-0"
        >
          <CartContainer onClose={() => setCartSheetOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
