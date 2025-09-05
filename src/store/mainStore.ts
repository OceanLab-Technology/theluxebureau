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
  detailedProductLoading: boolean;

  cartItems: CartItem[];
  cartLoading: boolean;
  cartError: string | null;
  cartTotal: number;
  cartItemCount: number;
  cartInitialized: boolean;
  isAuthenticated: boolean | null;
  isCartSheetOpen: boolean;

  setCartSheetOpen: (open: boolean) => void;
  fetchProducts: (params?: { category?: string; name?: string }) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  fetchCartItems: () => Promise<void>;
  addToCart: (productId: string, quantity: number, customData?: Record<string, any>, selectedVariantName?: string) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number, customData?: Record<string, any>) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  calculateCartTotal: () => void;
  checkAuthStatus: () => Promise<boolean>;
  handleLoginSuccess: () => Promise<void>;
  handleLogout: () => void;
  checkInventoryAvailability: () => Promise<boolean>;
  reserveCartInventory: () => Promise<boolean>;
  releaseCartInventory: (items?: Array<{ product_id: string; quantity: number; selected_variant_name?: string }>) => Promise<void>;
  confirmCartInventory: (items?: Array<{ product_id: string; quantity: number; selected_variant_name?: string }>) => Promise<void>;
  resetStore: () => void;
  getCartTotal: () => number;
}

export const useMainStore = create<MainStore>()(
  persist(
    (set, get) => ({
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
      cartInitialized: false,
      isCartSheetOpen: false,

      setCartSheetOpen: (open: boolean) => set({ isCartSheetOpen: open }),

      getCartTotal: () => {
        const { cartItems, products } = get();
        return cartItems.reduce((total, item) => {
          const product = products.find(p => p.id === item.product_id);
          return product?.price ? total + product.price * item.quantity : total;
        }, 0);
      },


      fetchProducts: async (params = {}) => {
        try {
          set({ loading: true, error: null });

          const searchParams = new URLSearchParams();
          if (params.category) searchParams.append("category", params.category);
          if (params.name) searchParams.append("name", params.name);

          const url = `/api/products${searchParams.toString() ? `?${searchParams.toString()}` : ""
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

          if (get().cartItems.length > 0) {
            get().calculateCartTotal();
          }

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
          get().calculateCartTotal();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            detailedProductLoading: false,
          });
        }
      },

      fetchCartItems: async () => {
        try {
          set({ cartLoading: true, cartError: null });

          // Check if user is authenticated
          const isAuth = get().isAuthenticated;

          if (isAuth === null) {
            // Check authentication status first
            await get().checkAuthStatus();
          }

          if (get().isAuthenticated) {
            // Fetch from API for authenticated users
            const response = await fetch('/api/cart');
            const apiResponse: ApiResponse<CartItem[]> = await response.json();

            if (!response.ok) {
              throw new Error(apiResponse.error || "Failed to fetch cart items");
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
            const cartItems: CartItem[] = guestItems.map(item => ({
              id: item.id,
              user_id: 'guest',
              product_id: item.product_id,
              quantity: item.quantity,
              custom_data: item.custom_data || {},
              selected_variant_name: item.selected_variant_name ?? null, // 👈 null when absent
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
            cartError: error instanceof Error ? error.message : "Failed to fetch cart",
            cartLoading: false,
          });
        }
      },

      // fetchCartItems: async (force = false) => {
      //   if (get().cartInitialized && !force) return;

      //   try {
      //     set({ cartLoading: true, cartError: null });

      //     if (get().isAuthenticated === null) {
      //       await get().checkAuthStatus();
      //     }

      //     let cartItems: CartItem[] = [];

      //     if (get().isAuthenticated) {
      //       const response = await fetch('/api/cart');
      //       const apiResponse: ApiResponse<CartItem[]> = await response.json();
      //       if (!response.ok) throw new Error(apiResponse.error || 'Failed to fetch cart items');
      //       cartItems = apiResponse.data || [];
      //     } else {
      //       const guestStore = useGuestCartStore.getState();
      //       const guestItems = guestStore.items;

      //       cartItems = guestItems.map(item => ({
      //         id: item.id,
      //         user_id: 'guest',
      //         product_id: item.product_id,
      //         quantity: item.quantity,
      //         custom_data: item.custom_data || {},
      //         created_at: item.added_at,
      //         updated_at: item.added_at,
      //       }));
      //     }

      //     set({
      //       cartItems,
      //       cartLoading: false,
      //       cartError: null,
      //       cartInitialized: true, // mark initialized
      //     });

      //     get().calculateCartTotal();
      //   } catch (error) {
      //     set({
      //       cartError: error instanceof Error ? error.message : 'Failed to fetch cart',
      //       cartLoading: false,
      //     });
      //   }
      // },


      addToCart: async (productId: string, quantity: number, customData?: Record<string, any>, selectedVariantName?: string) => {

        const guestStore = useGuestCartStore.getState();
        try {
          set({ cartLoading: true, cartError: null });

          if (get().isAuthenticated) {
            // Add to authenticated user's cart via API
            const response = await fetch('/api/cart', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                product_id: productId,
                quantity,
                custom_data: customData,
                selected_variant_name: selectedVariantName
              }),
            });

            const apiResponse: ApiResponse<CartItem> = await response.json();

            if (!response.ok) {
              throw new Error(apiResponse.error || "Failed to add item to cart");
            }

            // Refresh cart items
            await get().fetchCartItems();
          } else {
            // Add to guest cart
            const guestStore = useGuestCartStore.getState();
            guestStore.addItem(productId, quantity, customData, selectedVariantName);

            // Update local cart display
            await get().fetchCartItems();
          }
        } catch (error) {
          set({
            cartError: error instanceof Error ? error.message : "Failed to add to cart",
            cartLoading: false,
          });
          throw error;
        }
      },

      // addToCart: async (productId: string, quantity: number, customData?: Record<string, any>) => {
      //   try {
      //     set({ cartLoading: true, cartError: null });

      //     if (get().isAuthenticated) {
      //       const response = await fetch('/api/cart', {
      //         method: 'POST',
      //         headers: { 'Content-Type': 'application/json' },
      //         body: JSON.stringify({ product_id: productId, quantity, custom_data: customData }),
      //       });

      //       const apiResponse: ApiResponse<CartItem> = await response.json();
      //       if (!response.ok) throw new Error(apiResponse.error || 'Failed to add item to cart');

      //       await get().fetchCartItems(true); // force refresh
      //     } else {
      //       const guestStore = useGuestCartStore.getState();
      //       guestStore.addItem(productId, quantity, customData);
      //       await get().fetchCartItems(true); // refresh local cart
      //     }
      //   } catch (error) {
      //     set({ cartError: error instanceof Error ? error.message : 'Failed to add to cart', cartLoading: false });
      //     throw error;
      //   }
      // },


      updateCartItem: async (itemId: string, quantity: number, customData?: Record<string, any>) => {
        try {
          set({ cartLoading: true, cartError: null });

          if (get().isAuthenticated) {
            // Update authenticated user's cart via API
            const response = await fetch(`/api/cart/${itemId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                quantity,
                custom_data: customData,
              }),
            });

            const apiResponse: ApiResponse<CartItem> = await response.json();

            if (!response.ok) {
              throw new Error(apiResponse.error || "Failed to update cart item");
            }

            // Update local state optimistically
            const cartItems = get().cartItems.map(item =>
              item.id === itemId ? { ...item, quantity, custom_data: customData } : item
            );

            set({ cartItems, cartLoading: false });
            get().calculateCartTotal();
          } else {
            // Update guest cart
            const guestStore = useGuestCartStore.getState();
            guestStore.updateItem(itemId, quantity, customData);

            // Update local cart display
            await get().fetchCartItems();
          }
        } catch (error) {
          set({
            cartError: error instanceof Error ? error.message : "Failed to update cart item",
            cartLoading: false,
          });
        }
      },

      removeFromCart: async (itemId: string) => {
        try {
          set({ cartLoading: true, cartError: null });

          if (get().isAuthenticated) {
            // Remove from authenticated user's cart via API
            const response = await fetch(`/api/cart/${itemId}`, {
              method: 'DELETE',
            });

            const apiResponse: ApiResponse<void> = await response.json();

            if (!response.ok) {
              throw new Error(apiResponse.error || "Failed to remove item from cart");
            }

            const cartItems = get().cartItems.filter(item => item.id !== itemId);
            set({ cartItems, cartLoading: false });
            toast.success(`Item removed from cart`);
            get().calculateCartTotal();
          } else {
            // Remove from guest cart
            const guestStore = useGuestCartStore.getState();
            guestStore.removeItem(itemId);

            // Update local cart display
            await get().fetchCartItems();
            toast.success(`Item removed from cart`);
          }
        } catch (error) {
          set({
            cartError: error instanceof Error ? error.message : "Failed to remove from cart",
            cartLoading: false,
          });
        }
      },

      clearCart: async () => {
        try {
          set({ cartLoading: true, cartError: null });

          if (get().isAuthenticated) {
            // Clear authenticated user's cart via API
            const response = await fetch('/api/cart', {
              method: 'DELETE',
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
            cartError: error instanceof Error ? error.message : "Failed to clear cart",
            cartLoading: false,
          });
        }
      },

      // calculateCartTotal: () => {
      //   const { cartItems, products } = get();
      //   let total = 0;
      //   let itemCount = 0;

      //   cartItems.forEach(item => {
      //     const product = products.find(p => p.id === item.product_id);
      //     if (product && product.price) {
      //       total += product.price * item.quantity;
      //     }
      //     itemCount += item.quantity;
      //   });

      //   set({ cartTotal: total, cartItemCount: itemCount });
      // },

      // calculateCartTotal: () => {
      //   const { cartItems, products } = get();
      //   let total = 0;
      //   let itemCount = 0;

      //   console.log("DEBUG CART CALCULATION");
      //   console.log("cartItems:", cartItems);
      //   console.log("products:", products);

      //   cartItems.forEach(item => {
      //     const product = products.find(p => p.id === item.product_id);
      //     console.log("item:", item, "product:", product);
      //     if (product && product.price) {
      //       total += product.price * item.quantity;
      //     }
      //     itemCount += item.quantity;
      //   });

      //   console.log("Calculated total:", total, "itemCount:", itemCount);

      //   set({ cartTotal: total, cartItemCount: itemCount });
      // },

      calculateCartTotal: () => {
        const { cartItems, products } = get();

        if (products.length === 0) {
          console.log("Products not loaded yet, skipping cart calculation");
          // return; // do not calculate until products are loaded
        }

        let total = 0;
        let itemCount = 0;

        cartItems.forEach(item => {
          const product = products.find(p => p.id === item.product_id);
          if (product?.price) {
            total += product.price * item.quantity;
          }
          itemCount += item.quantity;
        });

        set({ cartTotal: total, cartItemCount: itemCount });
      },


      checkAuthStatus: async () => {
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          set({ isAuthenticated: !!user });
          return !!user;
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
            // Use dedicated merge endpoint for better handling
            const response = await fetch('/api/cart/merge-guest', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                guestItems: guestItems
              }),
            });

            const result = await response.json();

            if (!response.ok) {
              throw new Error(result.error || 'Failed to migrate cart items');
            }

            // Clear guest cart after successful migration
            guestStore.clearCart();
            guestStore.mergeWithUserCart([]);

            // Show success message with migration details
            const { migratedCount, errors } = result;
            if (errors && errors.length > 0) {
              toast.warning(`Migrated ${migratedCount} items with some issues. Check console for details.`);
              console.warn('Cart migration warnings:', errors);
            } else {
              toast.success(`Successfully migrated ${migratedCount} item${migratedCount > 1 ? 's' : ''} to your account!`);
            }
          } catch (error) {
            console.error('Failed to migrate cart items:', error);
            toast.error('Failed to migrate cart items. Please add them again.');

            // On migration failure, keep guest items visible but log them
            console.log('Guest items that failed to migrate:', guestItems);
          }
        }

        // Fetch updated cart (this will show migrated items + any existing user cart items)
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

      // Inventory Management Functions
      checkInventoryAvailability: async () => {
        try {
          const { cartItems } = get();

          if (cartItems.length === 0) {
            return true;
          }
          const items = cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            selected_variant_name: item.selected_variant_name || 'default',
          }));

          const response = await fetch('/api/cart/check-inventory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || 'Failed to check inventory');
          }

          const { data } = result;

          if (!data.all_available) {
            data.unavailable_items.forEach((item: any) => {
              const variantText = item.variant_name && item.variant_name !== 'default' ? ` (${item.variant_name})` : '';
              toast.error(`Out of stock: ${item.product_name}${variantText}`, {
                duration: 5000,
              });
            });
            return false;
          } if (data.warnings.length > 0) {
            const warningMessages = data.warnings.map((item: any) =>
              `${item.product_name} (${item.variant_name}): Low stock (${item.available_quantity} remaining)`
            );

            toast.warning(`Low stock warning:\n${warningMessages.join('\n')}`, {
              duration: 5000,
            });
          }

          return true;

        } catch (error) {
          console.error('Inventory check failed:', error);
          toast.error('Failed to check inventory availability');
          return false;
        }
      },

      reserveCartInventory: async () => {
        try {
          const { cartItems } = get();

          if (cartItems.length === 0) {
            return true;
          }

          const items = cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            selected_variant_name: item.selected_variant_name || 'default',
          }));

          const response = await fetch('/api/cart/reserve-inventory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || 'Failed to reserve inventory');
          }

          const { data } = result;

          if (!data.success) {
            data.failed_items.forEach((item: any) => {
              toast.error(`Failed to reserve: ${item.variant_name} - ${item.reason}`, {
                duration: 5000,
              });
            });
            return false;
          }

          // toast.success('Inventory reserved for checkout');
          return true;

        } catch (error) {
          console.error('Inventory reservation failed:', error);
          toast.error('Failed to reserve inventory for checkout');
          return false;
        }
      },

      releaseCartInventory: async (items) => {
        try {
          const { cartItems } = get();
          const itemsToRelease = items || cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            selected_variant_name: item.selected_variant_name || 'default',
          }));

          if (itemsToRelease.length === 0) {
            return;
          }

          const response = await fetch('/api/cart/release-inventory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: itemsToRelease }),
          });

          const result = await response.json();

          if (!response.ok) {
            console.error('Failed to release inventory:', result.error);
            return;
          }

          console.log('Inventory released successfully');

        } catch (error) {
          console.error('Inventory release failed:', error);
        }
      },

      confirmCartInventory: async (items) => {
        try {
          const { cartItems } = get();
          const itemsToConfirm = items || cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            selected_variant_name: item.selected_variant_name || 'default',
          }));

          if (itemsToConfirm.length === 0) {
            return;
          }

          const response = await fetch('/api/cart/confirm-inventory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: itemsToConfirm }),
          });

          const result = await response.json();

          if (!response.ok) {
            console.error('Failed to confirm inventory:', result.error);
            return;
          }

          console.log('Inventory confirmed successfully');

        } catch (error) {
          console.error('Inventory confirmation failed:', error);
        }
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
          isCartSheetOpen: false,
        });
      },
    }),
    {
      name: 'main-store',
      partialize: (state) => ({
        cartItems: state.cartItems,
        cartItemCount: state.cartItemCount,
        isAuthenticated: state.isAuthenticated,
        cartInitialized: state.cartInitialized, // persist it
      }),
    }
  )
);
