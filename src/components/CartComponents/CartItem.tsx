"use client";

import { useEffect, useState } from "react";
import { useMainStore } from "@/store/mainStore";
import { CartItem as CartItemType } from "@/app/api/types";
import { Product } from "@/app/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Loader2 } from "lucide-react";
import Image from "next/image";
import { EditPersonaliseSheet } from "@/components/PersonaliseComponents/EditPersonaliseSheet";
import { personaliseFormData } from "@/store/personaliseStore";
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
  index: number;
  lastIndex: number;
}

export function CartItem({ item, loading, index, lastIndex }: CartItemProps) {
  const { updateCartItem, removeFromCart } = useMainStore();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const borderClass =
    index === 0
      ? "border-t border-b" // first item: top + bottom
      : index === lastIndex
      ? "border-b" // last item: bottom only
      : "border-b"; // middle: bottom only

  const { product } = item;

  if (!product) {
    return null;
  }

  const convertToPersonaliseData = (customData: any): personaliseFormData => {
    return {
      yourName: customData?.yourName || "",
      recipientName: customData?.recipientName || "",
      recipientAddress: customData?.recipientAddress || "",
      recipientCity: customData?.recipientCity || "",
      recipientEmail: customData?.recipientEmail || "",
      deliveryDate: customData?.deliveryDate || "",
      preferredDeliveryTime: customData?.preferredDeliveryTime || "",
      selectedFont: customData?.selectedFont || "default",
      headerText: customData?.headerText || "Header",
      selectedQuote: customData?.selectedQuote || "",
      customMessage: customData?.customMessage || "",
      smsUpdates: customData?.smsUpdates || "none",
    };
  };

  const handleSaveEdit = async (newData: personaliseFormData) => {
    setIsUpdating(true);
    try {
      const updatedCustomData = {
        ...newData,
        isPersonalized: true,
      };
      await updateCartItem(item.id!, item.quantity, updatedCustomData);
    } catch (error) {
      console.error("Failed to update cart item:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const isPersonalized = item.custom_data?.isPersonalized || item.custom_data?.isPersonalised;

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

  const isDesktop = useIsDesktop();

  return (
    <div className={`flex items-start space-x-6 md:py-6 py-4 border-secondary-foreground/50 ${borderClass}`}>
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
            <div className="flex-col flex md:hidden  justify-start items-end text-sm">
              {isPersonalized ? (
                <EditPersonaliseSheet
                  product={product}
                  existingData={convertToPersonaliseData(item.custom_data)}
                  onSave={handleSaveEdit}
                >
                  <button className="text-stone-600 md:block hidden cursor-pointer hover:text-stone-800 uppercase tracking-wider">
                    EDIT
                  </button>
                </EditPersonaliseSheet>
              ) : (
                <button className="text-stone-600 md:block hidden cursor-pointer hover:text-stone-800 uppercase tracking-wider opacity-50" disabled>
                  EDIT
                </button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="text-stone-600 md:text-base text-sm cursor-pointer hover:text-stone-800 uppercase tracking-wider"
                    disabled={loading}
                  >
                    REMOVE
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#F5F1E8] border-none">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-[#8B7355] font-century text-2xl font-[400]">
                      Remove Item
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-[oklch(54.45%_0.0296_76.5643)] font-century text-lg font-[400] leading-6 mb-2">
                      Are you sure you want to remove "{product.name}" from your cart?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex gap-4 mt-8">
                    <AlertDialogCancel className="bg-[#6B5B3F] text-white font-schoolbook-cond text-sm uppercase tracking-[0.1em] rounded-none border-none hover:bg-[#5A4A33]">
                      CANCEL
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRemoveItem}
                      className="bg-[#E8B851] text-[#6B5B3F] font-schoolbook-cond text-sm uppercase tracking-[0.1em] rounded-none border-none hover:bg-[#D4A441]"
                    >
                      REMOVE
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
        {isPersonalized ? (
          <EditPersonaliseSheet
            product={product}
            existingData={convertToPersonaliseData(item.custom_data)}
            onSave={handleSaveEdit}
          >
            <button className="text-stone-600 md:block hidden cursor-pointer hover:text-stone-800 uppercase tracking-wider">
              EDIT
            </button>
          </EditPersonaliseSheet>
        ) : (
          <button className="text-stone-600 md:block hidden cursor-pointer hover:text-stone-800 uppercase tracking-wider opacity-50" disabled>
            EDIT
          </button>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="text-stone-600 cursor-pointer hover:text-stone-800 uppercase tracking-wider"
              disabled={loading}
            >
              REMOVE
            </button>
          </AlertDialogTrigger>
          {isDesktop ? (
            // Desktop dialog
            <AlertDialogContent className="bg-[#F5F1E8] border-none">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[#40362c] font-century text-2xl font-[500]">
                  Remove Item
                </AlertDialogTitle>
                <AlertDialogDescription className="text-[oklch(54.45%_0.0296_76.5643)] font-century text-[15px] font-[400] leading-6 mb-2">
                  Are you sure you want to remove "{product.name}" from your cart?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex gap-4 mt-4 justify-center">
                <AlertDialogCancel className="bg-[#6B5B3F] text-[oklch(98.53%_0.0069_88.6416)] font-schoolbook-cond text-[10px] uppercase tracking-[0.1em] rounded-[6px] sborder-none hover:bg-[#5A4A33] w-full md:w-28">
                  CANCEL
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRemoveItem}
                  className="bg-[#E8B851] text-[#6B5B3F] font-schoolbook-cond text-[10px] uppercase tracking-[0.1em] rounded-[6px]  border-none hover:bg-[#D4A441] w-full md:w-28"
                >
                  REMOVE
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          ) : (
            // Mobile dialog
            <AlertDialogContent className="bg-[#F5F1E8] border-none">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[#40362c] font-century text-2xl font-[500]">
                  Remove Item
                </AlertDialogTitle>
                <AlertDialogDescription className="text-[oklch(54.45%_0.0296_76.5643)] font-century text-[15px] font-[400] leading-6 mb-2">
                  Are you sure you want to remove "{product.name}" from your cart?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex gap-4 mt-4 justify-center">
                <AlertDialogCancel className="bg-[#6B5B3F] text-[oklch(98.53%_0.0069_88.6416)] font-schoolbook-cond text-[10px] uppercase tracking-[0.1em] rounded-[6px] sborder-none hover:bg-[#5A4A33] w-full md:w-28">
                  CANCEL
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRemoveItem}
                  className="bg-[#E8B851] text-[#6B5B3F] font-schoolbook-cond text-[10px] uppercase tracking-[0.1em] rounded-[6px]  border-none hover:bg-[#D4A441] w-full md:w-28"
                >
                  REMOVE
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          )}
        </AlertDialog>
      </div>

      {isUpdating && (
        <Loader2 className="h-4 w-4 animate-spin text-stone-400" />
      )}
    </div>
  );
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth >= 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isDesktop;
}