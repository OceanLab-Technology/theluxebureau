"use client";

import { useEffect, useMemo } from "react";
import { useMainStore } from "@/store/mainStore";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { EmptyCart } from "./EmptyCart";
import { Loader2 } from "lucide-react";
import { Link } from 'next-view-transitions';

export function CartContainer() {
  const { cartItems, cartLoading, clearCart, products, fetchProducts } =
    useMainStore();

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
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
          <span className="text-stone-600">Loading cart...</span>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return <EmptyCart />;
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
    <div className="md:mx-12 md:my-14 py-10 px-6">
      <div className="flex items-center justify-between md:mb-8 pb-4">
        <h1 className="text-2xl font-light">Shopping Cart</h1>
        <Link
          href="/products"
          className="md:block hidden text-xs text-stone-600 hover:text-stone-800 uppercase tracking-wider"
        >
          CONTINUE SHOPPING
        </Link>
        
      </div>

      <div className="space-y-6 mb-12">
        {enrichedCartItems.map((item) => (
          <CartItem key={item.id} item={item} loading={cartLoading} />
        ))}
      </div>

      <div className="">
        <CartSummary />
      </div>
    </div>
  );
}
