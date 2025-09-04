import { CartItem, ApiResponse } from "@/app/api/types";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useGuestCartStore } from "./guestCartStore";
import { useProductStore } from "./productStore";

interface CartStore {
  cartItems: CartItem[];
  cartLoading: boolean;
  cartError: string | null;
  cartTotal: number;
  cartItemCount: number;
  cartInitialized: boolean;
  isCartSheetOpen: boolean;
  isAuthenticated: boolean;

  setCartSheetOpen: (open: boolean) => void;
  setAuthStatus: (isAuth: boolean) => void;
  fetchCartItems: () => Promise<void>;
  addToCart: (
    productId: string,
    quantity: number,
    customData?: Record<string, any>,
    selectedVariantName?: string
  ) => Promise<void>;
  updateCartItem: (
    itemId: string,
    quantity: number,
    customData?: Record<string, any>
  ) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  calculateCartTotal: () => void;
  handleLoginSuccess: () => Promise<void>;
  handleLogout: () => void;
  checkInventoryAvailability: () => Promise<boolean>;
  reserveCartInventory: () => Promise<boolean>;
  releaseCartInventory: (
    items?: Array<{
      product_id: string;
      quantity: number;
      selected_variant_name?: string;
    }>
  ) => Promise<void>;
  confirmCartInventory: (
    items?: Array<{
      product_id: string;
      quantity: number;
      selected_variant_name?: string;
    }>
  ) => Promise<void>;
  resetCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      cartLoading: false,
      cartError: null,
      cartTotal: 0,
      cartItemCount: 0,
      isAuthenticated: false,
      cartInitialized: false,
      isCartSheetOpen: false,

      setCartSheetOpen: (open: boolean) => set({ isCartSheetOpen: open }),

      setAuthStatus: (isAuth: boolean) => set({ isAuthenticated: isAuth }),

      fetchCartItems: async () => {
        try {
          set({ cartLoading: true, cartError: null });

          if (get().isAuthenticated) {
            const response = await fetch("/api/cart");
            const apiResponse: ApiResponse<CartItem[]> = await response.json();

            if (!response.ok) {
              throw new Error(
                apiResponse.error || "Failed to fetch cart items"
              );
            }

            const cartItems = apiResponse.data || [];
            set({
              cartItems,
              cartLoading: false,
              cartError: null,
            });
          } else {
            const guestStore = useGuestCartStore.getState();
            const guestItems = guestStore.items;

            const cartItems: CartItem[] = guestItems.map((item) => ({
              id: item.id,
              user_id: "guest",
              product_id: item.product_id,
              quantity: item.quantity,
              custom_data: item.custom_data || {},
              selected_variant_name: item.selected_variant_name ?? null,
              created_at: item.added_at,
              updated_at: item.added_at,
            }));

            set({
              cartItems,
              cartLoading: false,
              cartError: null,
            });
          }

          get().calculateCartTotal();
        } catch (error) {
          set({
            cartError:
              error instanceof Error ? error.message : "Failed to fetch cart",
            cartLoading: false,
          });
        }
      },

      addToCart: async (
        productId: string,
        quantity: number,
        customData?: Record<string, any>,
        selectedVariantName?: string
      ) => {
        try {
          set({ cartLoading: true, cartError: null });

          if (get().isAuthenticated) {
            const response = await fetch("/api/cart", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                product_id: productId,
                quantity,
                custom_data: customData,
                selected_variant_name: selectedVariantName,
              }),
            });

            const apiResponse: ApiResponse<CartItem> = await response.json();

            if (!response.ok) {
              throw new Error(
                apiResponse.error || "Failed to add item to cart"
              );
            }

            await get().fetchCartItems();
          } else {
            const guestStore = useGuestCartStore.getState();
            guestStore.addItem(
              productId,
              quantity,
              customData,
              selectedVariantName
            );
            await get().fetchCartItems();
          }
        } catch (error) {
          set({
            cartError:
              error instanceof Error ? error.message : "Failed to add to cart",
            cartLoading: false,
          });
          throw error;
        }
      },

      updateCartItem: async (
        itemId: string,
        quantity: number,
        customData?: Record<string, any>
      ) => {
        try {
          set({ cartLoading: true, cartError: null });

          if (get().isAuthenticated) {
            const response = await fetch(`/api/cart/${itemId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                quantity,
                custom_data: customData,
              }),
            });

            const apiResponse: ApiResponse<CartItem> = await response.json();

            if (!response.ok) {
              throw new Error(
                apiResponse.error || "Failed to update cart item"
              );
            }

            const cartItems = get().cartItems.map((item) =>
              item.id === itemId
                ? { ...item, quantity, custom_data: customData }
                : item
            );

            set({ cartItems, cartLoading: false });
            get().calculateCartTotal();
          } else {
            const guestStore = useGuestCartStore.getState();
            guestStore.updateItem(itemId, quantity, customData);
            await get().fetchCartItems();
          }
        } catch (error) {
          set({
            cartError:
              error instanceof Error
                ? error.message
                : "Failed to update cart item",
            cartLoading: false,
          });
        }
      },

      removeFromCart: async (itemId: string) => {
        try {
          set({ cartLoading: true, cartError: null });

          if (get().isAuthenticated) {
            const response = await fetch(`/api/cart/${itemId}`, {
              method: "DELETE",
            });

            const apiResponse: ApiResponse<void> = await response.json();

            if (!response.ok) {
              throw new Error(
                apiResponse.error || "Failed to remove item from cart"
              );
            }

            const cartItems = get().cartItems.filter(
              (item) => item.id !== itemId
            );
            set({ cartItems, cartLoading: false });
            toast.success(`Item removed from cart`);
            get().calculateCartTotal();
          } else {
            const guestStore = useGuestCartStore.getState();
            guestStore.removeItem(itemId);
            await get().fetchCartItems();
            toast.success(`Item removed from cart`);
          }
        } catch (error) {
          set({
            cartError:
              error instanceof Error
                ? error.message
                : "Failed to remove from cart",
            cartLoading: false,
          });
        }
      },

      clearCart: async () => {
        try {
          set({ cartLoading: true, cartError: null });

          if (get().isAuthenticated) {
            const response = await fetch("/api/cart", {
              method: "DELETE",
            });

            const apiResponse: ApiResponse<void> = await response.json();

            if (!response.ok) {
              throw new Error(apiResponse.error || "Failed to clear cart");
            }
          } else {
            const guestStore = useGuestCartStore.getState();
            guestStore.clearCart();
          }

          set({
            cartItems: [],
            cartTotal: 0,
            cartItemCount: 0,
            cartLoading: false,
          });
        } catch (error) {
          set({
            cartError:
              error instanceof Error ? error.message : "Failed to clear cart",
            cartLoading: false,
          });
        }
      },

      calculateCartTotal: () => {
        const { cartItems } = get();
        const { products } = useProductStore.getState();
        let total = 0;
        let itemCount = 0;

        cartItems.forEach((item) => {
          const product = products.find((p) => p.id === item.product_id);
          if (product && product.price) {
            total += product.price * item.quantity;
          }
          itemCount += item.quantity;
        });

        set({ cartTotal: total, cartItemCount: itemCount });
      },

      handleLoginSuccess: async () => {
        set({ isAuthenticated: true });

        const guestStore = useGuestCartStore.getState();
        const guestItems = guestStore.items;

        if (guestItems.length > 0) {
          try {
            const response = await fetch("/api/cart/merge-guest", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                guestItems: guestItems,
              }),
            });

            const result = await response.json();

            if (!response.ok) {
              throw new Error(result.error || "Failed to migrate cart items");
            }

            guestStore.clearCart();
            guestStore.mergeWithUserCart([]);

            const { migratedCount, errors } = result;
            if (errors && errors.length > 0) {
              toast.warning(
                `Migrated ${migratedCount} items with some issues. Check console for details.`
              );
              console.warn("Cart migration warnings:", errors);
            } else {
              toast.success(
                `Successfully migrated ${migratedCount} item${
                  migratedCount > 1 ? "s" : ""
                } to your account!`
              );
            }
          } catch (error) {
            console.error("Failed to migrate cart items:", error);
            toast.error("Failed to migrate cart items. Please add them again.");
            console.log("Guest items that failed to migrate:", guestItems);
          }
        }

        await get().fetchCartItems();
      },

      handleLogout: () => {
        set({
          isAuthenticated: false,
          cartItems: [],
          cartTotal: 0,
          cartItemCount: 0,
        });

        const guestStore = useGuestCartStore.getState();
        guestStore.clearCart();
      },

      checkInventoryAvailability: async () => {
        try {
          const { cartItems } = get();

          if (cartItems.length === 0) {
            return true;
          }

          const items = cartItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            selected_variant_name: item.selected_variant_name || "default",
          }));

          const response = await fetch("/api/cart/check-inventory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || "Failed to check inventory");
          }

          const { data } = result;

          if (!data.all_available) {
            data.unavailable_items.forEach((item: any) => {
              const variantText =
                item.variant_name && item.variant_name !== "default"
                  ? ` (${item.variant_name})`
                  : "";
              toast.error(`Out of stock: ${item.product_name}${variantText}`, {
                duration: 5000,
              });
            });
            return false;
          }

          if (data.warnings.length > 0) {
            const warningMessages = data.warnings.map(
              (item: any) =>
                `${item.product_name} (${item.variant_name}): Low stock (${item.available_quantity} remaining)`
            );

            toast.warning(`Low stock warning:\n${warningMessages.join("\n")}`, {
              duration: 5000,
            });
          }

          return true;
        } catch (error) {
          console.error("Inventory check failed:", error);
          toast.error("Failed to check inventory availability");
          return false;
        }
      },

      reserveCartInventory: async () => {
        try {
          const { cartItems } = get();

          if (cartItems.length === 0) {
            return true;
          }

          const items = cartItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            selected_variant_name: item.selected_variant_name || "default",
          }));

          const response = await fetch("/api/cart/reserve-inventory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || "Failed to reserve inventory");
          }

          const { data } = result;

          if (!data.success) {
            data.failed_items.forEach((item: any) => {
              toast.error(
                `Failed to reserve: ${item.variant_name} - ${item.reason}`,
                {
                  duration: 5000,
                }
              );
            });
            return false;
          }

          return true;
        } catch (error) {
          console.error("Inventory reservation failed:", error);
          toast.error("Failed to reserve inventory for checkout");
          return false;
        }
      },

      releaseCartInventory: async (items) => {
        try {
          const { cartItems } = get();
          const itemsToRelease =
            items ||
            cartItems.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
              selected_variant_name: item.selected_variant_name || "default",
            }));

          if (itemsToRelease.length === 0) {
            return;
          }

          const response = await fetch("/api/cart/release-inventory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: itemsToRelease }),
          });

          const result = await response.json();

          if (!response.ok) {
            console.error("Failed to release inventory:", result.error);
            return;
          }

          console.log("Inventory released successfully");
        } catch (error) {
          console.error("Inventory release failed:", error);
        }
      },

      confirmCartInventory: async (items) => {
        try {
          const { cartItems } = get();
          const itemsToConfirm =
            items ||
            cartItems.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
              selected_variant_name: item.selected_variant_name || "default",
            }));

          if (itemsToConfirm.length === 0) {
            return;
          }

          const response = await fetch("/api/cart/confirm-inventory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: itemsToConfirm }),
          });

          const result = await response.json();

          if (!response.ok) {
            console.error("Failed to confirm inventory:", result.error);
            return;
          }

          console.log("Inventory confirmed successfully");
        } catch (error) {
          console.error("Inventory confirmation failed:", error);
        }
      },

      resetCart: () => {
        set({
          cartItems: [],
          cartLoading: false,
          cartError: null,
          cartTotal: 0,
          cartItemCount: 0,
          isAuthenticated: false,
          isCartSheetOpen: false,
          cartInitialized: false,
        });
      },
    }),
    {
      name: "cart-store",
      partialize: (state) => ({
        cartItems: state.cartItems,
        cartTotal: state.cartTotal,
        cartItemCount: state.cartItemCount,
        isAuthenticated: state.isAuthenticated,
        cartInitialized: state.cartInitialized,
      }),
    }
  )
);
