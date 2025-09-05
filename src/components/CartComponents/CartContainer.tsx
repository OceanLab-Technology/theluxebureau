"use client";

import React, { useEffect, useMemo } from "react";

import { useProductStore } from "@/store/productStore";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { EmptyCart } from "./EmptyCart";
import { CartContainerSkeleton } from "./CartSkeleton";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useMainStore } from "@/store/mainStore";

interface CartContainerProps {
  onClose?: () => void;
}

export function CartContainer({ onClose }: CartContainerProps) {
  const { cartItems, cartLoading } = useMainStore();
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  useEffect(() => {
    if (products.length > 0 && cartItems.length > 0) {
      useMainStore.getState().calculateCartTotal();
    }
  }, [products, cartItems]);

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

  // Recalculate total once cart items are enriched with product data
  useEffect(() => {
     console.log(enrichedCartItems.length);
    if (enrichedCartItems.length > 0) {
      // use the store directly to avoid stale selector closures
      useMainStore.getState().calculateCartTotal();
    }
  }, [enrichedCartItems]);

    useEffect(() => {
    if (products.length > 0) {
      // copy loaded products into main store so calculateCartTotal() can find prices
      useMainStore.setState({ products });
      // trigger calc again just in case
      useMainStore.getState().calculateCartTotal();
    }
  }, [products]);


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
          <h1 className="text-[1.5rem] font-[Century-Old-Style] font-light ">
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

        <div className="space-y-6 overflow-y-auto font-[Century-Old-Style] h-[calc(100vh-22rem)] hide-scrollbar">
          {enrichedCartItems.map((item, index) => (
            <CartItem key={item.id} item={item} index={index} loading={cartLoading} lastIndex={cartItems.length - 1} />
          ))}
        </div>
      </div>

      <div className="font-[Century-Old-Style] py-2">
        <CartSummary onClose={onClose} />
      </div>
    </div>
  );
}
