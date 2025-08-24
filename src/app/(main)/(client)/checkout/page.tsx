"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CheckoutContainer } from "@/components/CheckoutComponents/CheckoutContainer";
import { CheckoutPageSkeleton } from "@/components/CheckoutComponents/CheckoutSkeleton";
import { DetailProductCard } from "@/components/CheckoutComponents/DetailProductCard";
import { useMainStore } from "@/store/mainStore";
import { useGuestCartStore } from "@/store/guestCartStore";
import { Product } from "@/app/api/types";
import { Button } from "@/components/ui/button";
import { LoginRequiredModal } from "@/components/ui/login-required-modal";
import Script from "next/script";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const {
    cartItems,
    products,
    fetchCartItems,
    fetchProducts,
    cartLoading,
    isAuthenticated,
    checkAuthStatus
  } = useMainStore();
  const { items: guestItems } = useGuestCartStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized) return;

    const initCheckout = async () => {
      try {
        await checkAuthStatus();
        await fetchCartItems();

        if (products.length === 0) {
          await fetchProducts();
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize checkout:', error);
        setIsInitialized(true); // Still set to true to prevent infinite loading
      }
    };

    initCheckout();
  }, []); //only run once on mount

  useEffect(() => {

    if (isInitialized && isAuthenticated === false) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated, isInitialized]);


  useEffect(() => {
    if (isInitialized && products.length === 0) {
      fetchProducts();
    }
  }, [isInitialized, products.length, fetchProducts]);

  const checkoutItems: Product[] = useMemo(() => {
    if (!isInitialized) return [];

    if (isAuthenticated) {

      return cartItems
        .map((cartItem) => {
          const product = products.find((p) => p.id === cartItem.product_id);
          if (!product) return null;

          return {
            product_id: product.id,
            ...product,
            quantity: cartItem.quantity,
            cartItemId: cartItem.id,
            customData: cartItem.custom_data,
          };
        })
        .filter(Boolean) as Product[];
    } else {

      return guestItems
        .map((guestItem) => {
          const product = products.find((p) => p.id === guestItem.product_id);
          if (!product) return null;

          return {
            product_id: product.id,
            ...product,
            quantity: guestItem.quantity,
            cartItemId: guestItem.id,
            customData: guestItem.custom_data,
          };
        })
        .filter(Boolean) as Product[];
    }
  }, [cartItems, guestItems, products, isAuthenticated, isInitialized]);


  if (cartLoading || !isInitialized) {
    return <CheckoutPageSkeleton />;
  }

  const totalItems = isAuthenticated ? cartItems.length : guestItems.length;

  if (totalItems === 0) {
    return (
      <div className="w-full flex items-center justify-center min-h-[70vh] py-20">
        <div className="space-y-6 text-left">
          <h2 className="text-[#50462D] text-[30px] leading-[40px] lg:text-[36px] lg:leading-[48px] font-[400] font-[Century-Old-Style]">
            Your cart is empty
          </h2>
          <p className="text-[#50462D] text-[14px] leading-[26px] lg:text-[18px] lg:leading-[28px] font-[Century-Old-Style]">
            Looks like you haven&apos;t added any items to your cart yet.
            <br />
            Start exploring our products and add something you love.
          </p>

          <button
            onClick={() => router.push("/products")}
            className="bg-[#FBD060] text-[#1E1204] font-schoolbook-cond font-[400] text-[0.70rem] leading-[119.58%] w-[18.812rem] h-[2.25rem] uppercase rounded-[0.25rem] hover:opacity-90 transition-opacity lg:text-[0.75rem] lg:w-[20.812rem] lg:h-[2.5rem]"
          >
            CONTINUE SHOPPING &gt;
          </button>
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
            <h2 className="text-[2rem] font-medium font-[Century-Old-Style]">CHECK OUT</h2>
            {/* <Button variant="link" asChild className="small-text">
              <Link href="/cart">Back to Cart</Link>
            </Button> */}
          </div>
          <div className="grid lg:grid-cols-2 gap-12 grid-cols-1">
            <div className="flex flex-col md:space-y-4 space-y-10">
              {checkoutItems.map((product, index) => (
                <DetailProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            <div className="sticky top-6 self-start">
              <h2 className="my-6 pb-2 border-b small-text">Payment</h2>
              <div className="mb-6 p-4 bg-muted/20 rounded-[5px] font-[Century-Old-Style]">
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="flex items-center gap-1">
                        {item.name} ({(item as any).quantity})
                        {(item as any).customData &&
                          (item as any).customData.isPersonalized && (
                            <span
                              className="text-amber-600"
                              title="Personalized Item"
                            ></span>
                          )}
                      </span>
                      <span>
                        £
                        {(
                          item.price * ((item as any).quantity || 1)
                        ).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex mb-1 justify-between">
                      <span>Subtotal</span>
                      <span>
                        £
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
                      <span> DELIVERY </span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                      <span>Total</span>
                      <span>
                        £
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
                {isAuthenticated ? (
                  <CheckoutContainer items={checkoutItems} />
                ) : (
                  <div className="p-6 bg-muted/20 rounded-[5px] text-center">
                    <h3 className="text-lg font-semibold mb-2">Login Required</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Please login to continue with your purchase. Your cart items will be saved.
                    </p>
                    <Button
                      onClick={() => setShowLoginModal(true)}
                      className="w-full"
                      variant="box_yellow"
                    >
                      Login to Checkout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        feature="complete your purchase"
      />
    </>
  );
}