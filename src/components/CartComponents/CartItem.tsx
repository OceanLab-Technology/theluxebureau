"use client";

import { useState } from "react";
import { useMainStore } from "@/store/mainStore";
import { CartItem as CartItemType } from "@/app/api/types";
import { Product } from "@/app/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CartItemProps {
  item: CartItemType & { product?: Product };
  loading?: boolean;
}

export function CartItem({ item, loading }: CartItemProps) {
  const { updateCartItem, removeFromCart } = useMainStore();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const { product } = item;

  if (!product) {
    return null;
  }

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;

    setQuantity(newQuantity);
    setIsUpdating(true);

    try {
      await updateCartItem(item.id!, newQuantity, item.custom_data);
    } catch (error) {
      setQuantity(item.quantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async () => {
    await removeFromCart(item.id!);
  };

  const incrementQuantity = () => {
    handleQuantityChange(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      handleQuantityChange(newQuantity);
    }
  };

  return (
    <div className="flex items-start space-x-6 md:py-6 py-4 border-y border-secondary-foreground">
      <div className="flex-shrink-0">
        <div className="w-32 h-32 relative overflow-hidden bg-stone-100">
          {product.image_1 || product.image ? (
            <Image
              src={product.image_1 || product.image || ""}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-stone-400 text-xs">No Image</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-between flex-grow h-full">
        <div className="h-full">
          <h3 className="font-medium text-lg text-stone-800 mb-2">
            {product.name}
          </h3>

          {item.custom_data && Object.keys(item.custom_data).length > 0 && (
            <div className="text-xs text-stone-500 mb-3 space-y-1">
              {item.custom_data.isPersonalized ? (
                <div className="space-y-1">
                  <div className="font-medium text-stone-600">
                    for {item.custom_data.recipientName || "recipient"}
                  </div>
                  {item.custom_data.deliveryDate && (
                    <div>
                      <span className="font-medium">Delivery:</span>{" "}
                      {new Date(
                        item.custom_data.deliveryDate
                      ).toLocaleDateString()}
                    </div>
                  )}
                  {item.custom_data.customMessage && (
                    <div>
                      <span className="font-medium">Message:</span> "
                      {item.custom_data.customMessage}"
                    </div>
                  )}
                  {item.custom_data.selectedQuote && (
                    <div>
                      <span className="font-medium">Quote:</span>{" "}
                      {item.custom_data.selectedQuote}
                    </div>
                  )}
                  {item.custom_data.yourName && (
                    <div>
                      <span className="font-medium">From:</span>{" "}
                      {item.custom_data.yourName}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <span className="font-medium">
                    Custom details:{" "}
                    {Object.entries(item.custom_data)
                      .map(([key, value]) => String(value))
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="text-lg font-medium text-stone-800">
            £{product.price ? product.price.toLocaleString() : "0"}.00
          </div>
        </div>

        <div className="flex md:items-center md:flex-row flex-col md:space-x-3">
          <div className="flex items-center justify-between">
            <span className="md:text-sm text-xs text-stone-600 uppercase tracking-wider">
              QUANTITY
            </span>
            {/* Mobile actions */}
            <div className="flex-col flex md:hidden  justify-start items-end text-sm">
              <button className="text-stone-600 md:block hidden cursor-pointer hover:text-stone-800 uppercase tracking-wider">
                EDIT
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="text-stone-600 md:text-base text-sm cursor-pointer hover:text-stone-800 uppercase tracking-wider"
                    disabled={loading}
                  >
                    REMOVE
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl">
                      Remove Item
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-lg leading-6">
                      Are you sure you want to remove "{product.name}" from your
                      cart?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRemoveItem}>
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={decrementQuantity}
              disabled={quantity <= 1 || isUpdating || loading}
              className="md:h-8 h-6 w-6 md:w-8 p-0 rounded-none"
            >
              <Minus className="h-3 w-3" />
            </Button>

            <Input
              type="number"
              value={quantity}
              onChange={handleInputChange}
              disabled={isUpdating || loading}
              className="md:w-12 w-6 h-8 text-center border-0 focus:ring-0 rounded-none shadow-none"
              min="1"
            />

            <Button
              variant="ghost"
              size="sm"
              onClick={incrementQuantity}
              disabled={isUpdating || loading}
              className="md:h-8 h-6 w-6 md:w-8 p-0 rounded-none"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden flex-col md:flex  justify-start items-end text-sm">
        <button className="text-stone-600 md:block hidden cursor-pointer hover:text-stone-800 uppercase tracking-wider">
          EDIT
        </button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="text-stone-600 cursor-pointer hover:text-stone-800 uppercase tracking-wider"
              disabled={loading}
            >
              REMOVE
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl">
                Remove Item
              </AlertDialogTitle>
              <AlertDialogDescription className="text-lg leading-6">
                Are you sure you want to remove "{product.name}" from your cart?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRemoveItem}>
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {isUpdating && (
        <Loader2 className="h-4 w-4 animate-spin text-stone-400" />
      )}
    </div>
  );
}
