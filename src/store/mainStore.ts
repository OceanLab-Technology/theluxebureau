import { Product, ApiResponse, CartItem } from "@/app/api/types";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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

  fetchProducts: (params?: {
    category?: string;
    name?: string;
  }) => Promise<void>;
  detailedProductLoading: boolean;
  fetchProductById: (id: string) => Promise<void>;

  // Cart actions
  fetchCartItems: () => Promise<void>;
  addToCart: (productId: string, quantity: number, customData?: Record<string, any>) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number, customData?: Record<string, any>) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  calculateCartTotal: () => void;
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

      fetchProducts: async (params = {}) => {
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
        try {
          set({ cartLoading: true, cartError: null });

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

          // Calculate totals
          get().calculateCartTotal();
        } catch (error) {
          set({
            cartError: error instanceof Error ? error.message : "Failed to fetch cart",
            cartLoading: false,
          });
        }
      },

      addToCart: async (productId: string, quantity: number, customData?: Record<string, any>) => {
        try {
          set({ cartLoading: true, cartError: null });

          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              product_id: productId,
              quantity,
              custom_data: customData,
            }),
          });

          const apiResponse: ApiResponse<CartItem> = await response.json();

          if (!response.ok) {
            throw new Error(apiResponse.error || "Failed to add item to cart");
          }

          // Refresh cart items
          // toast.success(`Added ${quantity} item(s) to cart`);
          await get().fetchCartItems();
        } catch (error) {
          set({
            cartError: error instanceof Error ? error.message : "Failed to add to cart",
            cartLoading: false,
          });
        }
      },

      updateCartItem: async (itemId: string, quantity: number, customData?: Record<string, any>) => {
        try {
          set({ cartLoading: true, cartError: null });

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

          const response = await fetch('/api/cart', {
            method: 'DELETE',
          });

          const apiResponse: ApiResponse<void> = await response.json();

          if (!response.ok) {
            throw new Error(apiResponse.error || "Failed to clear cart");
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

      calculateCartTotal: () => {
        const { cartItems, products } = get();
        let total = 0;
        let itemCount = 0;

        cartItems.forEach(item => {
          const product = products.find(p => p.id === item.product_id);
          if (product && product.price) {
            total += product.price * item.quantity;
          }
          itemCount += item.quantity;
        });

        set({ cartTotal: total, cartItemCount: itemCount });
      },
    }),
    {
      name: 'main-store',
      partialize: (state) => ({
        cartItems: state.cartItems,
        cartTotal: state.cartTotal,
        cartItemCount: state.cartItemCount,
      }),
    }
  )
);
