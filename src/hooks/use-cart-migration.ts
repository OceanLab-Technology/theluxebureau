"use client";

import { useMainStore } from "@/store/mainStore";
import { useGuestCartStore } from "@/store/guestCartStore";
import { toast } from "sonner";
import { useCallback } from "react";

export function useCartMigration() {
  const { isAuthenticated, handleLoginSuccess } = useMainStore();
  const guestCartStore = useGuestCartStore();

  const migrateGuestCart = useCallback(async () => {
    if (isAuthenticated) {
      return;
    }

    const guestItems = guestCartStore.items;
    
    if (guestItems.length === 0) {
      return;
    }

    try {
      await handleLoginSuccess();
      
      return {
        success: true,
        itemCount: guestItems.length,
        message: `Successfully migrated ${guestItems.length} item${guestItems.length > 1 ? 's' : ''} to your account!`
      };
    } catch (error) {
      console.error('Cart migration failed:', error);
      return {
        success: false,
        itemCount: guestItems.length,
        message: 'Failed to migrate cart items. Please add them to your cart again.',
        error
      };
    }
  }, [isAuthenticated, guestCartStore.items, handleLoginSuccess]);

  const hasGuestCartItems = useCallback(() => {
    return guestCartStore.items.length > 0;
  }, [guestCartStore.items.length]);

  const getGuestCartItemCount = useCallback(() => {
    return guestCartStore.getItemCount();
  }, [guestCartStore]);

  const clearGuestCart = useCallback(() => {
    guestCartStore.clearCart();
    toast.success('Guest cart cleared');
  }, [guestCartStore]);

  return {
    migrateGuestCart,
    hasGuestCartItems,
    getGuestCartItemCount,
    clearGuestCart,
    guestItems: guestCartStore.items,
  };
}
