"use client";

import React, { useEffect, useMemo } from "react";
import { useMainStore } from "@/store/mainStore";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { EmptyCart } from "./EmptyCart";
import { CartContainerSkeleton } from "./CartSkeleton";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface CartContainerProps {
  onClose?: () => void;
}

export function CartContainer({ onClose }: CartContainerProps) {
  const { cartItems, cartLoading, products, fetchProducts } = useMainStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  const enrichedCartItems = useMemo(() => {
    return cartItems
      .map((cartItem) => {
        let product = (cartItem as any).products;
        if (!product) {
          product = products.find((p) => p.id === cartItem.product_id);
        }

        return {
          ...cartItem,
          product,
        };
      })
      .filter((item) => item.product);
  }, [cartItems, products]);

  if (cartLoading && cartItems.length === 0) {
    return <CartContainerSkeleton />;
  }

  if (cartItems.length === 0) {
    return <EmptyCart onClose={onClose} />;
  }

  if (enrichedCartItems.length === 0 && products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-2rem)] md:pt-20 pt-15 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between md:mb-2">
          <h1 className="text-[1.5rem] font-century font-light ">
            Shopping Cart
          </h1>
          {onClose ? (
            <button
              onClick={onClose}
              className="small-text hover:text-stone-500 transition-colors uppercase tracking-wider"
            >
              <span className="md:hidden">Close</span>
              <span className="hidden md:block">CONTINUE SHOPPING</span>
            </button>
          ) : (
            <Link
              href="/products"
              className="md:block hidden small-text hover:text-stone-500 transition-colors uppercase tracking-wider"
            >
              CONTINUE SHOPPING
            </Link>
          )}
        </div>

        <div className="space-y-6 overflow-y-auto font-century h-[calc(100vh-22rem)] hide-scrollbar">
          {enrichedCartItems.map((item, index) => (
            <CartItem key={item.id} item={item} index={index} loading={cartLoading} lastIndex={cartItems.length - 1} />
          ))}
        </div>
      </div>

      <div className="font-century py-2">
        <CartSummary onClose={onClose} />
      </div>
    </div>
  );
}
