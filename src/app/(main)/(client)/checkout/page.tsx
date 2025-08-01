"use client";

import React, { useEffect, useMemo } from "react";
import { CheckoutContainer } from "@/components/CheckoutComponents/CheckoutContainer";
import { CheckoutPageSkeleton } from "@/components/CheckoutComponents/CheckoutSkeleton";
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
        <div className="max-w-6xl md:p-10 md:pb-10 md:px-0 px-4 mx-auto">
          <div className="flex items-center justify-between py-10">
            <h2 className="text-3xl font-medium">Check-out</h2>
            <Button variant="link" asChild>
              <Link href="/cart">Back to Cart</Link>
            </Button>
          </div>
          <div className="grid lg:grid-cols-2 md:gap-12 gap-4">
            <div className="flex flex-col md:space-y-4">
              {checkoutItems.map((product, index) => (
                <div key={product.id}>
                  <h2 className="my-4 pb-2 border-b">
                    Item {String(index + 1).padStart(2, "0")}
                  </h2>
                  <div className="flex gap-6">
                    <div className="bg-muted/20 w-30 h-40 overflow-hidden">
                      <img
                        src={product.image_1 || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col w-full justify-center space-y-1">
                      <h1 className="font-medium">{product.name}</h1>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">
                          ${product.price.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground text-xs ">
                          Qty: {(product as any).quantity}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-xs line-clamp-1">
                        {product.description}
                      </p>

                      {product.customData &&
                        Object.keys(product.customData).length > 0 && (
                          <div className="text-xs text-stone-500 mb-3 space-y-1">
                            {product.customData.isPersonalized ? (
                              <div className="space-y-1">
                                <div className="font-medium text-stone-600">
                                  for{" "}
                                  {product.customData.recipientName ||
                                    "recipient"}
                                </div>
                                {product.customData.deliveryDate && (
                                  <div>
                                    <span className="font-medium">
                                      Delivery:
                                    </span>{" "}
                                    {new Date(
                                      product.customData.deliveryDate
                                    ).toLocaleDateString()}
                                  </div>
                                )}
                                {product.customData.customMessage && (
                                  <div>
                                    <span className="font-medium">
                                      Message:
                                    </span>{" "}
                                    "{product.customData.customMessage}"
                                  </div>
                                )}
                                {product.customData.selectedQuote && (
                                  <div>
                                    <span className="font-medium">Quote:</span>{" "}
                                    {product.customData.selectedQuote}
                                  </div>
                                )}
                                {product.customData.yourName && (
                                  <div>
                                    <span className="font-medium">From:</span>{" "}
                                    {product.customData.yourName}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div>
                                <span className="font-medium">
                                  Custom details:{" "}
                                  {Object.entries(product.customData)
                                    .map(([key, value]) => String(value))
                                    .join(", ")}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="">
              <h2 className="my-4 pb-2 border-b">Payment</h2>
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
                            >
                              🎁
                            </span>
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
