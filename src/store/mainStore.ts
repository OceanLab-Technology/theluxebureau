import { Product, ApiResponse, CartItem } from "@/app/api/types";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useGuestCartStore, GuestCartItem } from "./guestCartStore";
import { createClient } from "@/lib/supabase/client";

interface MainStore {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;

  // Cart state
  cartItems: CartItem[];
  cartLoading: boolean;
  cartError: string | null;
  cartTotal: number;
  cartItemCount: number;
  isAuthenticated: boolean | null;

  fetchProducts: (params?: {
    category?: string;
    name?: string;
  }) => Promise<void>;
  detailedProductLoading: boolean;
  fetchProductById: (id: string) => Promise<void>;

  // Cart actions - now handles both authenticated and guest carts
  fetchCartItems: () => Promise<void>;
  addToCart: (
    productId: string,
    quantity: number,
    customData?: Record<string, any>
  ) => Promise<void>;
  updateCartItem: (
    itemId: string,
    quantity: number,
    customData?: Record<string, any>
  ) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  calculateCartTotal: () => void;

  // Authentication helpers
  checkAuthStatus: () => Promise<boolean>;
  handleLoginSuccess: () => Promise<void>;
  handleLogout: () => void;

  // Global reset method
  resetStore: () => void;
}

export const useMainStore = create<MainStore>()(
  persist(
    (set, get) => ({
      products: [],
      currentProduct: null,
      loading: false,
      error: null,
      detailedProductLoading: false,

      // Cart initial state
      cartItems: [],
      cartLoading: false,
      cartError: null,
      cartTotal: 0,
      cartItemCount: 0,
      isAuthenticated: null,

      fetchProducts: async (params = {}) => {
        const currentState = get();
        if (
          currentState.loading ||
          (currentState.products.length > 0 && Object.keys(params).length === 0)
        ) {
          return;
        }

        try {
          set({ loading: true, error: null });

          const searchParams = new URLSearchParams();
          if (params.category) searchParams.append("category", params.category);
          if (params.name) searchParams.append("name", params.name);

          const url = `/api/products${
            searchParams.toString() ? `?${searchParams.toString()}` : ""
          }`;
          const response = await fetch(url);
          const apiResponse: ApiResponse<Product[]> = await response.json();

          if (!response.ok) {
            throw new Error(apiResponse.error || "Failed to fetch products");
          }

          set({
            loading: false,
            products: apiResponse.data || [],
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            loading: false,
          });
        }
      },

      fetchProductById: async (id: string) => {
        if (get().currentProduct?.id === id) {
          return; // If the product is already fetched, do nothing
        }
        try {
          set({ error: null, detailedProductLoading: true });

          const response = await fetch(`/api/products/${id}`);
          const apiResponse: ApiResponse<Product> = await response.json();

          if (!response.ok) {
            throw new Error(apiResponse.error || "Failed to fetch product");
          }
          set({
            currentProduct: apiResponse.data,
            detailedProductLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            detailedProductLoading: false,
          });
        }
      },

      fetchCartItems: async () => {
        const currentState = get();
        if (currentState.cartLoading) {
          return;
        }

        try {
          set({ cartLoading: true, cartError: null });
          const isAuth = currentState.isAuthenticated;

          if (isAuth === null) {
            await get().checkAuthStatus();
          }

          if (get().isAuthenticated) {
            // Fetch from API for authenticated users
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
            // Use guest cart for non-authenticated users
            const guestStore = useGuestCartStore.getState();
            const guestItems = guestStore.items;

            // Convert guest items to cart item format for display
            const cartItems: CartItem[] = guestItems.map((item) => ({
              id: item.id,
              user_id: "guest",
              product_id: item.product_id,
              quantity: item.quantity,
              custom_data: item.custom_data || {},
              created_at: item.added_at,
              updated_at: item.added_at,
            }));

            set({
              cartItems,
              cartLoading: false,
              cartError: null,
            });
          }

          // Calculate totals
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
        customData?: Record<string, any>
      ) => {
        try {
          set({ cartLoading: true, cartError: null });

          if (get().isAuthenticated) {
            // Add to authenticated user's cart via API
            const response = await fetch("/api/cart", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                product_id: productId,
                quantity,
                custom_data: customData,
              }),
            });

            const apiResponse: ApiResponse<CartItem> = await response.json();

            if (!response.ok) {
              throw new Error(
                apiResponse.error || "Failed to add item to cart"
              );
            }

            // Optimistically update the cart items with the new item
            const newCartItem = apiResponse.data;
            if (!newCartItem) {
              throw new Error("Failed to get cart item data");
            }

            const currentCartItems = get().cartItems;

            // Check if item already exists in cart
            const existingItemIndex = currentCartItems.findIndex(
              (item) =>
                item.product_id === productId &&
                JSON.stringify(item.custom_data) === JSON.stringify(customData)
            );

            let updatedCartItems: CartItem[];
            if (existingItemIndex >= 0) {
              // Update existing item quantity
              updatedCartItems = currentCartItems.map((item, index) =>
                index === existingItemIndex
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              );
            } else {
              // Add new item
              updatedCartItems = [...currentCartItems, newCartItem];
            }

            set({
              cartItems: updatedCartItems,
              cartLoading: false,
            });

            // Calculate totals immediately
            get().calculateCartTotal();
          } else {
            // Add to guest cart
            const guestStore = useGuestCartStore.getState();
            guestStore.addItem(productId, quantity, customData);

            // Update local cart display immediately
            const guestItems = guestStore.items;
            const cartItems: CartItem[] = guestItems.map((item) => ({
              id: item.id,
              user_id: "guest",
              product_id: item.product_id,
              quantity: item.quantity,
              custom_data: item.custom_data || {},
              created_at: item.added_at,
              updated_at: item.added_at,
            }));

            set({
              cartItems,
              cartLoading: false,
            });

            // Calculate totals immediately
            get().calculateCartTotal();
          }
        } catch (error) {
          set({
            cartError:
              error instanceof Error ? error.message : "Failed to add to cart",
            cartLoading: false,
          });
          throw error; // Re-throw so AddToCartButton can handle it
        }
      },

      updateCartItem: async (
        itemId: string,
        quantity: number,
        customData?: Record<string, any>
      ) => {
        try {
          // Optimistically update the UI first
          const currentCartItems = get().cartItems;
          const optimisticCartItems = currentCartItems.map((item) =>
            item.id === itemId
              ? { ...item, quantity, custom_data: customData }
              : item
          );

          set({
            cartItems: optimisticCartItems,
            cartLoading: true,
            cartError: null,
          });

          // Calculate totals immediately
          get().calculateCartTotal();

          if (get().isAuthenticated) {
            // Update authenticated user's cart via API
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
              // Revert optimistic update on error
              set({ cartItems: currentCartItems });
              get().calculateCartTotal();
              throw new Error(
                apiResponse.error || "Failed to update cart item"
              );
            }

            set({ cartLoading: false });
          } else {
            // Update guest cart
            const guestStore = useGuestCartStore.getState();
            guestStore.updateItem(itemId, quantity, customData);

            set({ cartLoading: false });
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
          // Optimistically update the UI first
          const currentCartItems = get().cartItems;
          const optimisticCartItems = currentCartItems.filter(
            (item) => item.id !== itemId
          );

          set({
            cartItems: optimisticCartItems,
            cartLoading: true,
            cartError: null,
          });

          // Calculate totals immediately
          get().calculateCartTotal();
          toast.success(`Item removed from cart`);

          if (get().isAuthenticated) {
            // Remove from authenticated user's cart via API
            const response = await fetch(`/api/cart/${itemId}`, {
              method: "DELETE",
            });

            const apiResponse: ApiResponse<void> = await response.json();

            if (!response.ok) {
              // Revert optimistic update on error
              set({ cartItems: currentCartItems });
              get().calculateCartTotal();
              throw new Error(
                apiResponse.error || "Failed to remove item from cart"
              );
            }

            set({ cartLoading: false });
          } else {
            // Remove from guest cart
            const guestStore = useGuestCartStore.getState();
            guestStore.removeItem(itemId);

            set({ cartLoading: false });
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
            // Clear authenticated user's cart via API
            const response = await fetch("/api/cart", {
              method: "DELETE",
            });

            const apiResponse: ApiResponse<void> = await response.json();

            if (!response.ok) {
              throw new Error(apiResponse.error || "Failed to clear cart");
            }
          } else {
            // Clear guest cart
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
        const { cartItems, products } = get();
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

      checkAuthStatus: async () => {
        const currentState = get();

        // If we already know the auth status, don't check again
        if (currentState.isAuthenticated !== null) {
          return currentState.isAuthenticated;
        }

        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          const isAuth = !!user;
          set({ isAuthenticated: isAuth });
          return isAuth;
        } catch (error) {
          set({ isAuthenticated: false });
          return false;
        }
      },

      handleLoginSuccess: async () => {
        set({ isAuthenticated: true });

        // Migrate guest cart to user cart
        const guestStore = useGuestCartStore.getState();
        const guestItems = guestStore.items;

        if (guestItems.length > 0) {
          try {
            // Migrate each guest cart item to user cart
            for (const item of guestItems) {
              await fetch("/api/cart", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  product_id: item.product_id,
                  quantity: item.quantity,
                  custom_data: item.custom_data,
                }),
              });
            }

            // Clear guest cart after successful migration
            guestStore.clearCart();
            guestStore.mergeWithUserCart([]);

            toast.success("Cart items migrated successfully!");
          } catch (error) {
            console.error("Failed to migrate cart items:", error);
            toast.error("Failed to migrate cart items");
          }
        }

        // Fetch updated cart
        await get().fetchCartItems();
      },

      handleLogout: () => {
        set({
          isAuthenticated: false,
          cartItems: [],
          cartTotal: 0,
          cartItemCount: 0,
        });

        // Reset guest cart store to guest mode
        const guestStore = useGuestCartStore.getState();
        guestStore.clearCart();
        set({ isAuthenticated: false });
      },

      resetStore: () => {
        set({
          products: [],
          currentProduct: null,
          loading: false,
          error: null,
          detailedProductLoading: false,
          cartItems: [],
          cartLoading: false,
          cartError: null,
          cartTotal: 0,
          cartItemCount: 0,
          isAuthenticated: null,
        });
      },
    }),
    {
      name: "main-store",
      partialize: (state) => ({
        cartItems: state.cartItems,
        cartTotal: state.cartTotal,
        cartItemCount: state.cartItemCount,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
