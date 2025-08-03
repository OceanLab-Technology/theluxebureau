"use client";

import React, { useEffect, useMemo } from "react";
import { CheckoutContainer } from "@/components/CheckoutComponents/CheckoutContainer";
import { CheckoutPageSkeleton } from "@/components/CheckoutComponents/CheckoutSkeleton";
import { CheckoutItem } from "@/components/CheckoutComponents/CheckoutItem";
import { useMainStore } from "@/store/mainStore";
import { Product } from "@/app/api/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Script from "next/script";

export default function CheckoutPage() {
  const { cartItems, products, fetchCartItems, fetchProducts, cartLoading } =
    useMainStore();

  useEffect(() => {
    fetchCartItems();
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchCartItems, fetchProducts, products.length]);

  const checkoutItems: Product[] = useMemo(() => {
    return cartItems
      .map((cartItem) => {
        const product = products.find((p) => p.id === cartItem.product_id);
        if (!product) return null;

        return {
          ...product,
          quantity: cartItem.quantity,
          cartItemId: cartItem.id,
          customData: cartItem.custom_data,
        };
      })
      .filter(Boolean) as Product[];
  }, [cartItems, products]);

  if (cartLoading) {
    return <CheckoutPageSkeleton />;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto p-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">
            Add some items to your cart before checking out.
          </p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src="https://js.stripe.com/v3/" />
      <div className="min-h-screen">
        <div className="max-w-[75rem] md:p-10 md:pb-10 md:px-20 lg:px-10 px-4 mx-auto">
          <div className="flex items-center justify-between py-10">
            <h2 className="text-[2rem] font-medium">Check-out</h2>
            <Button variant="link" asChild>
              <Link href="/cart">Back to Cart</Link>
            </Button>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 grid-cols-1">
            <div className="flex flex-col md:space-y-4 space-y-10">
              {checkoutItems.map((product, index) => (
                <CheckoutItem key={product.id} product={product} index={index} />
              ))}
            </div>

            <div className="sticky top-6 self-start">
              <h2 className="my-6 pb-2 border-b">Payment</h2>
              <div className="mb-6 p-4 bg-muted/20 rounded-lg">
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="flex items-center gap-1">
                        {item.name} × {(item as any).quantity}
                        {(item as any).customData &&
                          (item as any).customData.isPersonalized && (
                            <span
                              className="text-amber-600"
                              title="Personalized Item"
                            ></span>
                          )}
                      </span>
                      <span>
                        $
                        {(
                          item.price * ((item as any).quantity || 1)
                        ).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>
                        $
                        {checkoutItems
                          .reduce(
                            (sum, item) =>
                              sum + item.price * ((item as any).quantity || 1),
                            0
                          )
                          .toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                      <span>Total</span>
                      <span>
                        $
                        {checkoutItems
                          .reduce(
                            (sum, item) =>
                              sum + item.price * ((item as any).quantity || 1),
                            0
                          )
                          .toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <CheckoutContainer
                  items={checkoutItems}
                  useStripeElements={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
